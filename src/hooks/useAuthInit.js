import { useEffect } from 'react'
import { resolveAppUser, subscribeAuth } from '../services/authService'
import { useAuthStore } from '../store/useAuthStore'

export function useAuthInit() {
  const setUser = useAuthStore((state) => state.setUser)
  const setAuthReady = useAuthStore((state) => state.setAuthReady)

  useEffect(() => {
    setAuthReady(false)

    const unsubscribe = subscribeAuth(async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const appUser = await resolveAppUser(firebaseUser)
          setUser(appUser)
        } else {
          setUser(null)
        }
      } catch {
        setUser(null)
      } finally {
        setAuthReady(true)
      }
    })

    return unsubscribe
  }, [setUser, setAuthReady])
}
