/** Host preset registration: custom system prompt and defaults. */

import { describe, expect, it, vi } from 'vitest'
import { apply, CHAT_SYSTEM_PROMPT } from '../src/index'

function harness (): { register: ReturnType<typeof vi.fn>; ctx: { agentPresets: { register: ReturnType<typeof vi.fn> } } } {
  const register = vi.fn(async () => async () => {})
  return { register, ctx: { agentPresets: { register } } }
}

describe('chat preset', () => {
  it('registers the chat preset with web-only persona defaults', async () => {
    const { register, ctx } = harness()
    apply(ctx, {})
    await Promise.resolve()
    expect(register).toHaveBeenCalledTimes(1)
    const definition = register.mock.calls[0]![0] as {
      id: string
      name: string
      plugins: { id: string; config: { prefix: string; complete: boolean; includeRuntimeContext: boolean } }[]
    }
    expect(definition.id).toBe('chat')
    expect(definition.name).toBe('Chat')
    expect(definition.plugins[0]!.config.prefix).toBe(CHAT_SYSTEM_PROMPT)
    expect(definition.plugins[0]!.config.complete).toBe(true)
    expect(definition.plugins[0]!.config.includeRuntimeContext).toBe(false)
    expect(definition.plugins[1]!.id).toBe('chat-tool-filter')
  })

  it('uses a custom system prompt and can keep runtime context', async () => {
    const { register, ctx } = harness()
    apply(ctx, { systemPrompt: '只回答一句话。', includeRuntimeContext: true })
    await Promise.resolve()
    const definition = register.mock.calls[0]![0] as {
      plugins: { id: string; config: { prefix: string; includeRuntimeContext: boolean } }[]
    }
    expect(definition.plugins[0]!.config.prefix).toBe('只回答一句话。')
    expect(definition.plugins[0]!.config.includeRuntimeContext).toBe(true)
  })
})