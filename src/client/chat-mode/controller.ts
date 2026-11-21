/**
 * Lifecycle and navigation for the dedicated Chat panel.
 *
 * The Chat page does not use uiWorkspace.openSession: that would replace the
 * native mainView and, inside a panel, kick the main column back to
 * "conversation". Instead the page retains its own Session reference and this
 * controller only owns selection, creation, branching, and the Chat sidebar
 * occupant.
 */

import type { ComponentType } from 'react'
import { CHAT_PANEL_ID } from '../constants'
import type { SessionListSnapshot, SessionsApi, UseSessions, WorkspacesApi } from '../chat-a2ui/types'
import { createChatSession, forkChatAt } from '../session/actions'
import { listChatSessions, pickChatSession } from './select'

/** Props the controller injects into the Chat sidebar occupant. */
export interface ChatSidebarProps {
  controller: ChatModeController
  useSessions: UseSessions
}

/** Rendered in the sidebar workspace area while Chat mode is mounted. */
export type ChatSidebarComponent = ComponentType<ChatSidebarProps>

/** Minimal Slots face needed to install and withdraw the sidebar occupant. */
export interface ChatModeSlots {
  register: (options: Record<string, unknown>, component: unknown) => () => void
}

/** Minimal layout face needed to enter/leave the Chat panel. */
export interface ChatModeLayout {
  selectPanel: (panelId: string | null) => void
}

/** Host services captured when the plugin applies. */
export interface ChatModeDeps {
  sessions: SessionsApi
  workspaces?: WorkspacesApi
  slots: ChatModeSlots
  layout: ChatModeLayout
  sidebarComponent: ChatSidebarComponent
  /**
   * 确保 Chat 工作区存在（首次创建会话前 await 一次）。
   * 失败不阻断创建：会话退回宿主默认目录，只是归属退化。
   */
  ensureChatWorkspace?: () => Promise<void>
  /** 当前 Chat 工作区 id；没准备好时返回 undefined。 */
  chatWorkspaceId?: () => string | undefined
  /** 归档一个会话（宿主全局归档集，可撤销）；没有时列表不渲染归档按钮。 */
  archiveSession?: (sessionId: string) => Promise<void>
}

/** Coarse state exposed to the page, header, and sidebar list. */
export interface ChatModeState {
  mounted: boolean
  activeSessionId: string | null
  phase: 'idle' | 'opening' | 'ready' | 'error'
  error: string | null
  /** A new-Session request was made before the Chat panel mounted. */
  pendingNew: boolean
}

const INITIAL_STATE: ChatModeState = {
  mounted: false,
  activeSessionId: null,
  phase: 'idle',
  error: null,
  pendingNew: false,
}

/** 读宿主会话快照；失败时返回 null（不阻断挂载）。 */
function readSnapshot (sessions: SessionsApi): SessionListSnapshot | null {
  try {
    return sessions.list.getSnapshot()
  } catch (error) {
    console.warn('[chat-a2ui] 读取会话快照失败：', error)
    return null
  }
}

/**
 * Small observable controller. React reads it through useSyncExternalStore;
 * every mutation replaces the state object so snapshots compare by identity.
 */
export class ChatModeController {
  private readonly deps: ChatModeDeps
  private state: ChatModeState = INITIAL_STATE
  private readonly listeners = new Set<() => void>()
  private mounted = false
  private generation = 0
  private creating: Promise<string | undefined> | null = null
  private disposeSidebar: (() => void) | null = null
  private pendingNewPromise: Promise<string | undefined> | null = null
  private resolvePendingNew: ((value: string | undefined) => void) | null = null
  /**
   * 本控制器自己创建过的会话 id（有上限）。
   *
   * 空会话在宿主里可能**还没有** agentPreset 投影，于是 listChatSessions 过滤后看不到它。
   * 如果 ensureActive 只认过滤后的列表，那么每次切回 Chat 面板都会以为「一个都没有」
   * 而再建一个空会话——这就是「反复自动创建空对话」。所以自动路径必须同时认
   * 「宿主快照里还在」和「我们自己刚建过」这两种事实。
   */
  private readonly createdIds = new Set<string>()

