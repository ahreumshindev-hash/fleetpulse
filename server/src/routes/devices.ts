import { Router } from 'express'
import { devices } from '../data'

const router = Router()

router.get('/', (req, res) => {
  res.json(devices)
})

router.get('/:id', (req, res) => {
  const device = devices.find((d) => d.id === req.params.id)
  if (!device) {
    res.status(404).json({ error: 'Device not found' })
    return
  }
  res.json(device)
})

router.patch('/:id', (req, res) => {
  const device = devices.find((d) => d.id === req.params.id)
  if (!device) {
    res.status(404).json({ error: 'Diveice not found' })
    return
  }
  Object.assign(device, req.body)
  res.json(device)
})

export default router
