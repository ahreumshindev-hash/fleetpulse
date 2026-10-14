import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useDeviceStore } from './devices'
import type { Device } from '@/types'

function makeDevice(overrides: Partial<Device> = {}): Device {
  return {
    id: 'd1',
    name: 'Pixel 8',
    model: 'Pixel 8',
    os: 'Android',
    osVersion: '14',
    status: 'online',
    battery: 80,
    cpu: 20,
    memory: 40,
    lastSeen: '2026-01-01T00:00:00Z',
    ...overrides,
  } as Device
}

describe('useDeviceStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('initial state', () => {
    it('starts empty with nothing selected', () => {
      const store = useDeviceStore()
      expect(store.devices).toEqual([])
      expect(store.selectedDeviceId).toBeNull()
    })
  })

  describe('setDevices', () => {
    it('replaces the device list', () => {
      const store = useDeviceStore()
      store.setDevices([makeDevice({ id: 'a' })])
      store.setDevices([makeDevice({ id: 'b' }), makeDevice({ id: 'c' })])

      expect(store.devices.map((d) => d.id)).toEqual(['b', 'c'])
    })

    it('accepts an empty list', () => {
      const store = useDeviceStore()
      store.setDevices([makeDevice()])
      store.setDevices([])

      expect(store.devices).toEqual([])
    })
  })

  describe('deviceCount', () => {
    it('is 0 when empty', () => {
      expect(useDeviceStore().deviceCount).toBe(0)
    })

    it('reflects the number of devices', () => {
      const store = useDeviceStore()
      store.setDevices([makeDevice({ id: 'a' }), makeDevice({ id: 'b' })])

      expect(store.deviceCount).toBe(2)
    })
  })

  describe('onlineDevices', () => {
    it('returns only devices with status "online"', () => {
      const store = useDeviceStore()
      store.setDevices([
        makeDevice({ id: 'a', status: 'online' }),
        makeDevice({ id: 'b', status: 'offline' }),
        makeDevice({ id: 'c', status: 'busy' }),
        makeDevice({ id: 'd', status: 'error' }),
        makeDevice({ id: 'e', status: 'online' }),
      ])

      expect(store.onlineDevices.map((d) => d.id)).toEqual(['a', 'e'])
    })

    it('returns an empty array when none are online', () => {
      const store = useDeviceStore()
      store.setDevices([makeDevice({ status: 'offline' })])

      expect(store.onlineDevices).toEqual([])
    })

    it('updates reactively when a status changes', () => {
      const store = useDeviceStore()
      store.setDevices([makeDevice({ id: 'a', status: 'offline' })])
      expect(store.onlineDevices).toHaveLength(0)

      store.updateDeviceStatus('a', 'online')
      expect(store.onlineDevices).toHaveLength(1)
    })
  })

  describe('selectedDevice / selectDevice', () => {
    it('is null-ish when nothing is selected', () => {
      const store = useDeviceStore()
      store.setDevices([makeDevice()])

      expect(store.selectedDevice ?? null).toBeNull()
    })

    it('selects a device by id', () => {
      const store = useDeviceStore()
      store.setDevices([makeDevice({ id: 'a' }), makeDevice({ id: 'b' })])
      store.selectDevice('b')

      expect(store.selectedDeviceId).toBe('b')
      expect(store.selectedDevice?.id).toBe('b')
    })

    it('clears the selection with selectDevice(null)', () => {
      const store = useDeviceStore()
      store.setDevices([makeDevice({ id: 'a' })])
      store.selectDevice('a')
      store.selectDevice(null)

      expect(store.selectedDeviceId).toBeNull()
      expect(store.selectedDevice ?? null).toBeNull()
    })

    it('resolves to null-ish when the selected id is not in the list', () => {
      const store = useDeviceStore()
      store.setDevices([makeDevice({ id: 'a' })])
      store.selectDevice('missing')

      expect(store.selectedDevice ?? null).toBeNull()
    })

    it('follows updates to the selected device', () => {
      const store = useDeviceStore()
      store.setDevices([makeDevice({ id: 'a', battery: 80 })])
      store.selectDevice('a')
      store.updateDevice('a', { battery: 10 })

      expect(store.selectedDevice?.battery).toBe(10)
    })
  })

  describe('updateDeviceStatus', () => {
    it('updates only the targeted device', () => {
      const store = useDeviceStore()
      store.setDevices([
        makeDevice({ id: 'a', status: 'online' }),
        makeDevice({ id: 'b', status: 'online' }),
      ])
      store.updateDeviceStatus('a', 'error')

      expect(store.devices.find((d) => d.id === 'a')?.status).toBe('error')
      expect(store.devices.find((d) => d.id === 'b')?.status).toBe('online')
    })

    it('does nothing for an unknown id', () => {
      const store = useDeviceStore()
      store.setDevices([makeDevice({ id: 'a', status: 'online' })])

      expect(() => store.updateDeviceStatus('nope', 'offline')).not.toThrow()
      expect(store.devices).toHaveLength(1)
      expect(store.devices[0]!.status).toBe('online')
    })
  })

  describe('updateDevice', () => {
    it('merges the patch and keeps other fields', () => {
      const store = useDeviceStore()
      store.setDevices([makeDevice({ id: 'a', name: 'Old', battery: 80, cpu: 20 })])
      store.updateDevice('a', { name: 'New', battery: 55 })

      expect(store.devices[0]).toMatchObject({
        id: 'a',
        name: 'New',
        battery: 55,
        cpu: 20,
      })
    })

    it('does not touch other devices', () => {
      const store = useDeviceStore()
      store.setDevices([makeDevice({ id: 'a' }), makeDevice({ id: 'b', name: 'Keep' })])
      store.updateDevice('a', { name: 'Changed' })

      expect(store.devices[1]!.name).toBe('Keep')
    })

    it('does nothing for an unknown id', () => {
      const store = useDeviceStore()
      const original = makeDevice({ id: 'a' })
      store.setDevices([original])

      expect(() => store.updateDevice('nope', { name: 'X' })).not.toThrow()
      expect(store.devices).toHaveLength(1)
      expect(store.devices[0]).toMatchObject({ id: 'a', name: original.name })
    })
  })
})
