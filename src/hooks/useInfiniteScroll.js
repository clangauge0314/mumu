import { useCallback, useEffect, useRef, useState } from 'react'
import { gridConfig } from '../config/grid'

function getPageSize() {
  if (typeof window === 'undefined') return gridConfig.desktopPageSize

  const width = window.innerWidth
  if (width < gridConfig.mobileBreakpoint) return gridConfig.mobilePageSize
  if (width < gridConfig.tabletBreakpoint) return gridConfig.tabletPageSize
  return gridConfig.desktopPageSize
}

export function useInfiniteScroll(items, resetKey) {
  const [pageSize, setPageSize] = useState(getPageSize)
  const { loadDelayMs, observerRootMargin } = gridConfig
  const [visibleCount, setVisibleCount] = useState(pageSize)
  const [isLoading, setIsLoading] = useState(false)
  const sentinelRef = useRef(null)

  const visibleItems = items.slice(0, visibleCount)
  const hasMore = visibleCount < items.length

  useEffect(() => {
    setVisibleCount(pageSize)
    setIsLoading(false)
  }, [resetKey, pageSize])

  useEffect(() => {
    const onResize = () => setPageSize(getPageSize())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const loadMore = useCallback(() => {
    if (isLoading || !hasMore) return

    setIsLoading(true)
    window.setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + pageSize, items.length))
      setIsLoading(false)
    }, loadDelayMs)
  }, [hasMore, isLoading, items.length, pageSize, loadDelayMs])

  useEffect(() => {
    const node = sentinelRef.current
    if (!node || !hasMore) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) loadMore()
      },
      { rootMargin: observerRootMargin },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [hasMore, loadMore, observerRootMargin])

  return {
    visibleItems,
    hasMore,
    isLoading,
    sentinelRef,
    totalCount: items.length,
    loadedCount: visibleItems.length,
  }
}
