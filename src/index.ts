/**
 * Host half of dsh-chat-a2ui.
 *
 * Owns one agent preset: a complete conversational persona plus a scope-local
 * tool restriction that leaves only the two web tools visible. The browser
 * half registers the chat Conversation View and the New Chat action.
 * @module dsh-chat-a2ui
 */

/** Cordis plugin name used in loader diagnostics. */
export const name = 'chat-a2ui'

/** Host services required before the preset can be registered. */
export const inject = ['agentPresets']

/** Deployment overrides for the chat preset. */
export interface ChatPluginConfig {
  /** Replace the built-in conversational system prompt. */
  systemPrompt?: string
  /** Preset title shown in the new-session roster. */
  presetName?: string
  /** Preset description shown in the new-session roster. */
  presetDescription?: string
  /** Keep the dynamic runtime-context snapshot in the system prompt. */
  includeRuntimeContext?: boolean
}

/** Complete system prompt for the chat preset. */
export const CHAT_SYSTEM_PROMPT = `You are a conversational assistant inside DeepSeek Harness.

Your job is to talk with the person in front of you: answer questions, explain ideas, compare options, and help them think. Be direct, warm, and specific. Match the user's language.

Tools:
- You may use web_search and web_fetch when current information is needed. Do not claim to have searched or read something you did not.
- You have no filesystem, shell, or code-execution tools. Never say you wrote, ran, installed, or changed anything on the host.
- Prefer answering from the conversation. Search only when it adds real value.

Formatting:
- Use clean Markdown: short paragraphs, lists when they help, tables only for real comparisons.
- Do not emit raw HTML.
- Keep answers focused. Ask one clarifying question when the request is genuinely ambiguous.

This preset is chat-only by design. When the interface supports A2UI surfaces, the chat surface may render structured blocks; until then, plain Markdown is the complete answer format.`

/**
 * Register the chat preset. A duplicate id is logged rather than allowed to
 * tear down the whole profile: another package may already provide a preset
 * with this identity.
 * @param ctx - host context carrying the preset registry.
 * @returns disposer that unregisters the preset when the plugin unloads.
 */
export function apply(ctx: {
  agentPresets: { register: (definition: unknown) => Promise<() => Promise<void>> }
  logger?: { warn: (message: string) => void }
}, config: ChatPluginConfig = {}): () => void {
  const prompt = config.systemPrompt?.trim() ? config.systemPrompt : CHAT_SYSTEM_PROMPT
  const ready = ctx.agentPresets.register({
    id: 'chat',
    name: config.presetName ?? 'Chat',
    description: config.presetDescription ?? 'Conversational assistant with web tools only. No filesystem or shell.',
    order: 20,
    plugins: [
      {
        id: 'chat-persona',
        name: '@deepseek-ai/dsh-persona',
        config: {
          prefix: prompt,
          complete: true,
          includeRuntimeContext: config.includeRuntimeContext ?? false,
        },
      },
      {
        id: 'chat-tool-filter',
        name: 'dsh-chat-a2ui/preset/tool-filter',
      },
    ],
  })
  let dispose: (() => Promise<void>) | undefined
  let disposed = false
  void ready.then((value) => {
    if (disposed) void value()
    else dispose = value
  }).catch((error: unknown) => {
    ctx.logger?.warn(`chat-a2ui: could not register the chat preset: ${error instanceof Error ? error.message : String(error)}`)
  })
  return () => {
    disposed = true
    if (dispose !== undefined) void dispose()
  }
}