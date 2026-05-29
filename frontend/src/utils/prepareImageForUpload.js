const MAX_INPUT_BYTES = 15 * 1024 * 1024
const MAX_EDGE = 2048
const ALLOWED_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
  'image/gif',
])

function extensionForMime(mime) {
  if (mime === 'image/png') return '.png'
  if (mime === 'image/webp') return '.webp'
  if (mime === 'image/avif') return '.avif'
  if (mime === 'image/gif') return '.gif'
  return '.jpg'
}

function scaledDimensions(width, height, maxEdge) {
  if (width <= maxEdge && height <= maxEdge) {
    return { width, height }
  }
  const scale = maxEdge / Math.max(width, height)
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  }
}

function canvasToBlob(canvas, mime, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) reject(new Error('CANVAS_BLOB_FAILED'))
        else resolve(blob)
      },
      mime,
      quality,
    )
  })
}

export async function prepareImageForUpload(file) {
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new Error('UNSUPPORTED_IMAGE_TYPE')
  }
  if (file.size > MAX_INPUT_BYTES) {
    throw new Error('IMAGE_TOO_LARGE')
  }

  const bitmap = await createImageBitmap(file)
  const { width, height } = scaledDimensions(bitmap.width, bitmap.height, MAX_EDGE)

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d', { alpha: true })
  if (!ctx) {
    bitmap.close()
    throw new Error('CANVAS_CONTEXT_FAILED')
  }
  ctx.drawImage(bitmap, 0, 0, width, height)
  bitmap.close()

  const usePng = file.type === 'image/png' || file.type === 'image/gif'
  const mime = usePng ? 'image/png' : 'image/webp'
  const quality = usePng ? undefined : 1
  const blob = await canvasToBlob(canvas, mime, quality)

  const baseName = file.name.replace(/\.[^.]+$/, '') || 'photo'
  return new File([blob], `${baseName}${extensionForMime(mime)}`, {
    type: mime,
    lastModified: Date.now(),
  })
}
