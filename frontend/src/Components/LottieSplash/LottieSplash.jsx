import { useEffect, useState } from 'react'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'

async function loadLottieBlob() {
  const response =
    typeof window !== 'undefined' && window.__mumuLottiePrefetch
      ? await window.__mumuLottiePrefetch
      : await fetch('/loading2.lottie')

  if (!response.ok) throw new Error('loading2.lottie')
  return URL.createObjectURL(await response.blob())
}

function LottieSplash() {
  const [lottieSrc, setLottieSrc] = useState(null)

  useEffect(() => {
    let cancelled = false
    let objectUrl = null

    async function load() {
      try {
        objectUrl = await loadLottieBlob()
        if (!cancelled) setLottieSrc(objectUrl)
      } catch {
        if (!cancelled) setLottieSrc('/loading2.lottie')
      }
    }

    load()

    return () => {
      cancelled = true
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [])

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#ffffff',
      }}
      className="lottie-splash"
    >
      <style>{`
        @media (prefers-color-scheme: dark) {
          .lottie-splash { background: #020617; }
        }
      `}</style>
      {lottieSrc ? (
        <DotLottieReact
          src={lottieSrc}
          loop
          autoplay
          style={{
            width: 'min(88vw, 28rem)',
            height: 'min(88vw, 28rem)',
          }}
        />
      ) : null}
    </div>
  )
}

export default LottieSplash
