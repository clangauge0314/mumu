import { useEffect, useState } from 'react'
import { gridConfig } from '../config/grid'
import { products } from '../data/products'
import { useAuthStore } from '../store/useAuthStore'

function waitForWindowLoad() {
  if (document.readyState === 'complete') return Promise.resolve()
  return new Promise((resolve) => {
    window.addEventListener('load', resolve, { once: true })
  })
}

function prefetchImage(url) {
  return new Promise((resolve) => {
    if (!url) {
      resolve()
      return
    }
    const img = new Image()
    img.onload = () => resolve()
    img.onerror = () => resolve()
    img.src = url
  })
}

function getInitialImageCount() {
  if (typeof window === 'undefined') return gridConfig.desktopPageSize

  const width = window.innerWidth
  if (width < gridConfig.mobileBreakpoint) return gridConfig.mobilePageSize
  if (width < gridConfig.tabletBreakpoint) return gridConfig.tabletPageSize
  return gridConfig.desktopPageSize
}

export function useBootReady() {
  const authReady = useAuthStore((state) => state.authReady)
  const [assetsReady, setAssetsReady] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function loadBootAssets() {
      const imageUrls = products
        .slice(0, getInitialImageCount())
        .map((product) => product.image)

      try {
        await Promise.all([
          waitForWindowLoad(),
          document.fonts.ready,
          ...imageUrls.map(prefetchImage),
        ])
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
