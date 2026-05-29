import fs from 'node:fs/promises'
import path from 'node:path'
import { Router } from 'express'
import { config, publicAssetUrl } from '../config.js'
import { uploadMiddleware } from '../middleware/upload.js'
import { optimizeImageLossless, readImageMeta } from '../services/imageOptimizer.js'
import {
  buildUploadFilename,
  resolveUniqueFilename,
} from '../utils/uploadFilename.js'

function extensionFromMime(mime) {
  const map = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
    'image/avif': '.avif',
    'image/gif': '.gif',
  }
  return map[mime] || '.bin'
}

export const uploadRouter = Router()

uploadRouter.post('/upload', (req, res, next) => {
  uploadMiddleware(req, res, async (err) => {
    if (err) return next(err)
    if (!req.file) {
      return res.status(400).json({
        error: 'NO_FILE',
        message: 'multipart 필드 "file"에 이미지를 첨부해 주세요.',
      })
    }

    try {
      const beforeBytes = req.file.size
      const meta = await readImageMeta(req.file.buffer)

      if (!meta.width || !meta.height) {
        return res.status(400).json({
          error: 'INVALID_IMAGE',
          message: '올바른 이미지 파일이 아닙니다.',
        })
      }

      let { buffer, mime, ext } = await optimizeImageLossless(
        req.file.buffer,
        req.file.mimetype,
      )

      /* 무손실 재인코딩이 오히려 커지면 원본 유지 */
      if (buffer.length >= beforeBytes) {
        const origExt = extensionFromMime(req.file.mimetype)
        buffer = req.file.buffer
        mime = req.file.mimetype
        ext = origExt
      }

      const roomNumber =
        req.body?.roomNumber ??
        req.body?.room ??
        req.body?.sellerNickname ??
        'unknown'
      const batchTime = req.body?.batchTime
      const index = req.body?.index ?? '1'

      const baseFilename = buildUploadFilename({
        roomNumber,
        batchTime,
        index,
        ext,
      })
      const filename = await resolveUniqueFilename(
        config.uploadsDir,
        baseFilename,
      )
      const diskPath = path.join(config.uploadsDir, filename)
      await fs.writeFile(diskPath, buffer)

      const relativeUrl = `/uploads/${filename}`
      const url = publicAssetUrl(relativeUrl)

      res.status(201).json({
        url,
        imageUrl: url,
        filename,
        mime,
        width: meta.width,
        height: meta.height,
        sizeBefore: beforeBytes,
        sizeAfter: buffer.length,
        savedBytes: Math.max(0, beforeBytes - buffer.length),
      })
    } catch (error) {
      next(error)
    }
  })
})
