<script setup lang="ts">
import type { TestRun, RunStatus } from '@/types'

defineProps<{
  run: TestRun
  deviceName: string
}>()

const runStatusStyles: Record<RunStatus, string> = {
  queued: 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400',
  running: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
  passed: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300',
  failed: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
}
</script>

<template>
  <div class="p-4">
    <div class="flex items-center justify-between mb-1">
      <span class="font-medium text-sm">{{ run.name }}</span>
      <span :class="['text-xs px-2 py-0.5 rounded-full font-medium', runStatusStyles[run.status]]">
        {{ run.status }}
      </span>
    </div>
    <p class="text-xs text-gray-500 dark:text-gray-400 mb-2">{{ deviceName }}</p>
    <div class="flex items-center gap-2">
      <div class="flex-1 h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
        <div
          class="h-full rounded-full transition-all"
          :class="
            run.status === 'failed'
              ? 'bg-red-500'
              : run.status === 'passed'
                ? 'bg-green-500'
                : 'bg-blue-500'
          "
          :style="{ width: `${run.progress}%` }"
        />
      </div>
      <span class="text-xs text-gray-500 dark:text-gray-400 w-10 text-right"
        >{{ run.progress }}%</span
      >
    </div>
  </div>
</template>
