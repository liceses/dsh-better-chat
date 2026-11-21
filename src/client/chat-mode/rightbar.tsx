/**
 * 右栏 Chat tab：把一段完整对话挂到宿主的右侧边栏，并让这个 tab 自己选会话。
 *
 * 抄的是宿主 `subagentchat` 那条链（唯一成套的先例）：
 * 1. tab 正文声明一个 session 作用域子 slot → 拿到 `SessionProvider`
 * 2. 默认用**不带 session 的** `<SessionProvider>`：继承 tab 自己所在的会话
 * 3. 用户在顶部下拉里换到别的 Chat 会话时，才 `sessions.retain(id)` 拿一份引用，
 *    用 `<SessionProvider session={reference}>` 显式覆盖这棵子树；切走 / 卸载时 release
 * 4. 子 slot 里用 `renderFactorySlot('conversation.content', …)` 复用宿主的会话工厂，
 *    views 固定成 chat
 *
 * 这样右栏拿到的是**真正对话**（消息、工具卡、输入框都在），而不是另画一套。
 */

import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ChangeEvent, ComponentType, ReactElement, ReactNode } from 'react'
import { cls } from '../chat-a2ui/classes'
import { useChatStyles } from '../chat-a2ui/style'
import type { SessionReferenceLike, SessionsApi, UseSessions } from '../chat-a2ui/types'
import { RIGHTBAR_SESSION_SOURCE } from '../constants'
import { buildRightbarSessionOptions, rightbarRetainTarget } from './rightbar-picker'
import { listChatSessions } from './select'

/** tab 类型 id（同时是 keyed slot 的 key）。 */
export const RIGHTBAR_CHAT_ID = 'chat-a2ui.chat'

/** 子 slot 名：会话作用域，渲染器会为它注入 SessionProvider。 */
export const RIGHTBAR_CHAT_CONVERSATION = 'chat-a2ui.rightbar.conversation'

/**
 * 右栏 tab 正文能拿到的注入面（只声明我们用到的）。
 *
 * `sessionId` / `useSessions` / `SessionProvider` / `renderSlot` 是宿主的
 * session 作用域标准注入；`sessions` 是注册时用 `inject` 额外带进来的服务。
 */
export interface RightbarChatTabProps {
  /** tab 所在会话（默认就显示它）。 */
  sessionId?: string
  /** 宿主 ISessions：retain / release 会话引用用。 */
  sessions?: SessionsApi
  /** 全局标准注入的会话列表选择器。 */
  useSessions?: UseSessions
  /** 不给 session 时继承外层的会话绑定。 */
  SessionProvider?: ComponentType<{ session?: SessionReferenceLike; children?: ReactNode }>
  /** 渲染本注册声明的子 slot。 */
  renderSlot?: (name: string, props?: Record<string, unknown>) => ReactNode
}

/** 子 slot 拿到的注入面。 */
interface ConversationProps {
  renderFactorySlot?: (
    name: string,
    props?: Record<string, unknown>,
    overrides?: { slots?: Record<string, ComponentType<{ renderSlot: (name: string, props?: Record<string, unknown>) => ReactNode }>> },
  ) => ReactNode
}

/** 一份自己 retain 来的会话引用，连同它对应的会话 id。 */
interface RetainedSession {
  /** id 用来判断这份引用是否还对应当前目标（不同目标之间不能复用）。 */
  id: string
  reference: SessionReferenceLike
}

/** 固定会话内容的注入面（下拉版与兜底版共用）。 */
interface ConversationHostProps {
  SessionProvider: NonNullable<RightbarChatTabProps['SessionProvider']>
  renderSlot: NonNullable<RightbarChatTabProps['renderSlot']>
}

/** 固定在 chat 视图上（不跟随用户在主区的视图选择）。 */
function FixedChatView (props: {
  renderSlot: (name: string, props?: Record<string, unknown>) => ReactNode
}): ReactElement {
  return <>{props.renderSlot('conversation.session', { view: 'chat' })}</>
}

/** 子 slot 的正文：复用宿主的 conversation.content 工厂。 */
export function RightbarChatConversation ({ renderFactorySlot }: ConversationProps): ReactElement {
  if (typeof renderFactorySlot !== 'function') return <></>
  return <>{renderFactorySlot('conversation.content', {
    variant: 'embedded',
    phase: 'active',
    hero: false,
  }, { slots: { views: FixedChatView } })}</>
}

