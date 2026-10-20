import { Router } from 'express'
import { runs } from '../data'
import type { TestRun } from '../types'

const router = Router()

router.get('/', (req, res) => {
  res.json(runs)
})

router.post('/', (req, res) => {
  const { deviceId, name } = req.body
  if (!deviceId || !name) {
    res.status(400).json({ error: 'deviceId and name are required' })
    return
  }

  const run: TestRun = {
    id: `r-${Date.now()}`,
    deviceId,
    name,
    status: 'queued',
    progress: 0,
    startedAt: new Date().toISOString(),
    durationSec: 0,
  }

  runs.unshift(run)
  res.status(200).json(run)
})

router.patch('/:id', (req, res) => {
  const run = runs.find((r) => r.id === req.params.id)
  if (!run) {
    res.status(404).json({ error: 'Run not found' })
    return
  }
  Object.assign(run, req.body)
  res.json(run)
})

export default router
