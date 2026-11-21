/** Minimal structural types shared by the chat renderer and its tests. */

export type NodeKey = string

/** Opaque attachment reference passed back to the injected image loader. */
export interface ImageAttachmentRef {
  attachmentId: string
  mediaType: string
  bytes: number
  width: number
  height: number
  name?: string
}

export interface TextBlock { type: 'text'; text: string }
export interface ReasoningBlock { type: 'reasoning'; text: string }
export interface ImageBlock { type: 'image'; attachment: ImageAttachmentRef; offloaded?: true }
export interface FileBlock { type: 'file'; attachment: { attachmentId: string; name: string; bytes: number } }
export interface ToolCallContentBlock { type: 'tool-call'; id: string; name: string; arguments: string }
export interface UnknownContentBlock { type: string; [key: string]: unknown }

export type ContentBlock =
  | TextBlock
  | ReasoningBlock
  | ImageBlock
  | FileBlock
  | ToolCallContentBlock
  | UnknownContentBlock

export type AssistantBlock =
  | { kind: 'text'; text: string }
  | { kind: 'reasoning'; text: string }
  | { kind: 'image'; attachment: ImageAttachmentRef }
  | { kind: 'tool-call'; callId: string; name: string; argsRaw: string }
  | { kind: 'other'; block: unknown }

export interface UserMessageData {
  kind: 'user'
  messageId?: string
  seq: number
  time: number
  content: readonly ContentBlock[]
  source?: unknown
}

export interface AssistantData {
  kind: 'assistant-step'
  status: 'running' | 'settled' | 'interrupted'
  turn: number
  step: number
  blocks: readonly AssistantBlock[]
  time: number
  usage?: unknown
  finalNode?: { messageId?: string }
}

export interface SteeringData extends Omit<UserMessageData, 'kind'> { kind: 'steering' }
export interface ContextData extends Omit<UserMessageData, 'kind'> { kind: 'context' }

export interface ToolCallData {
  kind: 'tool-call'
  root: {
    callId?: string
    id?: string
    name: string
    argsRaw?: string
    phase?: 'preparing' | 'start'
    kind?: string
    isError?: boolean
    content?: readonly ContentBlock[]
    error?: { name?: string; code?: string; reason?: string }
  }
}

export interface TurnTailData {
  kind: 'turn-tail'
  turn: number
  seq: number
  time: number
  closing: AssistantData | null
  branchUnavailable: boolean
  tokenUsage?: unknown
}

export interface CommandData {
  kind: 'command'
  seq: number
  name: string | null
  args: string | null
  outcome?: { kind: 'success' | 'error'; text?: string } | null
}

export interface CompactionData {
  kind: 'compaction'
  seq: number
  time: number
  summary: string | null
  shadowedItemCount: number | null
  shadowedTokenCount: number | null
}

export interface ManualCompactionData {
  kind: 'manual-compaction'
  command: CommandData
  compaction: CompactionData | null
}

export interface UnknownData {
  kind: 'unknown'
  seq: number
  time: number
  type: string
  data: unknown
}

export type ChatNodeData =
  | UserMessageData
  | SteeringData
  | ContextData
  | AssistantData
  | ToolCallData
  | TurnTailData
  | CommandData
  | CompactionData
  | ManualCompactionData
  | UnknownData
  | { kind: string; [key: string]: unknown }

/** One ordered node in the Chat target snapshot. */
export interface ChatNode {
  key: string
  kind: string
  id: string
  target: string
  data: ChatNodeData
  visibility?: 'visible' | 'hidden'
}

export interface ChatSnapshot {
  order: readonly string[]
  nodes: {
    get: (key: string) => ChatNode | undefined
  }
}

export interface SessionSnapshot {
  running?: boolean
  blank?: boolean
  openState?: string
  openError?: unknown
  /** True after the first prompt was submitted but before the first turn opens. */
  awaitingFirstTurn?: boolean
  /** True once the composer submitted at least one prompt in this Session. */
  promptAttempted?: boolean
}

/** The Conversation projection slice used to choose the shell phase. */
export interface ConversationSnapshotLike {
  activeTargets: { size: number }
}

/** A retained Session generation, structurally compatible with the Host value. */
export interface SessionReferenceLike {
  readonly sessionId: string
  readonly binding: unknown
  readonly ready: Promise<unknown>
  release(): void
}

export interface SessionSummaryLike {
  id: string
  cwd?: string
  blank?: boolean
  title?: string
  displayTitle?: string
  running?: boolean
  updatedAt?: number
  projectionValues?: { agentPreset?: unknown }
}

export interface SessionListSnapshot {
  ids: readonly string[]
  byId: Record<string, SessionSummaryLike | undefined>
}

export interface WorkspaceSummaryLike {
  workspaceId: string
  path?: string
  sessionIds?: readonly string[]
}

export interface WorkspacesApi {
  list: {
    getSnapshot: () => { items: readonly WorkspaceSummaryLike[] }
  }
  /**
   * 注册一个**已存在**的目录为 workspace（宿主契约：路径必须存在且是全限定路径）。
   * 测试替身可以省略；省略时 Chat 工作区拿不到 id，会话退回宿主默认目录。
   */
  create?: (input: { path: string }) => Promise<{ workspaceId: string }>
}

export interface SessionsApi {
  create: (options?: { cwd?: string; workspaceId?: string; sessionId?: string; agentPreset?: string }) => Promise<string>
  fork: (options: {
    sessionId: string
    atSeq?: number
    increaseTitle?: boolean
    onCreated?: (childId: string) => void
  }) => Promise<string>
  /** Present on the real Host service; tests can omit it when only actions run. */
  retain?: (target: string, options: { source: string }) => SessionReferenceLike
  list: {
    getSnapshot: () => SessionListSnapshot
    subscribe: (listener: () => void) => () => void
  }
}

export type UseChat = <T>(selector: (snapshot: ChatSnapshot) => T) => T
export type UseSession = <T>(selector: (snapshot: SessionSnapshot) => T) => T
export type UseSessions = <T>(selector: (snapshot: SessionListSnapshot) => T) => T

export interface ChatViewInjected {
  /** 宿主解析图片地址；原生实现返回 Promise，测试替身可以同步返回。 */
  loadImage: (attachment: ImageAttachmentRef) => string | Promise<string>
  forkAt: (seq: number) => void | Promise<void>
}

export interface ChatViewProps extends ChatViewInjected {
  sessionId: string
  useSession: UseSession
  useChat: UseChat
  useSessions: UseSessions
}

export interface NewChatInjected {
  createChat: () => Promise<string | undefined>
}

export interface NewChatProps extends NewChatInjected {
  sessionId: string
}
