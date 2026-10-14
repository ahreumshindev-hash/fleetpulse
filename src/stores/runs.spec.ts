import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useRunsStore } from './runs'
import type { TestRun } from '@/types'

function makeRun(overrides: Partial<TestRun> = {}): TestRun {
  return {
    id: 'r1',
    deviceId: 'd1',
    name: 'Smoke suite',
    status: 'queued',
    progress: 0,
    startedAt: '2026-01-01T00:00:00Z',
    durationSec: 0,
    ...overrides,
  } as TestRun
}

const ids = (runs: TestRun[]) => runs.map((r) => r.id)

describe('useRunsStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('initial state', () => {
    it('starts empty with the "all" filter', () => {
      const store = useRunsStore()
      expect(store.runs).toEqual([])
      expect(store.statusFilter).toBe('all')
    })
  })

  describe('setRuns', () => {
    it('replaces the run list', () => {
      const store = useRunsStore()
      store.setRuns([makeRun({ id: 'a' })])
      store.setRuns([makeRun({ id: 'b' }), makeRun({ id: 'c' })])

      expect(ids(store.runs)).toEqual(['b', 'c'])
    })
  })

  describe('addRun', () => {
    it('adds the run to the front of the list', () => {
      const store = useRunsStore()
      store.setRuns([makeRun({ id: 'a' }), makeRun({ id: 'b' })])
      store.addRun(makeRun({ id: 'new' }))

      expect(ids(store.runs)).toEqual(['new', 'a', 'b'])
    })

    it('works on an empty list', () => {
      const store = useRunsStore()
      store.addRun(makeRun({ id: 'first' }))

      expect(ids(store.runs)).toEqual(['first'])
    })
  })

  describe('updateRun', () => {
    it('merges the patch and keeps other fields', () => {
      const store = useRunsStore()
      store.setRuns([makeRun({ id: 'a', name: 'Keep me', progress: 0 })])
      store.updateRun('a', { status: 'running', progress: 40 })

      expect(store.runs[0]).toMatchObject({
        id: 'a',
        name: 'Keep me',
        status: 'running',
        progress: 40,
      })
    })

    it('does not touch other runs', () => {
      const store = useRunsStore()
      store.setRuns([makeRun({ id: 'a' }), makeRun({ id: 'b', progress: 7 })])
      store.updateRun('a', { progress: 99 })

      expect(store.runs[1].progress).toBe(7)
    })

    it('does nothing for an unknown id', () => {
      const store = useRunsStore()
      store.setRuns([makeRun({ id: 'a', status: 'queued' })])

      expect(() => store.updateRun('nope', { status: 'failed' })).not.toThrow()
      expect(store.runs).toHaveLength(1)
      expect(store.runs[0].status).toBe('queued')
    })
  })

  describe('setStatusFilter', () => {
    it('sets the filter', () => {
      const store = useRunsStore()
      store.setStatusFilter('failed')
      expect(store.statusFilter).toBe('failed')
    })

    it('can be reset to "all"', () => {
      const store = useRunsStore()
      store.setStatusFilter('passed')
      store.setStatusFilter('all')
      expect(store.statusFilter).toBe('all')
    })
  })

  describe('filteredRuns', () => {
    const seed = () => [
      makeRun({ id: 'q', status: 'queued' }),
      makeRun({ id: 'r', status: 'running' }),
      makeRun({ id: 'p', status: 'passed' }),
      makeRun({ id: 'f', status: 'failed' }),
      makeRun({ id: 'p2', status: 'passed' }),
    ]

    it('returns every run when the filter is "all"', () => {
      const store = useRunsStore()
      store.setRuns(seed())

      expect(ids(store.filteredRuns)).toEqual(['q', 'r', 'p', 'f', 'p2'])
    })

    it('returns only runs matching the selected status', () => {
      const store = useRunsStore()
      store.setRuns(seed())
      store.setStatusFilter('passed')

      expect(ids(store.filteredRuns)).toEqual(['p', 'p2'])
    })

    it('returns an empty array when nothing matches', () => {
      const store = useRunsStore()
      store.setRuns([makeRun({ id: 'a', status: 'passed' })])
      store.setStatusFilter('failed')

      expect(store.filteredRuns).toEqual([])
    })

    it('reacts to updates and newly added runs', () => {
      const store = useRunsStore()
      store.setRuns([makeRun({ id: 'a', status: 'running' })])
      store.setStatusFilter('failed')
      expect(store.filteredRuns).toHaveLength(0)

      store.updateRun('a', { status: 'failed' })
      store.addRun(makeRun({ id: 'b', status: 'failed' }))

      expect(ids(store.filteredRuns)).toEqual(['b', 'a'])
    })
  })

  describe('activeRuns', () => {
    // Assumes "active" = queued or running. Adjust if your store only counts "running".
    it('includes queued and running runs, excludes finished ones', () => {
      const store = useRunsStore()
      store.setRuns([
        makeRun({ id: 'q', status: 'queued' }),
        makeRun({ id: 'r', status: 'running' }),
        makeRun({ id: 'p', status: 'passed' }),
        makeRun({ id: 'f', status: 'failed' }),
      ])

      expect(ids(store.activeRuns)).toEqual(['q', 'r'])
    })

    it('ignores the status filter', () => {
      const store = useRunsStore()
      store.setRuns([
        makeRun({ id: 'r', status: 'running' }),
        makeRun({ id: 'p', status: 'passed' }),
      ])
      store.setStatusFilter('passed')

      expect(ids(store.activeRuns)).toEqual(['r'])
    })

    it('is empty when no runs are active', () => {
      const store = useRunsStore()
      store.setRuns([makeRun({ status: 'passed' })])

      expect(store.activeRuns).toEqual([])
    })
  })
})
