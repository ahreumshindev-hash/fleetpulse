import express from 'express'
import cors from 'cors'
import devicesRouter from './routes/devices'
import runsRouter from './routes/runs'
import alertsRouter from './routes/alerts'

const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())
app.use('/api/devices', devicesRouter)
app.use('/api/runs', runsRouter)
app.use('/api/alerts', alertsRouter)

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`)
})
