<script setup lang="ts">
import { useDeviceStore } from '@/stores/devices'
import { useRunsStore } from '@/stores/runs'

const devicesStore = useDeviceStore()
const runsStore = useRunsStore()
</script>

<template>
  <div>
    <h3 class="text-lg font-medium mb-2">Dashboard</h3>
    <p class="text-gray-500 dark:text-gray-400">
      Device {{ devicesStore.deviceCount }} · Running {{ runsStore.activeRuns.length }}
    </p>
  </div>
</template>
