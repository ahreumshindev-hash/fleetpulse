import type { Device, TestRun, AlertEvent } from './types'

const BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001'

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  })
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json() as Promise<T>
}

export const api = {
  getDevices: () => request<Device[]>('/api/devices'),
  getRuns: () => request<TestRun[]>('/api/runs'),
  getAlerts: () => request<AlertEvent[]>('/api/alerts'),
  createRun: (deviceId: string, name: string) =>
    request<TestRun>('/api/runs', {
      method: 'POST',
      body: JSON.stringify({ deviceId, name }),
    }),
  markAlertsRead: () => request<{ ok: Boolean }>('/api/alerts/read', { method: 'POST' }),
}