  constructor (deps: ChatModeDeps) {
    this.deps = deps
  }

  /** Stable snapshot reader for useSyncExternalStore. */
  getSnapshot = (): ChatModeState => this.state

  /** Stable subscriber for useSyncExternalStore. */
  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener)
    return () => { this.listeners.delete(listener) }
  }

  /** Replace one or more state fields and notify every reader. */
  private setState (patch: Partial<ChatModeState>): void {
    this.state = { ...this.state, ...patch }
    for (const listener of this.listeners) listener()
  }

  /** Install the Chat-session list in the sidebar workspace area. */
  private registerSidebar (): void {
    this.disposeSidebar?.()
    try {
      this.disposeSidebar = this.deps.slots.register({
        name: 'sidebar.workspaces',
        priority: -10,
        inject: () => ({ controller: this, archive: this.deps.archiveSession }),
      }, this.deps.sidebarComponent)
    } catch (error) {
      console.warn('[chat-a2ui] 安装 Chat 会话列表失败：', error)
      this.disposeSidebar = null
    }
  }

  /** Remove the sidebar occupant installed by {@link mount}. */
  private releaseSidebar (): void {
    try {
      this.disposeSidebar?.()
    } catch (error) {
      console.warn('[chat-a2ui] 卸载 Chat 会话列表失败：', error)
    }
    this.disposeSidebar = null
  }

  /** Resolve a pending enterNew() call once the panel has created or failed. */
  private finishPending (value: string | undefined): void {
    const resolve = this.resolvePendingNew
    this.resolvePendingNew = null
    this.pendingNewPromise = null
    resolve?.(value)
  }

  /** Mount the page: install the list, pick a Chat Session, create one if needed. */
  mount (): void {
    if (this.mounted) return
    this.mounted = true
    this.generation += 1
    const generation = this.generation
    this.registerSidebar()
    this.setState({ mounted: true, phase: 'opening', error: null })
    void this.ensureActive(generation)
  }

  /** Withdraw the page-owned sidebar occupant but keep the last selection. */
  unmount (): void {
    if (!this.mounted) return
    this.mounted = false
    this.generation += 1
    this.releaseSidebar()
    this.finishPending(undefined)
    this.setState({ mounted: false, phase: 'idle', error: null, pendingNew: false })
  }

  /** Pick the stored active Session, the newest Chat Session, or create one. */
  private async ensureActive (generation: number): Promise<void> {
    const snapshot = readSnapshot(this.deps.sessions)
    const rows = snapshot === null ? [] : listChatSessions(snapshot)
    if (!this.mounted || generation !== this.generation) return
    if (this.state.pendingNew) {
      await this.createNew(undefined, generation)
      return
    }

    // 当前选中仍然成立就沿用它：宿主快照里还在，或者是我们自己刚建过的。
    // 空会话的 agentPreset 投影可能还没生成，不能因此把它当成「不存在」。
    //
    // 注意这里**故意**读未过滤的 snapshot.byId：listChatSessions 的 agentPreset 过滤
    // 决定的是「侧栏展示哪些」，不是「这个 id 还存不存在」。把它用在存在性判断上，
    // 就会在空会话上得出「不存在」，于是每次挂载都重建一个（本函数修的就是这个）。
    const currentId = this.state.activeSessionId
    const stillKnown = currentId !== null && (
      this.createdIds.has(currentId) || snapshot?.byId[currentId] !== undefined
    )
    if (stillKnown) {
      this.setState({ activeSessionId: currentId, phase: 'ready', error: null })
      return
    }

    const target = pickChatSession(rows, currentId)
    if (target !== undefined) {
      this.setState({ activeSessionId: target, phase: 'ready', error: null })
      return
    }
    await this.createNew(undefined, generation)
  }

  /**
   * Create a Chat Session and make it active.
   * Repeated calls share the in-flight creation so double clicks cannot create
   * two Sessions.
   */
  async createNew (
    parentSessionId?: string,
    generation: number = this.generation,
  ): Promise<string | undefined> {
    if (this.creating !== null) return this.creating
    const run = this.createNewRun(parentSessionId, generation)
    this.creating = run
    try {
      return await run
    } finally {
      if (this.creating === run) this.creating = null
    }
  }

  /** 记一个自己建过的会话：自动路径靠它避免重复创建（只留最近 50 个）。 */
  private rememberCreated (sessionId: string): void {
    this.createdIds.add(sessionId)
    if (this.createdIds.size > 50) {
      const oldest = this.createdIds.values().next().value
      if (oldest !== undefined) this.createdIds.delete(oldest)
    }
  }

  /** Actual creation body, split out so createNew can own the in-flight promise. */
  private async createNewRun (
    parentSessionId: string | undefined,
    generation: number,
  ): Promise<string | undefined> {
    this.setState({ phase: 'opening', error: null })
    // 归属先于创建：Chat 工作区没准备好就不带 workspaceId（落到默认目录），
    // 而不是先建一个无主会话再想办法搬。
    try {
      await this.deps.ensureChatWorkspace?.()
    } catch (error) {
      console.warn('[chat-a2ui] 准备 Chat 工作区失败：', error)
    }
    const created = await createChatSession({
      sessions: this.deps.sessions,
      workspaces: this.deps.workspaces,
      chatWorkspaceId: this.deps.chatWorkspaceId,
    }, parentSessionId)
    const current = this.mounted && generation === this.generation
    if (created !== undefined) {
      this.rememberCreated(created)
      this.setState({
        activeSessionId: created,
        phase: current ? 'ready' : 'idle',
        error: null,
        pendingNew: false,
      })
    } else {
      this.setState(current
        ? { phase: 'error', error: '新建对话失败，请重试', pendingNew: false }
        : { phase: 'idle', pendingNew: false })
    }
    this.finishPending(created)
    return created
  }

  /**
   * New-chat action shared by the Chat header, the native header button, and
   * the sidebar's new-session intercept. When Chat is not open yet it asks
   * the layout to open the panel and resolves after the page creates the
   * Session, so callers can still report failures.
   */
  enterNew (): Promise<string | undefined> {
    if (this.creating !== null) return this.creating
    if (this.mounted) return this.createNew(this.state.activeSessionId ?? undefined)
    if (this.pendingNewPromise !== null) return this.pendingNewPromise
    this.pendingNewPromise = new Promise<string | undefined>((resolve) => {
      this.resolvePendingNew = resolve
    })
    this.setState({ pendingNew: true, error: null })
    this.deps.layout.selectPanel(CHAT_PANEL_ID)
    return this.pendingNewPromise
  }

  /** Activate a Session without touching the native mainView or panel. */
  openSession (sessionId: string): void {
    if (sessionId.length === 0) return
    this.setState({ activeSessionId: sessionId, phase: 'ready', error: null })
  }

  /** Fork a completed turn and activate the child. */
  async branch (sessionId: string, seq: number): Promise<string | undefined> {
    const child = await forkChatAt({ sessions: this.deps.sessions }, sessionId, seq)
    if (child === undefined) return undefined
    this.setState({ activeSessionId: child, phase: 'ready', error: null })
    if (!this.mounted) this.deps.layout.selectPanel(CHAT_PANEL_ID)
    return child
  }

  /** Retry after a creation error. */
  retry (): Promise<string | undefined> {
    if (!this.mounted) {
      this.mount()
      return Promise.resolve(undefined)
    }
    return this.createNew(this.state.activeSessionId ?? undefined)
  }

  /** Return to the native conversation panel. */
  back (): void {
    this.deps.layout.selectPanel(null)
  }
}
