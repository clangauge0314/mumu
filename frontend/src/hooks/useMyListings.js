import { useEffect, useState } from 'react'
import { subscribeMyListings } from '../services/listingService'

export function useMyListings(sellerId) {
  const [listings, setListings] = useState([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!sellerId) {
      setListings([])
      setLoaded(true)
      return undefined
    }

    setLoaded(false)
    const unsubscribe = subscribeMyListings(
      sellerId,
      (items) => {
        setListings(items)
        setLoaded(true)
      },
      () => {
        setLoaded(true)
      },
    )
    return unsubscribe
  }, [sellerId])

  return { listings, loaded }
}
