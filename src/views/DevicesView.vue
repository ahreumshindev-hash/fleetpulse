<script setup lang="ts">
import { useDeviceStore } from '@/stores/devices'
import DeviceCard from '@/components/DeviceCard.vue'

const devicesStore = useDeviceStore()
</script>
<template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-medium">Devices</h3>
      <p class="text-sm text-gray-500 dark:text-gray-400">
        {{ devicesStore.deviceCount }} devices · {{ devicesStore.onlineDevices.length }} online
      </p>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <DeviceCard
        v-for="device in devicesStore.devices"
        :key="device.id"
        :device="device"
        :selected="devicesStore.selectedDeviceId === device.id"
        @select="devicesStore.selectDevice"
      />
    </div>
  </div>
</template>
