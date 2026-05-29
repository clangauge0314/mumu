import { Heart, ImageOff, MapPin, Pencil, Trash2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTranslation } from '../../hooks/useTranslation'
import { formatProductPrice } from '../../utils/formatProductPrice'
import ListingStatusBadge from '../ListingStatus/ListingStatusBadge'

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: [0.22, 1, 0.36, 1],
      delay: (i % 8) * 0.04,
    },
  }),
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.2, ease: 'easeIn' },
  },
}

function ProductCard({
  product,
  index,
  isOwner = false,
  onOpen,
  onEdit,
  onDelete,
  isDeleting = false,
}) {
  const { t, locale } = useTranslation()
  const isFree = product.price === 0
  const priceLabel = formatProductPrice(product.price, locale, t('freeShare'))
  const locationText =
    product.locationLabel ||
    [product.location, product.sellerNickname].filter(Boolean).join(' · ')

  return (
    <motion.article
      layout
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      custom={index}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'tween', duration: 0.2, ease: 'easeOut' }}
      onClick={() => onOpen?.(product)}
      className="group relative cursor-pointer overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200/80 transition-shadow duration-200 hover:shadow-lg hover:ring-[#1b76fb]/40 dark:bg-slate-900 dark:shadow-black/30 dark:ring-slate-700 dark:hover:ring-[#5b9dff]/45"
    >
      <div className="relative aspect-square overflow-hidden bg-slate-100 dark:bg-slate-800">
        {product.image ? (
          <img
            src={product.image}
            alt={product.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-1 bg-slate-100 text-slate-400 transition-colors duration-200 group-hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-500 dark:group-hover:bg-slate-700/80">
            <ImageOff size={28} strokeWidth={1.5} />
            <span className="text-[10px] font-medium">{t('noImage')}</span>
          </div>
        )}
        <div
          className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100"
          aria-hidden
        />
        <div className="absolute top-2 left-2 flex max-w-[calc(100%-4rem)] flex-col items-start gap-1">
          <ListingStatusBadge status={product.status} className="shadow-sm" />
          <span className="rounded-md bg-black/50 px-2 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
            {product.time}
          </span>
        </div>
        {isOwner && (
          <div className="absolute top-2 right-2 z-20 flex gap-1">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onEdit?.(product)
              }}
              className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-white/95 text-slate-700 shadow-sm transition-colors hover:text-[#1b76fb] dark:bg-slate-900/95 dark:text-slate-200"
              aria-label={t('listingEdit')}
            >
              <Pencil size={13} />
            </button>
            <button
              type="button"
              disabled={isDeleting}
              onClick={(e) => {
                e.stopPropagation()
                onDelete?.(product)
              }}
              className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-white/95 text-red-600 shadow-sm transition-colors hover:bg-red-50 disabled:opacity-50 dark:bg-slate-900/95 dark:hover:bg-red-950/40"
              aria-label={t('listingDelete')}
            >
              <Trash2 size={13} />
            </button>
          </div>
        )}
      </div>

      <div className="p-3 transition-colors duration-200 group-hover:bg-slate-50/80 dark:group-hover:bg-slate-800/60">
        <h3
          className="truncate text-base font-bold text-slate-900 transition-colors group-hover:text-[#1b76fb] dark:text-slate-50 dark:group-hover:text-[#5b9dff]"
          title={product.title}
        >
          {product.title}
        </h3>
        <p
          className={`mt-1 text-sm font-semibold ${
            isFree ? 'text-[#1b76fb] dark:text-[#5b9dff]' : 'text-slate-700 dark:text-slate-200'
          }`}
        >
          {priceLabel}
        </p>
        <div className="mt-2 flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span className="flex min-w-0 items-center gap-1 truncate">
            <MapPin size={12} className="shrink-0 text-[#1b76fb]" />
            <span className="truncate">{locationText || t('roomUnregistered')}</span>
          </span>
          <span className="flex shrink-0 items-center gap-0.5 text-slate-400 transition-colors group-hover:text-red-400 dark:text-slate-500">
            <Heart size={12} />
            {product.likes}
          </span>
        </div>
      </div>
    </motion.article>
  )
}

export default ProductCard
