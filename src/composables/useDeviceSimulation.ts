import { ref } from 'vue'
import { useDeviceStore } from '@/stores/devices'
import { useRunsStore } from '@/stores/runs'
import type { Device, DeviceStatus } from '@/types'

const TICK_MS = 3000

function randomStatus(current: DeviceStatus): DeviceStatus {
  const roll = Math.random()
  if (current === 'error' || current === 'offline') {
    return roll < 0.3 ? 'online' : current // 30% 확률로 복구
  }
  if (roll < 0.06) return 'error'
  if (roll < 0.12) return 'offline'
  if (roll < 0.4) return current === 'busy' ? 'online' : 'busy'
  return current
}

function clamp(value: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, value))
}

export function useDeviceSimulation() {
  const devicesStore = useDeviceStore()
  const runsStore = useRunsStore()
  const isRunning = ref(false)
  let timer: ReturnType<typeof setInterval> | null = null

  function tickDevices() {
    for (const device of devicesStore.devices) {
      const battery = Math.max(5, device.battery - Math.floor(Math.random() * 3))
      const cpu = clamp(device.cpu + Math.floor(Math.random() * 17) - 8)
      const memory = clamp(device.memory + Math.floor(Math.random() * 11) - 5)
      devicesStore.updateDevice(device.id, {
        battery,
        cpu,
        memory,
        status: randomStatus(device.status),
        lastSeen: new Date().toISOString(),
      })
    }
  }

  function tickRuns() {
    for (const run of runsStore.runs) {
      if (run.status !== 'running') continue
      const next = run.progress + 5 + Math.floor(Math.random() * 15)
      if (next >= 100) {
        runsStore.updateRun(run.id, {
          status: Math.random() < 0.85 ? 'passed' : 'failed',
          progress: 100,
        })
      } else {
        runsStore.updateRun(run.id, { progress: next })
      }
    }

    const runningCount = runsStore.runs.filter((r) => r.status === 'running').length
    if (runningCount < 3) {
      const queued = runsStore.runs.find((r) => r.status === 'queued')
      if (queued) runsStore.updateRun(queued.id, { status: 'running', progress: 5 })
    }
  }

  function start() {
    if (isRunning.value) return
    isRunning.value = true
    timer = setInterval(() => {
      tickDevices()
      tickRuns()
    }, TICK_MS)
  }

  function stop() {
    isRunning.value = false
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  }

  return { isRunning, start, stop }
}
