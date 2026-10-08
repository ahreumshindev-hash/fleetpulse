import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Device {
  id: string
  name: string
  status: 'online' | 'offline' | 'busy' | 'error'
}

export const useDeviceStore = defineStore('devices', () => {
  const devices = ref<Device[]>([])
  const selectedDeviceId = ref<string | null>(null)

  const deviceCount = computed(() => devices.value.length)
  const onlineDevices = computed(() => devices.value.filter((d) => d.status === 'online'))
  const selectedDevice = computed(
    () => devices.value.find((d) => d.id === selectedDeviceId.value) ?? null,
  )

  function setDevices(list: Device[]) {
    devices.value = list
  }
  function selectDevice(id: string | null) {
    selectedDeviceId.value = id
  }
  function updateDeviceStatus(id: string, status: Device['status']) {
    const device = devices.value.find((d) => d.id === id)
    if (device) device.status = status
  }

  return {
    devices,
    selectedDeviceId,
    deviceCount,
    onlineDevices,
    selectedDevice,
    setDevices,
    selectDevice,
    updateDeviceStatus,
  }
})
