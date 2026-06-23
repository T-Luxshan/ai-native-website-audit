const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export async function auditUrl(url) {
  const response = await fetch(`${API_URL}/api/audit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    const detail = typeof data.detail === 'string'
      ? data.detail
      : 'Audit request failed'
    throw new Error(detail)
  }

  return data
}
