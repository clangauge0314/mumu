import { useEffect, useState } from 'react'
import { subscribeListings } from '../services/listingService'

export function useListings() {
  const [products, setProducts] = useState([])
  const [remoteLoaded, setRemoteLoaded] = useState(false)
  const [loadError, setLoadError] = useState(null)

  useEffect(() => {
    const unsubscribe = subscribeListings(
      (items) => {
        setProducts(items)
        setRemoteLoaded(true)
        setLoadError(null)
      },
      (error) => {
        setLoadError(error)
        setRemoteLoaded(true)
      },
    )
    return unsubscribe
  }, [])

  return { products, remoteLoaded, loadError }
}
