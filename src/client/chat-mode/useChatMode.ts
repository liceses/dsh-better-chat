/** Subscribe a component to the Chat-mode controller. */

import { useSyncExternalStore } from 'react'
import type { ChatModeController, ChatModeState } from './controller'

/**
 * Read the controller's current state and rerender on updates.
 * @param controller - the plugin-owned Chat-mode controller.
 * @returns the current mode state.
 */
export function useChatMode (controller: ChatModeController): ChatModeState {
  return useSyncExternalStore(
    controller.subscribe,
    controller.getSnapshot,
    controller.getSnapshot,
  )
}
