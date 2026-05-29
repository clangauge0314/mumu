import { useEffect, useState } from 'react'
import { useAuthInit } from './hooks/useAuthInit.js'
import { useBootReady } from './hooks/useBootReady.js'
import './index.css'
import './lib/firebase.js'
import './store/useThemeStore.js'
import './store/useLanguageStore.js'

export default function BootGate({ onBootComplete }) {
  useAuthInit()
  const isBootReady = useBootReady()
  const [App, setApp] = useState(null)
  const [hasNotified, setHasNotified] = useState(false)

  useEffect(() => {
    import('./App.jsx').then((module) => setApp(() => module.default))
  }, [])

  useEffect(() => {
    if (!isBootReady || !App || hasNotified) return
    setHasNotified(true)
    onBootComplete(App)
  }, [isBootReady, App, hasNotified, onBootComplete])

  return null
}
