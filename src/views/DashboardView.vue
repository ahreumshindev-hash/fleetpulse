<script setup lang="ts">
import { computed } from 'vue'

import { useDeviceStore } from '@/stores/devices'
import { useRunsStore } from '@/stores/runs'

import { useMetricsHistory } from '@/composables/useMetricsHistory'

import LineChart from '@/components/LineChart.vue'
import type { ChartData, ChartOptions } from 'chart.js'

const devicesStore = useDeviceStore()
const runsStore = useRunsStore()

const { points } = useMetricsHistory()

const labels = computed(() => points.value.map((p) => p.time))

const batteryData = computed<ChartData<'line'>>(() => ({
  labels: labels.value,
  datasets: [
    {
      label: 'Avg Battery %',
      data: points.value.map((p) => p.avgBattery),
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      fill: true,
      tension: 0.4,
    },
  ],
}))

const onlineData = computed<ChartData<'line'>>(() => ({
  labels: labels.value,
  datasets: [
    {
      label: 'Online Devices',
      data: points.value.map((p) => p.onlineCount),
      borderColor: '#22c55e',
      backgroundColor: 'rgba(34, 197, 94, 0.1)',
      fill: true,
      tension: 0.4,
    },
  ],
}))

const chartOptions: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  animation: false,
  plugins: { legend: { display: false } },
  scales: {
    x: {
      ticks: { color: '#9ca3af', maxTicksLimit: 6 },
      grid: { color: 'rgba(156, 163, 175, 0.1)' },
    },
    y: {
      beginAtZero: true,
      ticks: { color: '#9ca3af' },
      grid: { color: 'rgba(156, 163, 175, 0.1)' },
    },
  },
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-medium">Dashboard</h3>
      <p class="text-sm text-gray-500 dark:text-gray-400">
        {{ devicesStore.deviceCount }} devices · {{ runsStore.activeRuns.length }} active runs
      </p>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div
        class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4"
      >
        <h4 class="font-medium mb-2">Average Battery</h4>
        <div class="h-64">
          <LineChart :data="batteryData" :options="chartOptions" />
        </div>
      </div>
      <div
        class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4"
      >
        <h4 class="font-medium mb-2">Online Devices</h4>
        <div class="h-64">
          <LineChart :data="onlineData" :options="chartOptions" />
        </div>
      </div>
    </div>
  </div>
</template>