/**
 * 没有下拉时的正文：和加下拉之前完全一样。
 * 旧宿主 / 测试替身没给 `sessionId` 或 `useSessions` 时走这条路径。
 */
function BareConversation ({ SessionProvider, renderSlot }: ConversationHostProps): ReactElement {
  return (
    <SessionProvider>
      {renderSlot(RIGHTBAR_CHAT_CONVERSATION, {})}
    </SessionProvider>
  )
}

/**
 * 正文：顶部一行会话下拉 + 会话内容。
 *
 * 默认继承 tab 自己的会话绑定（不 retain、不碰引用计数）；只有用户明确选了别的
 * Chat 会话时，才自己持一份引用。引用与目标 id 一起进 state，保证「显示的会话」
 * 与「手里那份引用」永远是同一个。
 */
function RightbarSessionTab ({
  sessionId,
  sessions,
  useSessions,
  SessionProvider,
  renderSlot,
}: {
  sessionId: string
  sessions: SessionsApi | undefined
  useSessions: UseSessions
  SessionProvider: ConversationHostProps['SessionProvider']
  renderSlot: ConversationHostProps['renderSlot']
}): ReactElement {
  useChatStyles()
  // 宿主快照：下拉的数据源。返回 state 本身，列表一变就重渲染。
  const snapshot = useSessions(state => state)
  const rows = useMemo(() => listChatSessions(snapshot), [snapshot])
  const ownSummary = snapshot.byId[sessionId]
  /** 用户在下拉里显式选过的会话；undefined = 跟随本 tab 会话。 */
  const [preferred, setPreferred] = useState<string | undefined>(undefined)
  /** 别的会话的引用：null 表示「没在别处看」或「还没拿到」。 */
  const [retained, setRetained] = useState<RetainedSession | null>(null)
  /** 切换失败时的说明（不白屏，只是提示一句）。 */
  const [notice, setNotice] = useState<string | null>(null)
  const canSwitch = typeof sessions?.retain === 'function'

  // tab 被换到另一个会话上：上一个 tab 会话的选择不再成立，回到默认。
  // 引用本身由下面的 effect 负责 release（目标随 preferred 归零而消失）。
  useEffect(() => {
    setPreferred(undefined)
    setNotice(null)
  }, [sessionId])

  const { options, target } = useMemo(() => buildRightbarSessionOptions({
    rows,
    ownSessionId: sessionId,
    ownSummary,
    // 宿主不支持 retain 时不接受「看别的会话」，下拉也就不显示。
    preferredId: canSwitch ? preferred : undefined,
  }), [rows, sessionId, ownSummary, preferred, canSwitch])

  /** 这一帧需要自己 retain 的会话；undefined 表示继承外层绑定。 */
  const retainTarget = canSwitch ? rightbarRetainTarget(target, sessionId) : undefined

  // 引用的唯一归属处：目标一变，cleanup 先 release 旧的，再由新一次 effect retain 新的；
  // 组件卸载时同一段 cleanup 也会把最后一份放掉，所以不会留下悬空绑定。
  useEffect(() => {
    if (retainTarget === undefined) {
      setRetained(null)
      return
    }
    const api = sessions
    if (api === undefined || typeof api.retain !== 'function') {
      setRetained(null)
      return
    }
    let reference: SessionReferenceLike
    try {
      // 方法要留在服务对象上调用：retain 读自己的 closed 标志，摘出来会丢 this。
      reference = api.retain(retainTarget, { source: RIGHTBAR_SESSION_SOURCE })
    } catch (error) {
      // 不白屏：退回「只显示本 tab 会话」，并把下拉的选中项一起拨回去。
      console.warn('[chat-a2ui] 右栏切换会话失败，已退回本 tab 的会话：', error)
      setRetained(null)
      setPreferred(undefined)
      setNotice('切换会话失败，已回到本 tab 的会话')
      return
    }
    setRetained({ id: retainTarget, reference })
    setNotice(null)
    return () => { reference.release() }
  }, [retainTarget, sessions])

  const handleChange = useCallback((event: ChangeEvent<HTMLSelectElement>) => {
    const next = event.currentTarget.value
    setNotice(null)
    // 选回本 tab 会话就清掉偏好：又回到「继承外层绑定」的路径。
    setPreferred(next === sessionId ? undefined : next)
  }, [sessionId])

  // 只有一行时不画下拉：右栏窄，一个选不出别的会话的控件只是噪音。
  const showPicker = canSwitch && options.length > 1
  const value = target ?? sessionId

  let body: ReactNode
  if (retainTarget === undefined) {
    body = <SessionProvider>{renderSlot(RIGHTBAR_CHAT_CONVERSATION, {})}</SessionProvider>
  } else if (retained !== null && retained.id === retainTarget) {
    body = (
      <SessionProvider session={retained.reference}>
        {renderSlot(RIGHTBAR_CHAT_CONVERSATION, {})}
      </SessionProvider>
    )
  } else {
    // 引用还没落地的这一帧：先别画旧会话，免得下拉与正文说的是两个人。
    body = <div className={cls.chatRightbarSwitching} role="status">正在切换对话…</div>
  }

  return (
    <div className={cls.chatRightbar} data-caui-rightbar="">
      {showPicker && (
        <div className={cls.chatRightbarBar}>
          <select
            className={cls.chatRightbarSelect}
            data-caui-rightbar-select=""
            aria-label="选择这个 tab 显示的会话"
            title="选择这个 tab 显示的 Chat 会话"
            value={value}
            onChange={handleChange}
          >
            {options.map(option => (
              <option key={option.id} value={option.id}>{option.label}</option>
            ))}
          </select>
        </div>
      )}
      {notice !== null && (
        <div className={cls.chatRightbarNotice} role="status">{notice}</div>
      )}
      <div className={cls.chatRightbarBody}>{body}</div>
    </div>
  )
}

