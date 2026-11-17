import { devices, runs, alerts } from './data'

const TICK_MS = 3000

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function tick() {
  for (const device of devices) {
    const prevStatus = device.status
    device.battery = Math.max(0, device.battery - Math.floor(Math.random() * 3))
    device.cpu = clamp(device.cpu + (Math.random() - 0.5) * 20, 0, 100)
    device.memory = clamp(device.memory + (Math.random() - 0.5) * 10, 0, 100)

    if (device.status !== prevStatus) {
      alerts.unshift({
        id: `a-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        severity: device.status === 'error' ? 'error' : 'warning',
        message: `${device.name} is now ${device.status}`,
        deviceId: device.id,
        timestamp: new Date().toISOString(),
        read: false,
      })
      if (alerts.length > 50) alerts.pop()
    }
    device.lastSeen = new Date().toISOString()
  }

  for (const run of runs) {
    if (run.status !== 'running') continue
    run.progress = Math.min(100, run.progress + Math.floor(Math.random() * 15))
    if (run.progress >= 100) {
      run.status = Math.random() < 0.85 ? 'passed' : 'failed'
      run.durationSec = Math.floor(Math.random() * 120) + 30
      if (run.status === 'failed') {
        alerts.unshift({
          id: `a-${Date.now()}`,
          severity: 'error',
          message: `Run "${run.name}" failed`,
          deviceId: run.deviceId,
          timestamp: new Date().toISOString(),
          read: false,
        })
      }
    }
  }
}

export function startSimulation() {
  setInterval(tick, TICK_MS)
}
