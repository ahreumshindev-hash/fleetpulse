import express from 'express'
import cors from 'cors'
import devicesRouter from './routes/devices'

const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())
app.use('/api/devices', devicesRouter)

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`)
})
