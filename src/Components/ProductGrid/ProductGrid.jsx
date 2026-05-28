import { useMemo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import ProductCard from '../ProductCard/ProductCard'
import ProductSearch from '../ProductSearch/ProductSearch'
import { products } from '../../data/products'
import { useFilterStore } from '../../store/useFilterStore'
import { filterProducts } from '../../utils/filterProducts'
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll'

const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.04, delayChildren: 0.02 },
  },
}

function LoadMoreSentinel({ sentinelRef, isLoading, hasMore, loadedCount, totalCount }) {
  if (!hasMore && loadedCount >= totalCount) {
    return (
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="py-8 text-center text-sm text-slate-400"
      >
        모든 상품을 불러왔어요
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
          <span className="text-sm font-medium text-slate-500">
            상품을 불러오는 중…
          </span>
        </motion.div>
      )}
      {!isLoading && hasMore && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-slate-400"
        >
          {loadedCount} / {totalCount}
        </motion.span>
      )}
    </div>
  )
}

function ProductGrid() {
  const query = useFilterStore((s) => s.query)
  const category = useFilterStore((s) => s.category)
  const minPrice = useFilterStore((s) => s.minPrice)
  const maxPrice = useFilterStore((s) => s.maxPrice)
  const freeOnly = useFilterStore((s) => s.freeOnly)
  const sort = useFilterStore((s) => s.sort)

  const filterKey = useMemo(
    () => JSON.stringify({ query, category, minPrice, maxPrice, freeOnly, sort }),
    [query, category, minPrice, maxPrice, freeOnly, sort],
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
    [filterKey],
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
          <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
            우리 동네 중고거래
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            가까운 이웃과 함께하는 mumu
          </p>
        </div>
        <motion.span
          key={totalCount}
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 22 }}
          className="shrink-0 rounded-full bg-[#1b76fb]/10 px-3 py-1 text-xs font-semibold text-[#1b76fb]"
        >
          {totalCount}개
        </motion.span>
      </motion.div>

      <ProductSearch />

      <AnimatePresence mode="wait">
        {filtered.length > 0 ? (
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
              className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4"
            >
              <AnimatePresence mode="popLayout">
                {visibleItems.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={index}
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
            />
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            className="rounded-xl border border-dashed border-slate-200 bg-white py-16 text-center"
          >
            <motion.p
              initial={{ y: 8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.05 }}
              className="text-sm font-medium text-slate-700"
            >
              조건에 맞는 상품이 없어요
            </motion.p>
            <motion.p
              initial={{ y: 8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="mt-1 text-xs text-slate-500"
            >
              검색어나 필터를 변경해 보세요
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

export default ProductGrid
