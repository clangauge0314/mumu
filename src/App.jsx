import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUp } from 'lucide-react'
import AuthModal from './Components/AuthModal/AuthModal'
import ListingModal from './Components/ListingModal/ListingModal'
import LoadingScreen from './Components/LoadingScreen/LoadingScreen'
import Navbar from './Components/Navbar/Navbar'
import ProductGrid from './Components/ProductGrid/ProductGrid'
import { useAuthStore } from './store/useAuthStore'

function App() {
  const user = useAuthStore((state) => state.user)
  const [isBootLoading, setIsBootLoading] = useState(true)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [isListingModalOpen, setIsListingModalOpen] = useState(false)

  useEffect(() => {
    const minMs = 2500
    const maxMs = 3500
    const duration =
      Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs

    const timer = window.setTimeout(() => {
      setIsBootLoading(false)
    }, duration)

    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (isBootLoading) return
    const onScroll = () => {
      setShowScrollTop(window.scrollY > 520)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [isBootLoading])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const openListingModal = () => setIsListingModalOpen(true)
  const closeListingModal = () => setIsListingModalOpen(false)

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar onOpenListingModal={openListingModal} />

      <main className="mx-auto w-full max-w-6xl px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
        <ProductGrid />
      </main>

      {user && (
        <button
          type="button"
          aria-label="판매하기"
          onClick={openListingModal}
          className="fixed right-4 bottom-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#1b76fb] text-white shadow-lg shadow-[#1b76fb]/30 transition hover:bg-[#1667d8] active:scale-95 sm:hidden"
        >
          <span className="text-2xl leading-none font-light">+</span>
        </button>
      )}

      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            type="button"
            aria-label="맨 위로 이동"
            onClick={scrollToTop}
            initial={{ opacity: 0, y: 24, scale: 0.84 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.88 }}
            transition={{ type: 'spring', stiffness: 420, damping: 28 }}
            className={`fixed right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-lg transition hover:-translate-y-0.5 hover:border-[#1b76fb]/40 hover:text-[#1b76fb] ${
              user ? 'bottom-22 sm:bottom-6' : 'bottom-6'
            }`}
          >
            <ArrowUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>

      <AuthModal />
      <ListingModal
        isOpen={isListingModalOpen}
        onClose={closeListingModal}
      />
      <AnimatePresence>{isBootLoading && <LoadingScreen />}</AnimatePresence>
    </div>
  )
}

export default App
