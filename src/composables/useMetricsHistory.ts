import { ref, onMounted, onUnmounted } from 'vue'
import { useDeviceStore } from '@/stores/devices'

export interface MetricPoint {
  time: string
  avgBattery: number
  onlineCount: number
}

const MAX_POINTS = 20

export function useMetricsHistory() {
  const devicesStore = useDeviceStore()
  const points = ref<MetricPoint[]>([])
  let timer: ReturnType<typeof setInterval> | null = null

  function sample() {
    const devices = devicesStore.devices
    if (devices.length === 0) return
    const avgBattery = Math.round(devices.reduce((sum, d) => sum + d.battery, 0) / devices.length)
    const onlineCount = devices.filter((d) => d.status === 'online').length
    points.value.push({
      time: new Date().toLocaleTimeString('en-US', { hour12: false }),
      avgBattery,
      onlineCount,
    })
    if (points.value.length > MAX_POINTS) points.value.shift()
  }

  onMounted(() => {
    sample()
    timer = setInterval(sample, 3000)
  })

  onUnmounted(() => {
    if (timer) clearInterval(timer)
  })

  return { points }
}
