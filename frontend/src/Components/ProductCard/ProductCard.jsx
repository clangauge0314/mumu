import { useState } from 'react'
import { Heart, MapPin } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTranslation } from '../../hooks/useTranslation'
import { formatProductPrice } from '../../utils/formatProductPrice'

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 56,
    scale: 0.84,
    rotateX: -14,
    rotateY: 5,
    filter: 'blur(14px) saturate(0.75)',
  },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    rotateX: 0,
    rotateY: 0,
    filter: 'blur(0px)',
    transition: {
      type: 'spring',
      stiffness: 420,
      damping: 24,
      mass: 0.72,
      delay: (i % 8) * 0.06,
    },
  }),
  exit: {
    opacity: 0,
    scale: 0.74,
    y: -42,
    rotateX: 14,
    rotateY: -6,
    filter: 'blur(18px) saturate(0.55) brightness(1.12)',
    transition: { duration: 0.34, ease: 'easeInOut' },
  },
}

function ProductCard({ product, index }) {
  const { t, locale } = useTranslation()
  const isFree = product.price === 0
  const [isHovered, setIsHovered] = useState(false)
  const priceLabel = formatProductPrice(product.price, locale, t('freeShare'))

  return (
    <motion.article
      layout
      layoutId={`product-${product.id}`}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      custom={index}
      whileHover={{
        y: -9,
        scale: 1.03,
        rotateX: 3,
        transition: { type: 'spring', stiffness: 420, damping: 18 },
      }}
      whileTap={{ scale: 0.95 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative cursor-pointer overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200/80 hover:shadow-md hover:ring-[#1b76fb]/50 dark:bg-slate-900 dark:shadow-black/30 dark:ring-slate-700 dark:hover:ring-[#5b9dff]/50"
    >
      <motion.div
        className="pointer-events-none absolute inset-0 z-10 bg-linear-to-r from-white/0 via-white/45 to-white/0 mix-blend-screen"
        animate={
          isHovered
            ? { opacity: [0.14, 0.3, 0.16], x: [-26, 8, -10], scale: [1, 1.05, 1] }
            : { opacity: [0.06, 0.12, 0.06], x: [-32, 0, -24], scale: [1, 1.02, 1] }
        }
        transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
        style={{ filter: 'blur(16px)' }}
      />
      <motion.div
        className="pointer-events-none absolute inset-0 z-10 bg-linear-to-t from-slate-200/0 via-slate-100/40 to-white/0 mix-blend-screen"
        animate={
          isHovered
            ? { opacity: [0.12, 0.24, 0.1], y: [14, -6, 10] }
            : { opacity: [0.05, 0.1, 0.05], y: [10, 0, 8] }
        }
        transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
        style={{ filter: 'blur(14px)' }}
      />
      <div className="relative aspect-square overflow-hidden bg-slate-100 dark:bg-slate-800">
        <motion.img
          src={product.image}
          alt={product.title}
          loading="lazy"
          initial={{ scale: 1.12 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30, delay: 0.05 }}
          className="h-full w-full object-cover"
          whileHover={{ scale: 1.06, filter: 'blur(1.2px) saturate(1.05)' }}
        />
        <motion.div
          className="absolute inset-0 bg-linear-to-t from-black/25 via-transparent to-transparent opacity-0 group-hover:opacity-100"
          transition={{ duration: 0.25 }}
        />
        <motion.span
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 400, damping: 25 }}
          className="absolute top-2 left-2 rounded-md bg-black/50 px-2 py-0.5 text-xs font-medium text-white backdrop-blur-sm"
        >
          {product.time}
        </motion.span>
      </div>

      <motion.div layout="position" className="p-3">
        <h3 className="line-clamp-2 text-sm font-medium leading-snug text-slate-800 dark:text-slate-100">
          {product.title}
        </h3>
        <motion.p
          layout
          className={`mt-1.5 text-base font-bold ${
            isFree ? 'text-[#1b76fb] dark:text-[#5b9dff]' : 'text-slate-900 dark:text-slate-50'
          }`}
        >
          {priceLabel}
        </motion.p>
        <div className="mt-2 flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span className="flex min-w-0 items-center gap-1 truncate">
            <MapPin size={12} className="shrink-0 text-[#1b76fb]" />
            <span className="truncate">{product.location}</span>
          </span>
          <motion.span
            className="flex shrink-0 items-center gap-0.5 text-slate-400 dark:text-slate-500"
            whileHover={{ scale: 1.15, color: '#ef4444' }}
            transition={{ type: 'spring', stiffness: 500, damping: 15 }}
          >
            <Heart size={12} />
            {product.likes}
          </motion.span>
        </div>
      </motion.div>
    </motion.article>
  )
}

export default ProductCard
