<script setup lang="ts">
import { computed } from 'vue'
import type { Device, DeviceStatus } from '@/types'

const props = defineProps<{
  device: Device
  selected: boolean
}>()

const emit = defineEmits<{
  select: [id: string]
}>()

const statusStyles: Record<DeviceStatus, string> = {
  online: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300',
  busy: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300',
  offline: 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400',
  error: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
}

const statusLabel: Record<DeviceStatus, string> = {
  online: 'Online',
  busy: 'In Use',
  offline: 'Offline',
  error: 'Error',
}

const statusClass = computed(() => statusStyles[props.device.status])
</script>
<template>
  <button
    @click="emit('select', device.id)"
    :class="[
      'text-left rounded-xl border p-4 transition-all hover:shadow-md',
      selected
        ? 'border-blue-500 ring-2 ring-blue-500/30 bg-white dark:bg-gray-800'
        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800',
    ]"
  >
    <div class="flex items-center justify-between mb-2">
      <h3 class="font-semibold">{{ device.name }}</h3>
      <span :class="['text-xs px-2 py-0.5 rounded-full font-medium', statusClass]">
        {{ statusLabel[device.status] }}
      </span>
    </div>
    <p class="text-sm text-gray-500 dark:text-gray-400">
      {{ device.model }} · Android {{ device.osVersion }}
    </p>
    <div class="mt-3 flex items-center gap-2">
      <div class="flex-1 h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
        <div class="h-full rounded-full bg-blue-500" :style="{ width: `${device.battery}%` }" />
      </div>
      <span class="text-xs text-gray-500 dark:text-gray-400">{{ device.battery }}%</span>
    </div>
  </button>
</template>
