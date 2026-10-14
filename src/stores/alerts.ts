import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { AlertEvent, AlertSeverity } from '@/types'

const MAX_ALERTS = 50

export const useAlertsStore = defineStore('alerts', () => {
  const alerts = ref<AlertEvent[]>([])

  const unreadCount = computed(() => alerts.value.filter((a) => !a.read).length)

  function addAlert(severity: AlertSeverity, message: string, deviceId?: string) {
    alerts.value.unshift({
      id: `a-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      severity,
      message,
      deviceId,
      timestamp: new Date().toISOString(),
      read: false,
    })
    if (alerts.value.length > MAX_ALERTS) alerts.value.pop()
  }

  function markAllRead() {
    for (const alert of alerts.value) alert.read = true
  }

  return { alerts, unreadCount, addAlert, markAllRead }
})
