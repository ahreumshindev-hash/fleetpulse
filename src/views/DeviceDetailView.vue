<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { useDeviceStore } from '@/stores/devices'
import { useRunsStore } from '@/stores/runs'
import { useDeviceMetrics, type DeviceMetricPoint } from '@/composables/useDeviceMetrics'
import LineChart from '@/components/LineChart.vue'
import type { DeviceStatus, RunStatus } from '@/types'
import type { ChartData, ChartOptions } from 'chart.js'

const route = useRoute()
const router = useRouter()
const devicesStore = useDeviceStore()
const runsStore = useRunsStore()

const deviceId = route.params.id as string
const device = computed(() => devicesStore.devices.find((d) => d.id === deviceId))
const deviceRuns = computed(() => runsStore.runs.filter((r) => r.deviceId === deviceId))

const { points } = useDeviceMetrics(deviceId)

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
const runStatusStyles: Record<RunStatus, string> = {
  queued: 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400',
  running: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
  passed: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300',
  failed: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
}

const labels = computed(() => points.value.map((p) => p.time))

function makeChartData(
  label: string,
  borderColor: string,
  backgroundColor: string,
  pick: (p: DeviceMetricPoint) => number,
): ChartData<'line'> {
  return {
    labels: labels.value,
    datasets: [
      {
        label,
        data: points.value.map(pick),
        borderColor,
        backgroundColor,
        fill: true,
        tension: 0.4,
      },
    ],
  }
}

const cpuData = computed(() =>
  makeChartData('CPU %', '#8b5cf6', 'rgba(139, 92, 246, 0.1)', (p) => p.cpu),
)
const memoryData = computed(() =>
  makeChartData('Memory %', '#f59e0b', 'rgba(245, 158, 11, 0.1)', (p) => p.memory),
)
const batteryData = computed(() =>
  makeChartData('Battery %', '#3b82f6', 'rgba(59, 130, 246, 0.1)', (p) => p.battery),
)

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
      max: 100,
      ticks: { color: '#9ca3af' },
      grid: { color: 'rgba(156, 163, 175, 0.1)' },
    },
  },
}
</script>

<template>
  <div v-if="device">
    <button
      @click="router.back()"
      class="mb-4 text-sm text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
    >
      ← Back to Devices
    </button>

    <div class="flex items-center gap-3 mb-4">
      <h3 class="text-lg font-medium">{{ device.name }}</h3>
      <span :class="['text-xs px-2 py-0.5 rounded-full font-medium', statusStyles[device.status]]">
        {{ statusLabel[device.status] }}
      </span>
    </div>

    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
      <div
        class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4"
      >
        <p class="text-xs text-gray-500 dark:text-gray-400">Model</p>
        <p class="font-medium">{{ device.model }}</p>
      </div>
      <div
        class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4"
      >
        <p class="text-xs text-gray-500 dark:text-gray-400">OS</p>
        <p class="font-medium">Android {{ device.osVersion }}</p>
      </div>
      <div
        class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4"
      >
        <p class="text-xs text-gray-500 dark:text-gray-400">Battery</p>
        <p class="font-medium">{{ device.battery }}%</p>
      </div>
      <div
        class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4"
      >
        <p class="text-xs text-gray-500 dark:text-gray-400">Last seen</p>
        <p class="font-medium text-sm">{{ new Date(device.lastSeen).toLocaleTimeString() }}</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
      <div
        class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4"
      >
        <h4 class="font-medium mb-2">CPU</h4>
        <div class="h-48"><LineChart :data="cpuData" :options="chartOptions" /></div>
      </div>
      <div
        class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4"
      >
        <h4 class="font-medium mb-2">Memory</h4>
        <div class="h-48"><LineChart :data="memoryData" :options="chartOptions" /></div>
      </div>
      <div
        class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4"
      >
        <h4 class="font-medium mb-2">Battery</h4>
        <div class="h-48"><LineChart :data="batteryData" :options="chartOptions" /></div>
      </div>
    </div>

    <h4 class="font-medium mb-2">Test Runs ({{ deviceRuns.length }})</h4>
    <div
      class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700"
    >
      <div v-for="run in deviceRuns" :key="run.id" class="p-4">
        <div class="flex items-center justify-between mb-2">
          <span class="font-medium text-sm">{{ run.name }}</span>
          <span
            :class="['text-xs px-2 py-0.5 rounded-full font-medium', runStatusStyles[run.status]]"
          >
            {{ run.status }}
          </span>
        </div>
        <div class="h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
          <div
            class="h-full rounded-full bg-blue-500 transition-all"
            :style="{ width: `${run.progress}%` }"
          />
        </div>
      </div>
      <p v-if="deviceRuns.length === 0" class="p-4 text-sm text-gray-500 dark:text-gray-400">
        No runs yet.
      </p>
    </div>
  </div>
  <div v-else>
    <p class="text-gray-500 dark:text-gray-400 mb-2">Device not found.</p>
    <RouterLink to="/devices" class="text-blue-500 hover:underline">Back to Devices</RouterLink>
  </div>
</template>
