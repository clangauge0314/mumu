import { useEffect, useState } from 'react'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import { motion } from 'framer-motion'

function LoadingScreen() {
  const [isLottieReady, setIsLottieReady] = useState(false)
  const [loadFailed, setLoadFailed] = useState(false)

  useEffect(() => {
    const controller = new AbortController()

    async function checkLottieFile() {
      try {
        const response = await fetch('/loading2.lottie', {
          signal: controller.signal,
        })
        if (!response.ok) throw new Error('Failed to load loading2.lottie')
        setIsLottieReady(true)
      } catch (error) {
        if (error.name !== 'AbortError') setLoadFailed(true)
      }
    }

    checkLottieFile()
    return () => controller.abort()
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-120 flex items-center justify-center bg-white"
    >
      <div className="flex flex-col items-center">
        <div className="flex h-100 w-100 items-center justify-center sm:h-78 sm:w-78">
          {isLottieReady ? (
            <DotLottieReact
              src="/loading2.lottie"
              loop  
              autoplay
              className="h-full w-full"
            />
          ) : (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              className="h-12 w-12 rounded-full border-2 border-[#1b76fb]/20 border-t-[#1b76fb]"
            />
          )}
        </div>
        {loadFailed && (
          <p className="mt-1 text-xs text-slate-400">
            `public/loading2.lottie` 파일을 확인해주세요
          </p>
        )}
      </div>
    </motion.div>
  )
}

export default LoadingScreen