/**
 * tab 正文：默认显示 tab 所在会话；宿主给了会话列表钩子时，顶部多一行会话下拉。
 * @param props - 宿主标准注入 + 注册时额外 inject 的 sessions。
 */
export function RightbarChatTab (props: RightbarChatTabProps): ReactElement {
  const { sessionId, useSessions, SessionProvider, renderSlot } = props
  if (SessionProvider === undefined || renderSlot === undefined) return <></>
  if (typeof sessionId !== 'string' || sessionId.length === 0 || typeof useSessions !== 'function') {
    // 没有会话身份或列表钩子（旧宿主 / 测试替身）：保持「只显示本会话」。
    return <BareConversation SessionProvider={SessionProvider} renderSlot={renderSlot} />
  }
  return (
    <RightbarSessionTab
      sessionId={sessionId}
      sessions={props.sessions}
      useSessions={useSessions}
      SessionProvider={SessionProvider}
      renderSlot={renderSlot}
    />
  )
}

/**
 * 把 tab 类型、正文与子 slot 注册进宿主。
 * @param slots - 宿主 slots 服务。
 * @param tabs - 宿主 sidebarRightTabs 服务。
 * @param sessions - 宿主 ISessions；下拉切换会话时用它 retain / release 引用。
 * @returns 注销函数列表（插件卸载时用）。
 */
export function registerRightbarChat (
  slots: {
    inject: (name: string, register: () => (() => void) | void) => void
    register: (options: Record<string, unknown>, component: unknown) => () => void
  },
  tabs: { register: (definition: Record<string, unknown>) => () => void },
  sessions: SessionsApi,
): Array<() => void> {
  const disposers: Array<() => void> = []
  disposers.push(tabs.register({
    id: RIGHTBAR_CHAT_ID,
    kind: 'chat',
    priority: 'extension',
    multiple: false,
    keepMounted: true,
    title: () => 'Chat',
    // guide 卡片是用户唯一能发现它的地方：pane 的「+」→ guide 页 → 这张卡。
    guide: [{ order: 25, title: 'Chat', description: '在右栏和 Chat 对话' }],
  }))
  slots.inject('sidebar.right.pane.tab', () => slots.register({
    name: 'sidebar.right.pane.tab',
    key: RIGHTBAR_CHAT_ID,
    children: { [RIGHTBAR_CHAT_CONVERSATION]: { kind: 'single', scope: 'session' } },
    // 宿主只注入会话作用域的标准面；retain/release 用的服务要自己顺手带进来。
    inject: () => ({ sessions }),
  }, RightbarChatTab))
  slots.inject(RIGHTBAR_CHAT_CONVERSATION, () => slots.register({
    name: RIGHTBAR_CHAT_CONVERSATION,
  }, RightbarChatConversation))
  return disposers
}
