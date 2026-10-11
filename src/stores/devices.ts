import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

import type { Device } from '@/types'

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
    updateDevice(id, { status })
  }

  function updateDevice(id: string, patch: Partial<Device>) {
    const device = devices.value.find((d) => d.id === id)
    if (device) Object.assign(device, patch)
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
    updateDevice,
  }
})
