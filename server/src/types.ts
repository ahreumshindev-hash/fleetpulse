export type DeviceStatus = 'online' | 'offline' | 'busy' | 'error'

export interface Device {
  id: string
  name: string
  model: string
  os: string
  osVersion: string
  status: DeviceStatus
  battery: number
  cpu: number
  memory: number
  lastSeen: string
}

export type RunStatus = 'queued' | 'running' | 'passed' | 'failed'

export interface TestRun {
  id: string
  deviceId: string
  name: string
  status: RunStatus
  progress: number
  startedAt: string
  durationSec: number
}

export type AlertSeverity = 'info' | 'warning' | 'error'

export interface AlertEvent {
  id: string
  severity: AlertSeverity
  message: string
  deviceId?: string
  timestamp: string
  read: boolean
}
