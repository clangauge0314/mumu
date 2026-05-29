import { getUploadApiUrl, isUploadApiConfigured } from '../config/upload'
import { prepareImageForUpload } from '../utils/prepareImageForUpload'

const UPLOAD_CONCURRENCY = 3

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

export async function uploadImage(file) {
  if (!isUploadApiConfigured()) {
    throw new Error('UPLOAD_API_NOT_CONFIGURED')
  }

  const prepared = await prepareImageForUpload(file)
  const formData = new FormData()
  formData.append('file', prepared)

  const response = await fetch(getUploadApiUrl(), {
    method: 'POST',
    body: formData,
  })

  const payload = await response.json().catch(() => ({}))
  if (!response.ok) {
    const message =
      typeof payload?.message === 'string'
        ? payload.message
        : typeof payload?.error === 'string'
          ? payload.error
          : 'UPLOAD_FAILED'
    throw new Error(message)
  }

  const url = parseUploadResponse(payload)
  if (!url) throw new Error('UPLOAD_INVALID_RESPONSE')

  return { url }
}

export async function uploadListingPhotos(files) {
  return mapWithConcurrency(files, UPLOAD_CONCURRENCY, (file) => uploadImage(file))
}

export { isUploadApiConfigured }
