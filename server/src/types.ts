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
