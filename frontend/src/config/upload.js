export function getUploadApiUrl() {
  const url = import.meta.env.VITE_UPLOAD_API_URL?.trim()
  return url || '/api/upload'
}

export function isUploadApiConfigured() {
  return Boolean(getUploadApiUrl())
}
