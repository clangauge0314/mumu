import { useEffect, useState } from 'react'
import LottieSplash from './Components/LottieSplash/LottieSplash.jsx'

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
