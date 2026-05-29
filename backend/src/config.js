import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const maxUploadMb = Number(process.env.MAX_UPLOAD_MB) || 15

export const config = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  publicBaseUrl: (process.env.PUBLIC_BASE_URL || '').replace(/\/$/, ''),
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  maxFileBytes: maxUploadMb * 1024 * 1024,
  uploadsDir: path.join(__dirname, '..', 'uploads'),
  allowedMimeTypes: new Set([
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/avif',
    'image/gif',
  ]),
}

export function publicAssetUrl(relativePath) {
  const normalized = relativePath.startsWith('/') ? relativePath : `/${relativePath}`
  return config.publicBaseUrl ? `${config.publicBaseUrl}${normalized}` : normalized
}
