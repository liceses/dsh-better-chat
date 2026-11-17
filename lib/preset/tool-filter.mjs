/**
 * Scope-local tool mask for the chat preset.
 *
 * The deployment registers web_search/web_fetch globally. Allow exactly those
 * two names; when a deployment omits them, fall back to denying every other
 * known global tool so a chat session can never reach the filesystem, shell,
 * or code execution by accident.
 * @module dsh-chat-a2ui/preset/tool-filter
 */

/** Cordis plugin name. */
export const name = 'chat-tool-filter'

/** Services required by the scoped restriction. */
export const inject = ['tools']

/** The only global tools a chat agent may call. */
const WEB_TOOLS = ['web_search', 'web_fetch']

/**
 * Apply the web-only restriction to this preset's agent scope.
 * @param ctx - preset-scoped Cordis context.
 */
export function apply(ctx) {
  ctx.effect(() => {
    try {
      return ctx.tools.restrict({ allow: WEB_TOOLS })
    } catch (error) {
      const schemas = typeof ctx.tools.schemas === 'function' ? ctx.tools.schemas() : []
      const known = new Set(schemas.map((schema) => schema?.name).filter((value) => typeof value === 'string'))
      const deny = [...known].filter((toolName) => !WEB_TOOLS.includes(toolName) && toolName !== 'run_code')
      if (deny.length === 0) throw error
      ctx.logger?.warn?.(
        `chat-a2ui: web tools are not registered globally; denying ${deny.length} other global tool(s) instead`,
      )
      return ctx.tools.restrict({ deny })
    }
  }, 'chat-a2ui: web-only tool restriction')
}
