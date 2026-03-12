// In-memory rate limiting store
// One submission per email per 24-hour rolling window
// Note: this resets on server restart. For persistent limiting, swap for Redis (REDIS_URL env var).

interface RateLimitEntry {
  timestamp: number
}

const store = new Map<string, RateLimitEntry>()

const WINDOW_MS = 24 * 60 * 60 * 1000 // 24 hours

function normalise(email: string): string {
  return email.toLowerCase().trim()
}

export function checkRateLimit(email: string): { allowed: boolean } {
  const key = normalise(email)
  const now = Date.now()
  const entry = store.get(key)

  if (!entry) return { allowed: true }

  if (now - entry.timestamp > WINDOW_MS) {
    store.delete(key)
    return { allowed: true }
  }

  return { allowed: false }
}

export function recordSubmission(email: string): void {
  const key = normalise(email)
  store.set(key, { timestamp: Date.now() })
}
