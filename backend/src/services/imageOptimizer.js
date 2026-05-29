import sharp from 'sharp'

const MAX_EDGE = 2048

/**
 * 무손실(또는 시각적 무손실) 파이프라인으로 용량만 줄임.
 * - PNG / GIF / WebP / AVIF: lossless 옵션
 * - JPEG: 픽셀 보존 WebP lossless로 변환 (재압축 손실 방지)
 */
export async function optimizeImageLossless(inputBuffer, mimeType) {
  let pipeline = sharp(inputBuffer, { failOn: 'error' }).rotate()

  const meta = await pipeline.metadata()
  const width = meta.width ?? 0
  const height = meta.height ?? 0

  if (width > MAX_EDGE || height > MAX_EDGE) {
    pipeline = pipeline.resize({
      width: MAX_EDGE,
      height: MAX_EDGE,
      fit: 'inside',
      withoutEnlargement: true,
    })
  }

  const format = pickOutputFormat(mimeType, meta.format)

  switch (format) {
    case 'png':
      return {
        buffer: await pipeline
          .png({
            compressionLevel: 9,
            adaptiveFiltering: true,
            palette: !meta.hasAlpha,
          })
          .toBuffer(),
        mime: 'image/png',
        ext: '.png',
      }
    case 'webp':
      return {
        buffer: await pipeline.webp({ lossless: true, effort: 6 }).toBuffer(),
        mime: 'image/webp',
        ext: '.webp',
      }
    case 'avif':
      return {
        buffer: await pipeline.avif({ lossless: true, effort: 4 }).toBuffer(),
        mime: 'image/avif',
        ext: '.avif',
      }
    case 'gif':
      return {
        buffer: await pipeline.gif({ effort: 7 }).toBuffer(),
        mime: 'image/gif',
        ext: '.gif',
      }
    default:
      return {
        buffer: await pipeline.webp({ lossless: true, effort: 6 }).toBuffer(),
        mime: 'image/webp',
        ext: '.webp',
      }
  }
}

function pickOutputFormat(mimeType, detectedFormat) {
  if (mimeType === 'image/png' || detectedFormat === 'png') return 'png'
  if (mimeType === 'image/gif' || detectedFormat === 'gif') return 'gif'
  if (mimeType === 'image/avif' || detectedFormat === 'avif') return 'avif'
  if (mimeType === 'image/webp' || detectedFormat === 'webp') return 'webp'
  /* JPEG 등 — lossless WebP로 통일 */
  return 'webp'
}

export async function readImageMeta(buffer) {
  return sharp(buffer).metadata()
}
