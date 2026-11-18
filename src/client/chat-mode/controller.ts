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
import type { SessionsApi, UseSessions, WorkspacesApi } from '../chat-a2ui/types'
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

/** Read the list snapshot without letting a Host failure break mounting. */
function readRows (sessions: SessionsApi): ReturnType<typeof listChatSessions> {
  try {
    return listChatSessions(sessions.list.getSnapshot())
  } catch (error) {
    console.warn('[chat-a2ui] 读取 Chat 会话列表失败：', error)
    return []
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
        inject: () => ({ controller: this }),
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
    const rows = readRows(this.deps.sessions)
    if (!this.mounted || generation !== this.generation) return
    if (this.state.pendingNew) {
      await this.createNew(undefined, generation)
      return
    }
    const target = pickChatSession(rows, this.state.activeSessionId)
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

  /** Actual creation body, split out so createNew can own the in-flight promise. */
  private async createNewRun (
    parentSessionId: string | undefined,
    generation: number,
  ): Promise<string | undefined> {
    this.setState({ phase: 'opening', error: null })
    const created = await createChatSession({
      sessions: this.deps.sessions,
      workspaces: this.deps.workspaces,
    }, parentSessionId)
    const current = this.mounted && generation === this.generation
    if (created !== undefined) {
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
