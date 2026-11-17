/** Browser-side runtime values captured once by the plugin apply function. */

import type { SessionsApi, WorkspacesApi } from './chat-a2ui/types'

export interface ChatHostRuntime {
  sessions: SessionsApi
  workspaces: WorkspacesApi
  openSession: (sessionId: string) => void
  openWorkspace: (
    workspaceId: string,
    beforeOpen?: (sessionId: string) => void,
    options?: { agentPreset?: string },
  ) => Promise<void>
}

let runtime: ChatHostRuntime | undefined

/** Install the runtime captured at plugin activation. */
export function installChatRuntime (value: ChatHostRuntime): void {
  runtime = value
}

/** Read the active runtime; throws when a component renders outside the plugin. */
export function getChatRuntime (): ChatHostRuntime {
  if (runtime === undefined) throw new Error('chat-a2ui: runtime is not installed')
  return runtime
}
