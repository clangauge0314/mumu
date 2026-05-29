import { Moon, Sun } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTranslation } from '../../hooks/useTranslation'
import { useThemeStore } from '../../store/useThemeStore'

function ThemeToggle() {
  const { t } = useTranslation()
  const theme = useThemeStore((state) => state.theme)
  const toggleTheme = useThemeStore((state) => state.toggleTheme)
  const isDark = theme === 'dark'

  return (
    <motion.button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? t('themeToLight') : t('themeToDark')}
      whileTap={{ scale: 0.92 }}
      className={`fixed right-4 bottom-4 z-50 flex h-12 w-12 items-center justify-center rounded-full border shadow-lg transition-colors ${
        isDark
          ? 'border-slate-600 bg-slate-800 text-amber-300 shadow-black/40 hover:border-amber-400/50 hover:bg-slate-700'
          : 'border-slate-200 bg-white text-slate-700 shadow-slate-300/50 hover:border-[#1b76fb]/40 hover:text-[#1b76fb]'
      }`}
    >
      <motion.span
        key={theme}
        initial={{ opacity: 0, rotate: -40, scale: 0.7 }}
        animate={{ opacity: 1, rotate: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 500, damping: 26 }}
      >
        {isDark ? <Sun size={20} /> : <Moon size={20} />}
      </motion.span>
    </motion.button>
  )
}

export default ThemeToggle
