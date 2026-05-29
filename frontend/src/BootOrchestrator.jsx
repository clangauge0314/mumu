import { useEffect, useState } from 'react'
import LottieSplash from './Components/LottieSplash/LottieSplash.jsx'

/**
 * Lottie는 한 번 마운트된 뒤 부트 완료까지 절대 unmount하지 않음 (3G에서도 유지)
 */
export default function BootOrchestrator() {
  const [booting, setBooting] = useState(true)
  const [BootGate, setBootGate] = useState(null)
  const [App, setApp] = useState(null)

  useEffect(() => {
    import('./BootGate.jsx').then((module) => {
      setBootGate(() => module.default)
    })
  }, [])

  const handleBootComplete = (AppComponent) => {
    setApp(() => AppComponent)
    setBooting(false)
  }

  return (
    <>
      {booting && <LottieSplash />}
      {BootGate && <BootGate onBootComplete={handleBootComplete} />}
      {!booting && App && <App />}
    </>
  )
}
