import { describe, expect, it } from 'vitest'

describe('scaffold', () => {
  it('has the view identity', async () => {
    const { CHAT_VIEW_ID } = await import('../src/client/constants')
    expect(CHAT_VIEW_ID).toBe('chat-a2ui')
  })
})
