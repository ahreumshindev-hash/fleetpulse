import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

import type { TestRun } from '@/types'

export const useRunsStore = defineStore('runs', () => {
  const runs = ref<TestRun[]>([])
  const statusFilter = ref<TestRun['status'] | 'all'>('all')

  const filteredRuns = computed(() =>
    statusFilter.value === 'all'
      ? runs.value
      : runs.value.filter((r) => r.status === statusFilter.value),
  )
  const activeRuns = computed(() =>
    runs.value.filter((r) => r.status === 'running' || r.status === 'queued'),
  )

  function setRuns(list: TestRun[]) {
    runs.value = list
  }
  function addRun(run: TestRun) {
    runs.value.unshift(run)
  }
  function updateRun(id: string, patch: Partial<TestRun>) {
    const run = runs.value.find((r) => r.id === id)
    if (run) Object.assign(run, patch)
  }
  function setStatusFilter(filter: TestRun['status'] | 'all') {
    statusFilter.value = filter
  }

  return {
    runs,
    statusFilter,
    filteredRuns,
    activeRuns,
    setRuns,
    addRun,
    updateRun,
    setStatusFilter,
  }
})
