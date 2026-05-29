import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import fs from 'node:fs'
import { config } from './config.js'
import { errorHandler } from './middleware/errorHandler.js'
import { healthRouter } from './routes/health.js'
import { uploadRouter } from './routes/upload.js'

if (!fs.existsSync(config.uploadsDir)) {
  fs.mkdirSync(config.uploadsDir, { recursive: true })
}

const app = express()

app.use(
  cors({
    origin: config.corsOrigin,
    credentials: true,
  }),
)

app.use('/uploads', express.static(config.uploadsDir, { maxAge: '7d', immutable: true }))
app.use('/api', healthRouter)
app.use('/api', uploadRouter)

app.use(errorHandler)

app.listen(config.port, () => {
  console.log(`[mumu-api] http://127.0.0.1:${config.port}`)
  console.log(`[mumu-api] POST /api/upload  GET /uploads/*`)
})
