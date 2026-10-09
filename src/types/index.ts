export type DeviceStatus = 'online' | 'offline' | 'busy' | 'error'

export interface Device {
  id: string
  name: string
  model: string
  os: string
  osVersion: string
  status: DeviceStatus
  battery: number // 0~100
  lastSeen: string // ISO timestamp
}

export type RunStatus = 'queued' | 'running' | 'passed' | 'failed'

export interface TestRun {
  id: string
  deviceId: string
  name: string
  status: RunStatus
  progress: number // 0~100
  startedAt: string // ISO timestamp
  durationSec: number
}
