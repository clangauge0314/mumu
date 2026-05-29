import multer from 'multer'
import { config } from '../config.js'

const storage = multer.memoryStorage()

export const uploadMiddleware = multer({
  storage,
  limits: { fileSize: config.maxFileBytes, files: 1 },
  fileFilter(_req, file, cb) {
    if (!config.allowedMimeTypes.has(file.mimetype)) {
      const err = new Error('지원하지 않는 이미지 형식입니다.')
      err.code = 'UNSUPPORTED_MEDIA_TYPE'
      err.status = 415
      return cb(err)
    }
    cb(null, true)
  },
}).single('file')
