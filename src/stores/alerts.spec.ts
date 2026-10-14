import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useAlertsStore } from './alerts'

const MAX_ALERTS = 50

describe('useAlertsStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('initial state', () => {
    it('starts empty with zero unread', () => {
      const store = useAlertsStore()
      expect(store.alerts).toEqual([])
      expect(store.unreadCount).toBe(0)
    })
  })

  describe('addAlert', () => {
    it('creates an unread alert with the given severity and message', () => {
      const store = useAlertsStore()
      store.addAlert('warning', 'Battery low')

      expect(store.alerts).toHaveLength(1)
      expect(store.alerts[0]).toMatchObject({
        severity: 'warning',
        message: 'Battery low',
        read: false,
      })
    })

    it('generates an id and timestamp', () => {
      const store = useAlertsStore()
      store.addAlert('info', 'Hello')

      expect(store.alerts[0]!.id).toBeTruthy()
      expect(store.alerts[0]!.timestamp).toBeDefined()
    })

    it('stores the deviceId when provided', () => {
      const store = useAlertsStore()
      store.addAlert('error', 'Device crashed', 'device-42')

      expect(store.alerts[0]!.deviceId).toBe('device-42')
    })

    it('leaves deviceId undefined when omitted', () => {
      const store = useAlertsStore()
      store.addAlert('info', 'No device')

      expect(store.alerts[0]!.deviceId).toBeUndefined()
    })

    it('gives each alert a unique id', () => {
      const store = useAlertsStore()
      store.addAlert('info', 'one')
      store.addAlert('info', 'two')
      store.addAlert('info', 'three')

      const idSet = new Set(store.alerts.map((a) => a.id))
      expect(idSet.size).toBe(3)
    })

    it('puts the newest alert first', () => {
      const store = useAlertsStore()
      store.addAlert('info', 'first')
      store.addAlert('info', 'second')
      store.addAlert('info', 'third')

      expect(store.alerts.map((a) => a.message)).toEqual(['third', 'second', 'first'])
    })

    it('keeps exactly 50 alerts when the limit is reached', () => {
      const store = useAlertsStore()
      for (let i = 0; i < MAX_ALERTS; i++) store.addAlert('info', `alert ${i}`)

      expect(store.alerts).toHaveLength(MAX_ALERTS)
    })

    it('caps the list at 50, dropping the oldest alerts', () => {
      const store = useAlertsStore()
      for (let i = 0; i < MAX_ALERTS + 5; i++) store.addAlert('info', `alert ${i}`)

      expect(store.alerts).toHaveLength(MAX_ALERTS)
      expect(store.alerts[0]!.message).toBe('alert 54') // newest kept
      expect(store.alerts[MAX_ALERTS - 1]!.message).toBe('alert 5') // oldest kept
      expect(store.alerts.some((a) => a.message === 'alert 0')).toBe(false)
    })
  })

  describe('unreadCount', () => {
    it('counts alerts that have not been read', () => {
      const store = useAlertsStore()
      store.addAlert('info', 'a')
      store.addAlert('warning', 'b')
      store.addAlert('error', 'c')

      expect(store.unreadCount).toBe(3)
    })

    it('only counts unread alerts', () => {
      const store = useAlertsStore()
      store.addAlert('info', 'a')
      store.addAlert('info', 'b')
      store.alerts[0]!.read = true

      expect(store.unreadCount).toBe(1)
    })
  })

  describe('markAllRead', () => {
    it('marks every alert as read and resets the unread count', () => {
      const store = useAlertsStore()
      store.addAlert('info', 'a')
      store.addAlert('warning', 'b')
      store.addAlert('error', 'c')
      store.markAllRead()

      expect(store.alerts.every((a) => a.read)).toBe(true)
      expect(store.unreadCount).toBe(0)
    })

    it('does not throw on an empty list', () => {
      const store = useAlertsStore()

      expect(() => store.markAllRead()).not.toThrow()
      expect(store.alerts).toEqual([])
    })

    it('leaves alerts added afterwards unread', () => {
      const store = useAlertsStore()
      store.addAlert('info', 'old')
      store.markAllRead()
      store.addAlert('info', 'new')

      expect(store.unreadCount).toBe(1)
      expect(store.alerts[0]).toMatchObject({ message: 'new', read: false })
      expect(store.alerts[1]).toMatchObject({ message: 'old', read: true })
    })
  })
})
