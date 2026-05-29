import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUp } from 'lucide-react'
import AuthModal from './Components/AuthModal/AuthModal'
import ListingModal from './Components/ListingModal/ListingModal'
import Navbar from './Components/Navbar/Navbar'
import MyProfilePage from './Components/MyProfile/MyProfilePage'
import ProductGrid from './Components/ProductGrid/ProductGrid'
import AppToaster from './Components/AppToaster/AppToaster'
import LanguageModal from './Components/LanguageModal/LanguageModal'
import ActionFab from './Components/ActionFab/ActionFab'
import { scrollToTop } from './utils/scrollToTop'
import { useAppStore } from './store/useAppStore'
import { useTranslation } from './hooks/useTranslation'

function App() {
  const { t } = useTranslation()
  const page = useAppStore((state) => state.page)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [isListingModalOpen, setIsListingModalOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setShowScrollTop(window.scrollY > 520)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const openListingModal = () => setIsListingModalOpen(true)
  const closeListingModal = () => setIsListingModalOpen(false)

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100">
      <Navbar />

      <main className="mx-auto w-full max-w-6xl px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
        {page === 'profile' ? <MyProfilePage /> : <ProductGrid />}
      </main>

      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            type="button"
            aria-label={t('scrollTop')}
            onClick={() => scrollToTop()}
            initial={{ opacity: 0, y: 24, scale: 0.84 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.88 }}
            transition={{ type: 'spring', stiffness: 420, damping: 28 }}
            className="fixed right-4 bottom-24 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-lg transition hover:-translate-y-0.5 hover:border-[#1b76fb]/40 hover:text-[#1b76fb] dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:shadow-black/30 dark:hover:border-[#1b76fb]/50 dark:hover:text-[#5b9dff]"
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
      <ActionFab onOpenListingModal={openListingModal} />
      <LanguageModal />
      <AppToaster />
    </div>
  )
}

export default App
