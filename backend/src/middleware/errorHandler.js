export function errorHandler(err, _req, res, _next) {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      error: 'FILE_TOO_LARGE',
      message: '업로드 파일이 허용 크기를 초과했습니다.',
    })
  }

  if (err.code === 'UNSUPPORTED_MEDIA_TYPE') {
    return res.status(415).json({
      error: err.code,
      message: err.message,
    })
  }

  console.error('[api]', err)
  res.status(err.status || 500).json({
    error: err.code || 'INTERNAL_ERROR',
    message: err.message || '서버 오류가 발생했습니다.',
  })
}
