import { ref } from 'vue'
import { useDeviceStore } from '@/stores/devices'
import { useRunsStore } from '@/stores/runs'
import { useAlertsStore } from '@/stores/alerts'
import { api } from '@/api'

export function useDeviceSimulation() {
  const devicesStore = useDeviceStore()
  const runsStore = useRunsStore()
  const alertsStore = useAlertsStore()
  const isRunning = ref(false)
  let timer: ReturnType<typeof setInterval> | undefined

  async function poll() {
    try {
      const [devices, runs, alerts] = await Promise.all([
        api.getDevices(),
        api.getRuns(),
        api.getAlerts(),
      ])
      devicesStore.setDevices(devices)
      runsStore.setRuns(runs)
      alertsStore.setAlerts(alerts)
    } catch (err) {
      console.error('Poll failed', err)
    }
  }

  function start() {
    if (isRunning.value) return
    isRunning.value = true
    poll()
    timer = setInterval(poll, 3000)
  }

  function stop() {
    isRunning.value = false
    if (timer) clearInterval(timer)
  }

  return { isRunning, start, stop }
}
