<script setup lang="ts">
import { useAlertsStore } from '@/stores/alerts'
import { useDeviceStore } from '@/stores/devices'
import type { AlertSeverity } from '@/types'

const alertsStore = useAlertsStore()
const devicesStore = useDeviceStore()

const severityStyles: Record<AlertSeverity, string> = {
  info: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
  warning: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300',
  error: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
}
const severityLabels: Record<AlertSeverity, string> = {
  info: 'Info',
  warning: 'Warning',
  error: 'Error',
}

const deviceNameOf = (deviceId?: string) =>
  deviceId ? (devicesStore.devices.find((d) => d.id === deviceId)?.name ?? deviceId) : ''

function timeAgo(iso: string) {
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  return `${hours}h ago`
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-medium">
        Alerts
        <span
          v-if="alertsStore.unreadCount > 0"
          class="ml-2 text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300 font-medium"
        >
          {{ alertsStore.unreadCount }} unread
        </span>
      </h3>
      <button
        @click="alertsStore.markAllRead()"
        class="px-3 py-1.5 text-sm rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
      >
        Mark all read
      </button>
    </div>

    <div
      class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700"
    >
      <div
        v-for="alert in alertsStore.alerts"
        :key="alert.id"
        :class="['p-4 flex gap-3', !alert.read && 'bg-blue-50/50 dark:bg-blue-950/20']"
      >
        <span
          :class="[
            'text-xs px-2 py-0.5 rounded-full font-medium h-fit',
            severityStyles[alert.severity],
          ]"
        >
          {{ severityLabels[alert.severity] }}
        </span>
        <div class="flex-1">
          <p class="text-sm">{{ alert.message }}</p>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span v-if="alert.deviceId">{{ deviceNameOf(alert.deviceId) }} · </span
            >{{ timeAgo(alert.timestamp) }}
          </p>
        </div>
      </div>
      <p
        v-if="alertsStore.alerts.length === 0"
        class="p-4 text-sm text-gray-500 dark:text-gray-400"
      >
        No alerts yet. Events will appear here as the simulation runs.
      </p>
    </div>
  </div>
</template>
