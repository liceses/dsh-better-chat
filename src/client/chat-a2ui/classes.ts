/** Stable class names shared by the chat renderer and its stylesheet. */
export const cls = {
  root: 'caui-root',
  viewport: 'caui-viewport',
  flow: 'caui-flow',
  empty: 'caui-empty',
  emptyMark: 'caui-empty-mark',
  emptyTitle: 'caui-empty-title',
  emptyHint: 'caui-empty-hint',

  row: 'caui-row',
  rowUser: 'caui-row-user',
  rowAssistant: 'caui-row-assistant',
  rowProcess: 'caui-row-process',
  rowTail: 'caui-row-tail',
  rowNotice: 'caui-row-notice',

  user: 'caui-user',
  userBubble: 'caui-user-bubble',
  userText: 'caui-user-text',
  userMeta: 'caui-user-meta',
  userImages: 'caui-user-images',

  assistant: 'caui-assistant',
  assistantText: 'caui-assistant-text',
  assistantFooter: 'caui-assistant-footer',
  messageActions: 'caui-message-actions',
  actionButton: 'caui-action-button',
  actionDone: 'caui-action-done',
  streamingCursor: 'caui-streaming-cursor',
  liveDot: 'caui-live-dot',

  reasoning: 'caui-reasoning',
  reasoningSummary: 'caui-reasoning-summary',
  reasoningBody: 'caui-reasoning-body',
  reasoningText: 'caui-reasoning-text',
  reasoningSpinner: 'caui-reasoning-spinner',

  tool: 'caui-tool',
  toolHeader: 'caui-tool-header',
  toolIcon: 'caui-tool-icon',
  toolName: 'caui-tool-name',
  toolStatus: 'caui-tool-status',
  toolChevron: 'caui-tool-chevron',
  toolBody: 'caui-tool-body',
  toolArgs: 'caui-tool-args',
  toolResult: 'caui-tool-result',
  toolError: 'caui-tool-error',
  toolChip: 'caui-tool-chip',

  turnTail: 'caui-turn-tail',
  turnTailLine: 'caui-turn-tail-line',
  branchButton: 'caui-branch-button',
  branchIcon: 'caui-branch-icon',
  tokenUsage: 'caui-token-usage',
  time: 'caui-time',

  scrollButton: 'caui-scroll-button',
  scrollButtonVisible: 'caui-scroll-button-visible',

  image: 'caui-image',
  imageButton: 'caui-image-button',
  imageCaption: 'caui-image-caption',
  imageLoading: 'caui-image-loading',
  imageFailed: 'caui-image-failed',
  lightbox: 'caui-lightbox',
  lightboxImage: 'caui-lightbox-image',
  lightboxClose: 'caui-lightbox-close',

  context: 'caui-context',
  contextSummary: 'caui-context-summary',
  contextLabel: 'caui-context-label',
  contextText: 'caui-context-text',

  notice: 'caui-notice',
  noticeIcon: 'caui-notice-icon',
  noticeText: 'caui-notice-text',

  command: 'caui-command',
  commandName: 'caui-command-name',
  commandArgs: 'caui-command-args',
  commandOutcome: 'caui-command-outcome',

  compaction: 'caui-compaction',
  compactionSummary: 'caui-compaction-summary',

  unknown: 'caui-unknown',
  unknownType: 'caui-unknown-type',
  unknownBody: 'caui-unknown-body',

  newChat: 'caui-new-chat',
  newChatButton: 'caui-new-chat-button',
  newChatIcon: 'caui-new-chat-icon',
  newChatError: 'caui-new-chat-error',

  markdown: 'caui-markdown',
  markdownLink: 'caui-markdown-link',
} as const

export type ChatClass = typeof cls[keyof typeof cls]
