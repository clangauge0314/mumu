import { useEffect, useState } from 'react'
import { useAuthStore } from '../store/useAuthStore'

function waitForWindowLoad() {
  if (document.readyState === 'complete') return Promise.resolve()
  return new Promise((resolve) => {
    window.addEventListener('load', resolve, { once: true })
  })
}

export function useBootReady() {
  const authReady = useAuthStore((state) => state.authReady)
  const [assetsReady, setAssetsReady] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function loadBootAssets() {
      try {
        await Promise.all([waitForWindowLoad(), document.fonts.ready])
      } catch {
        /* 일부 리소스 실패해도 앱 진입 가능 */
      }

      if (!cancelled) setAssetsReady(true)
    }

    loadBootAssets()

    return () => {
      cancelled = true
    }
  }, [])

  return authReady && assetsReady
}
