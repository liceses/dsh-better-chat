/** Small renderer helpers with no DSH dependency. */

/** Join truthy class names. */
export function cx (...values: readonly (string | false | null | undefined)[]): string {
  return values.filter(Boolean).join(' ')
}

/** Format a timestamp as a compact local clock value. */
export function formatClock (time: number): string {
  try {
    return new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  } catch {
    return ''
  }
}

/** Format a byte count for a compact attachment chip. */
export function formatBytes (bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return ''
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

/** Pretty-print a JSON string, or return the original when it is not JSON. */
export function prettyJson (raw: string, max = 4000): string {
  let text = raw
  try {
    text = JSON.stringify(JSON.parse(raw), null, 2)
  } catch {
    // Keep the model's raw argument text.
  }
  return text.length > max ? text.slice(0, max) + '…' : text
}

/** Read the first line of a possibly multi-line string. */
export function firstLine (text: string): string {
  const index = text.indexOf('\n')
  return index < 0 ? text : text.slice(0, index)
}
