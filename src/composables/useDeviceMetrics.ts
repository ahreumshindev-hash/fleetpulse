import { ref, onMounted, onUnmounted } from 'vue'
import { useDeviceStore } from '@/stores/devices'

export interface DeviceMetricPoint {
  time: string
  cpu: number
  memory: number
  battery: number
}

const MAX_POINTS = 20

export function useDeviceMetrics(deviceId: string) {
  const devicesStore = useDeviceStore()
  const points = ref<DeviceMetricPoint[]>([])
  let timer: ReturnType<typeof setInterval> | null = null

  function sample() {
    const device = devicesStore.devices.find((d) => d.id === deviceId)
    if (!device) return
    points.value.push({
      time: new Date().toLocaleTimeString('en-US', { hour12: false }),
      cpu: device.cpu,
      memory: device.memory,
      battery: device.battery,
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
