import { getUploadApiUrl, isUploadApiConfigured } from '../config/upload'
import { prepareImageForUpload } from '../utils/prepareImageForUpload'
import {
  exposeUploadDebugGlobals,
  uploadDebug,
  uploadDebugError,
} from '../utils/uploadDebug'

const UPLOAD_CONCURRENCY = 3

if (import.meta.env.DEV) {
  exposeUploadDebugGlobals()
}

async function mapWithConcurrency(items, limit, mapper) {
  const results = []
  let index = 0

  async function worker() {
    while (index < items.length) {
      const current = index
      index += 1
      results[current] = await mapper(items[current], current)
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, () => worker()),
  )
  return results
}

function parseUploadResponse(payload) {
  if (typeof payload?.url === 'string') return payload.url
  if (typeof payload?.imageUrl === 'string') return payload.imageUrl
  if (Array.isArray(payload?.urls) && payload.urls[0]) return payload.urls[0]
  return null
}

function formatBytes(bytes) {
  if (!Number.isFinite(bytes)) return '?'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

/** 한 등록(batch) 안에서 모든 사진이 같은 시간 문자열을 씀 */
export function formatUploadBatchTime(date = new Date()) {
  const pad = (n) => String(n).padStart(2, '0')
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}-${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`
}

function buildUploadError(code, detail) {
  const err = new Error(detail ? `${code}|${detail}` : code)
  err.code = code
  err.detail = detail
  return err
}

/** 백엔드 연결 확인 (개발용) */
export async function pingUploadApi() {
  const url = '/api/health'
  uploadDebug('ping', { url })

  try {
    const response = await fetch(url)
    const payload = await response.json().catch(() => ({}))
    const result = {
      ok: response.ok,
      status: response.status,
      payload,
    }
    uploadDebug('ping result', result)
    return result
  } catch (error) {
    uploadDebugError('ping failed', error, {
      hint: 'backend에서 npm run dev 실행, frontend/.env에 UPLOAD_PROXY_TARGET=http://127.0.0.1:3000',
    })
    throw error
  }
}

export async function uploadImage(
  file,
  { sequence = 1, batchTime, roomNumber, logIndex = 0 } = {},
) {
  const index = logIndex
  if (!isUploadApiConfigured()) {
    throw buildUploadError('UPLOAD_API_NOT_CONFIGURED')
  }

  const apiUrl = getUploadApiUrl()
  uploadDebug(`file[${index}] start`, {
    apiUrl,
    original: {
      name: file.name,
      type: file.type,
      size: formatBytes(file.size),
    },
  })

  let prepared
  try {
    prepared = await prepareImageForUpload(file)
    uploadDebug(`file[${index}] prepared`, {
      name: prepared.name,
      type: prepared.type,
      size: formatBytes(prepared.size),
    })
  } catch (error) {
    uploadDebugError(`file[${index}] prepare`, error)
    throw error
  }

  const formData = new FormData()
  formData.append('file', prepared)
  formData.append('roomNumber', roomNumber || 'unknown')
  formData.append('batchTime', batchTime || formatUploadBatchTime())
  formData.append('index', String(sequence))

  let response
  const startedAt = performance.now()

  try {
    response = await fetch(apiUrl, {
      method: 'POST',
      body: formData,
    })
  } catch (error) {
    uploadDebugError(`file[${index}] fetch`, error, {
      apiUrl,
      likelyCauses: [
        '백엔드 미실행 (cd backend && npm run dev)',
        '포트 3000 충돌 (EADDRINUSE)',
        'frontend/.env에 UPLOAD_PROXY_TARGET 누락',
        'CORS (직접 API URL을 넣은 경우)',
      ],
    })
    throw buildUploadError(
      'UPLOAD_NETWORK_ERROR',
      error?.message || 'Failed to fetch',
    )
  }

  const elapsedMs = Math.round(performance.now() - startedAt)
  const rawText = await response.text()
  let payload = {}

  try {
    payload = rawText ? JSON.parse(rawText) : {}
  } catch {
    payload = { _raw: rawText.slice(0, 500) }
  }

  uploadDebug(`file[${index}] response`, {
    status: response.status,
    ok: response.ok,
    elapsedMs,
    payload,
  })

  if (!response.ok) {
    const serverMessage =
      typeof payload?.message === 'string'
        ? payload.message
        : typeof payload?.error === 'string'
          ? payload.error
          : rawText.slice(0, 200) || `HTTP ${response.status}`

    uploadDebugError(`file[${index}] server ${response.status}`, new Error(serverMessage), {
      payload,
    })

    throw buildUploadError('UPLOAD_FAILED', serverMessage)
  }

  const url = parseUploadResponse(payload)
  if (!url) {
    uploadDebugError(`file[${index}] invalid response`, new Error('no url field'), {
      payload,
    })
    throw buildUploadError('UPLOAD_INVALID_RESPONSE', JSON.stringify(payload).slice(0, 200))
  }

  uploadDebug(`file[${index}] success`, { url })
  return { url, payload }
}

export async function uploadListingPhotos(files, { roomNumber } = {}) {
  const batchTime = formatUploadBatchTime()
  uploadDebug('batch start', {
    count: files.length,
    concurrency: UPLOAD_CONCURRENCY,
    roomNumber,
    batchTime,
  })

  if (import.meta.env.DEV && files.length > 0) {
    try {
      await pingUploadApi()
    } catch {
      uploadDebug('batch: health check failed — upload may still be attempted')
    }
  }

  try {
    const results = await mapWithConcurrency(files, UPLOAD_CONCURRENCY, (file, i) =>
      uploadImage(file, {
        sequence: i + 1,
        batchTime,
        roomNumber,
        logIndex: i,
      }),
    )
    uploadDebug('batch done', { urls: results.map((r) => r.url) })
    return results
  } catch (error) {
    uploadDebugError('batch failed', error)
    throw error
  }
}

export { isUploadApiConfigured }
