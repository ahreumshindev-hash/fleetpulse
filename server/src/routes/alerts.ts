import { Router } from 'express'
import { alerts } from '../data'
import type { AlertEvent } from '../types'

const router = Router()

router.get('/', (req, res) => {
  res.json(alerts)
})

router.post('/', (req, res) => {
  const { severity, message, deviceId } = req.body
  if (!severity || !message) {
    res.status(400).json({ error: 'severity and message are required' })
    return
  }
  const alert: AlertEvent = {
    id: `a-${Date.now()}`,
    severity,
    message,
    deviceId,
    timestamp: new Date().toISOString(),
    read: false,
  }
  alerts.unshift(alert)
  if (alerts.length > 50) alerts.pop()
  res.status(200).json(alert)
})

router.post('/read', (req, res) => {
  alerts.forEach((a) => {
    a.read = true
  })
  res.json({ ok: true })
})

export default router
