/** 개발·VITE_UPLOAD_DEBUG=true 일 때만 콘솔 출력 */

export function isUploadDebugEnabled() {
  return (
    import.meta.env.DEV || import.meta.env.VITE_UPLOAD_DEBUG === 'true'
  )
}

function prefix(label) {
  return `[mumu:upload] ${label}`
}

export function uploadDebug(label, data) {
  if (!isUploadDebugEnabled()) return
  if (data === undefined) {
    console.debug(prefix(label))
    return
  }
  console.debug(prefix(label), data)
}

export function uploadDebugGroup(label, fn) {
  if (!isUploadDebugEnabled()) return fn?.()
  console.groupCollapsed(prefix(label))
  try {
    return fn?.()
  } finally {
    console.groupEnd()
  }
}

export function uploadDebugError(label, error, context) {
  if (!isUploadDebugEnabled()) return
  console.group(prefix(`ERROR · ${label}`))
  console.error(error)
  if (context) console.log('context:', context)
  if (error?.stack) console.log('stack:', error.stack)
  console.groupEnd()
}

export function getUploadRuntimeInfo() {
  return {
    mode: import.meta.env.MODE,
    dev: import.meta.env.DEV,
    uploadApiUrl: import.meta.env.VITE_UPLOAD_API_URL || '(default /api/upload)',
    proxyHint:
      'Vite는 /api·/uploads → UPLOAD_PROXY_TARGET (frontend/.env, 기본 http://127.0.0.1:3000)',
    debug: isUploadDebugEnabled(),
  }
}

/** 브라우저 콘솔에서: window.__mumuUploadDebug.info() */
export function exposeUploadDebugGlobals() {
  if (!isUploadDebugEnabled() || typeof window === 'undefined') return

  window.__mumuUploadDebug = {
    info: () => {
      const info = getUploadRuntimeInfo()
      console.table(info)
      return info
    },
    ping: async () => {
      const { pingUploadApi } = await import('../services/uploadService')
      return pingUploadApi()
    },
  }
  uploadDebug('window.__mumuUploadDebug ready (info, ping)')
}
