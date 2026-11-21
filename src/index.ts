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

import { mkdirSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'

/** 页面全局名：客户端半从这里读 Chat 工作区的绝对路径（webserver/index-inject 推入）。 */
export const CHAT_PATHS_GLOBAL = '__DSH_CHAT_A2UI_PATHS__'

/**
 * 解析 DSH 家目录的绝对路径。
 *
 * 优先用宿主提供的 `dshHomePath` 服务（它已经按 `$DSH_HOME` 解析过），
 * 退回到环境变量与 `~/.dsh`。只在宿主运行时（Node）执行。
 * @param ctx - 宿主上下文；可能没有 dshHomePath（旧版宿主或测试替身）。
 * @returns 绝对路径。
 */
export function resolveDshHome (ctx: { dshHomePath?: () => string }): string {
  try {
    if (typeof ctx.dshHomePath === 'function') {
      const value = ctx.dshHomePath()
      if (typeof value === 'string' && value.length > 0) return value
    }
  } catch {
    // 服务缺失或抛错都退回环境变量，不阻断插件加载。
  }
  const fromEnv = typeof process === 'undefined' ? undefined : process.env.DSH_HOME
  if (typeof fromEnv === 'string' && fromEnv.trim().length > 0) return fromEnv.trim()
  return join(homedir(), '.dsh')
}

/** Chat 工作区的绝对路径：家目录下的 `chat`。 */
export function chatWorkspacePath (ctx: { dshHomePath?: () => string }): string {
  return join(resolveDshHome(ctx), 'chat')
}

/**
 * Register the chat preset. A duplicate id is logged rather than allowed to
 * tear down the whole profile: another package may already provide a preset
 * with this identity.
 * @param ctx - host context carrying the preset registry.
 * @returns disposer that unregisters the preset when the plugin unloads.
 */
export function apply(ctx: {
  agentPresets: { register: (definition: unknown) => Promise<() => Promise<void>> }
  dshHomePath?: () => string
  on?: (event: string, listener: (table: unknown[]) => void) => void
  logger?: { warn: (message: string) => void }
}, config: ChatPluginConfig = {}): () => void {
  // Chat 工作区的目录由宿主半创建（只有宿主半有 fs 权限），路径再推给客户端半。
  // 客户端侧的 workspaces.create 只接受**已存在**的目录，所以顺序不能反。
  const workspacePath = chatWorkspacePath(ctx)
  try {
    mkdirSync(workspacePath, { recursive: true })
  } catch (error) {
    ctx.logger?.warn(`chat-a2ui: could not create the chat workspace directory (${workspacePath}): ${error instanceof Error ? error.message : String(error)}`)
  }
  ctx.on?.('webserver/index-inject', (table: unknown[]) => {
    table.push({ kind: 'global', name: CHAT_PATHS_GLOBAL, value: { chatWorkspace: workspacePath } })
  })

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
        id: 'chat-web-tools',
        name: '@deepseek-ai/dsh-tool-web',
        config: {
          fetch: true,
          searchTimeoutMs: 60000,
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