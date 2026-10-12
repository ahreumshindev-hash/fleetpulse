<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRunsStore } from '@/stores/runs'
import { useDeviceStore } from '@/stores/devices'
import RunRow from '@/components/RunRow.vue'
import type { RunStatus } from '@/types'

const runsStore = useRunsStore()
const devicesStore = useDeviceStore()

const filters: Array<RunStatus | 'all'> = ['all', 'queued', 'running', 'passed', 'failed']
const filterLabels: Record<string, string> = {
  all: 'All',
  queued: 'Queued',
  running: 'Running',
  passed: 'Passed',
  failed: 'Failed',
}

const deviceNameOf = (deviceId: string) =>
  devicesStore.devices.find((d) => d.id === deviceId)?.name ?? deviceId

const showForm = ref(false)
const selectedDeviceId = ref('')
const selectedTestName = ref('Smoke Test')
const testNames = [
  'Smoke Test',
  'Regression Suite',
  'UI Automation',
  'Performance Test',
  'API Test',
]

const availableDevices = computed(() =>
  devicesStore.devices.filter((d) => d.status === 'online' || d.status === 'busy'),
)

function queueRun() {
  if (!selectedDeviceId.value) return
  runsStore.addRun({
    id: `r-${Date.now()}`,
    deviceId: selectedDeviceId.value,
    name: selectedTestName.value,
    status: 'queued',
    progress: 0,
    startedAt: new Date().toISOString(),
    durationSec: 0,
  })
  selectedDeviceId.value = ''
  showForm.value = false
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-medium">Test Runs</h3>
      <button
        @click="showForm = !showForm"
        class="px-4 py-2 text-sm font-medium rounded-lg bg-blue-500 text-white hover:bg-blue-600"
      >
        {{ showForm ? 'Cancel' : 'New Run' }}
      </button>
    </div>

    <div
      v-if="showForm"
      class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 mb-4"
    >
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1">Device</label>
          <select
            v-model="selectedDeviceId"
            class="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
          >
            <option value="" disabled>Select device</option>
            <option v-for="d in availableDevices" :key="d.id" :value="d.id">
              {{ d.name }} ({{ d.status }})
            </option>
          </select>
        </div>
        <div>
          <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1">Test</label>
          <select
            v-model="selectedTestName"
            class="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
          >
            <option v-for="name in testNames" :key="name" :value="name">{{ name }}</option>
          </select>
        </div>
        <div class="flex items-end">
          <button
            @click="queueRun"
            :disabled="!selectedDeviceId"
            class="px-4 py-2 text-sm font-medium rounded-lg bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Queue Run
          </button>
        </div>
      </div>
    </div>

    <div class="flex gap-2 mb-4">
      <button
        v-for="f in filters"
        :key="f"
        @click="runsStore.setStatusFilter(f)"
        :class="[
          'px-3 py-1.5 text-sm rounded-full transition-colors',
          runsStore.statusFilter === f
            ? 'bg-blue-500 text-white'
            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600',
        ]"
      >
        {{ filterLabels[f] }}
      </button>
    </div>

    <div
      class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700"
    >
      <RunRow
        v-for="run in runsStore.filteredRuns"
        :key="run.id"
        :run="run"
        :device-name="deviceNameOf(run.deviceId)"
      />
      <p
        v-if="runsStore.filteredRuns.length === 0"
        class="p-4 text-sm text-gray-500 dark:text-gray-400"
      >
        No runs.
      </p>
    </div>
  </div>
</template>
