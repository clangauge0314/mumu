import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import ProductCard from '../ProductCard/ProductCard'
import ProductSearch from '../ProductSearch/ProductSearch'
import { useFilterStore } from '../../store/useFilterStore'
import { filterProducts } from '../../utils/filterProducts'
import { useTranslation } from '../../hooks/useTranslation'
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll'
import { useListings } from '../../hooks/useListings'
import { useAuthStore } from '../../store/useAuthStore'
import { useAppStore } from '../../store/useAppStore'
import { deleteListing } from '../../services/listingService'
import { i18nToast } from '../../utils/i18nToast'

const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.04, delayChildren: 0.02 },
  },
}

function LoadMoreSentinel({
  sentinelRef,
  isLoading,
  hasMore,
  loadedCount,
  totalCount,
  t,
}) {
  if (!hasMore && loadedCount >= totalCount) {
    return (
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="py-8 text-center text-sm text-slate-400 dark:text-slate-500"
      >
        {t('allLoaded')}
      </motion.p>
    )
  }

  return (
    <div ref={sentinelRef} className="flex flex-col items-center justify-center py-10">
      {isLoading && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="flex flex-col items-center gap-3"
        >
          <motion.span
            className="h-9 w-9 rounded-full border-2 border-[#1b76fb]/25 border-t-[#1b76fb]"
            animate={{ rotate: 360 }}
            transition={{ duration: 0.75, repeat: Infinity, ease: 'linear' }}
          />
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {t('loadingProducts')}
          </span>
        </motion.div>
      )}
      {!isLoading && hasMore && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-slate-400 dark:text-slate-500"
        >
          {loadedCount} / {totalCount}
        </motion.span>
      )}
    </div>
  )
}

function ProductGrid() {
  const { t } = useTranslation()
  const user = useAuthStore((s) => s.user)
  const openListingModal = useAppStore((s) => s.openListingModal)
  const openListingDetail = useAppStore((s) => s.openListingDetail)
  const { products, remoteLoaded } = useListings()
  const [deletingId, setDeletingId] = useState(null)

  const handleDelete = async (product) => {
    if (!window.confirm(t('listingDeleteConfirm'))) return
    setDeletingId(product.id)
    try {
      await deleteListing(product.id)
      i18nToast.success('listingDeletedSuccess')
    } catch {
      i18nToast.error('listingDeleteFailed')
    } finally {
      setDeletingId(null)
    }
  }
  const query = useFilterStore((s) => s.query)
  const category = useFilterStore((s) => s.category)
  const minPrice = useFilterStore((s) => s.minPrice)
  const maxPrice = useFilterStore((s) => s.maxPrice)
  const freeOnly = useFilterStore((s) => s.freeOnly)
  const sort = useFilterStore((s) => s.sort)
  const dataVersion = products.length

  const filterKey = useMemo(
    () =>
      JSON.stringify({
        query,
        category,
        minPrice,
        maxPrice,
        freeOnly,
        sort,
        dataVersion,
      }),
    [query, category, minPrice, maxPrice, freeOnly, sort, dataVersion],
  )

  const filtered = useMemo(
    () =>
      filterProducts(products, {
        query,
        category,
        minPrice,
        maxPrice,
        freeOnly,
        sort,
      }),
    [products, filterKey],
  )

  const { visibleItems, hasMore, isLoading, sentinelRef, totalCount, loadedCount } =
    useInfiniteScroll(filtered, filterKey)

  return (
    <section>
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        className="mb-4 flex items-end justify-between gap-4"
      >
        <div>
          <h1 className="text-xl font-bold text-slate-900 sm:text-2xl dark:text-slate-50">
            {t('heroTitle')}
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {t('heroSubtitle')}
          </p>
        </div>
        <motion.span
          key={totalCount}
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 22 }}
          className="shrink-0 rounded-full bg-[#1b76fb]/10 px-3 py-1 text-xs font-semibold text-[#1b76fb] dark:bg-[#1b76fb]/20 dark:text-[#5b9dff]"
        >
          {t('itemCount', { count: totalCount })}
        </motion.span>
      </motion.div>

      <ProductSearch />

      <AnimatePresence mode="wait">
        {!remoteLoaded ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <motion.span
              className="h-9 w-9 rounded-full border-2 border-[#1b76fb]/25 border-t-[#1b76fb]"
              animate={{ rotate: 360 }}
              transition={{ duration: 0.75, repeat: Infinity, ease: 'linear' }}
            />
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
              {t('loadingProducts')}
            </p>
          </motion.div>
        ) : filtered.length > 0 ? (
          <motion.div
            key={filterKey}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            <motion.div
              variants={listVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 gap-4 lg:grid-cols-4"
            >
              <AnimatePresence mode="popLayout">
                {visibleItems.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={index}
                    isOwner={Boolean(user?.id && product.sellerId === user.id)}
                    onOpen={(item) => openListingDetail(item.id)}
                    onEdit={openListingModal}
                    onDelete={handleDelete}
                    isDeleting={deletingId === product.id}
                  />
                ))}
              </AnimatePresence>
            </motion.div>

            <LoadMoreSentinel
              sentinelRef={sentinelRef}
              isLoading={isLoading}
              hasMore={hasMore}
              loadedCount={loadedCount}
              totalCount={totalCount}
              t={t}
            />
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            className="rounded-xl border border-dashed border-slate-200 bg-white py-16 text-center dark:border-slate-700 dark:bg-slate-900"
          >
            <motion.p
              initial={{ y: 8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.05 }}
              className="text-sm font-medium text-slate-700 dark:text-slate-200"
            >
              {products.length === 0 ? t('listingEmpty') : t('noResults')}
            </motion.p>
            <motion.p
              initial={{ y: 8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="mt-1 text-xs text-slate-500 dark:text-slate-400"
            >
              {products.length === 0
                ? t('listingEmptyHint')
                : t('emptySearchHint')}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

export default ProductGrid
