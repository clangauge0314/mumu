import { Search, SlidersHorizontal, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { filterConfig } from '../../config/filters'
import { useFilterStore } from '../../store/useFilterStore'
import {
  getActiveFilterCount,
  getPriceFilterLabel,
  hasPriceFilter,
} from '../../utils/filterProducts'

function FilterChip({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-[#1b76fb]/10 px-2.5 py-1 text-xs font-medium text-[#1b76fb]">
      {label}
      <button
        type="button"
        onClick={onRemove}
        aria-label={`${label} 필터 제거`}
        className="rounded-full p-0.5 hover:bg-[#1b76fb]/15"
      >
        <X size={12} />
      </button>
    </span>
  )
}

function OptionGroup({ title, options, value, onChange }) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
        {title}
      </p>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition ${
              value === opt.id
                ? 'border-[#1b76fb] bg-[#1b76fb] text-white'
                : 'border-slate-200 bg-white text-slate-600 hover:border-[#1b76fb]/40 hover:text-[#1b76fb]'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}

function PriceFilter() {
  const minPrice = useFilterStore((s) => s.minPrice)
  const maxPrice = useFilterStore((s) => s.maxPrice)
  const freeOnly = useFilterStore((s) => s.freeOnly)
  const setMinPrice = useFilterStore((s) => s.setMinPrice)
  const setMaxPrice = useFilterStore((s) => s.setMaxPrice)
  const setFreeOnly = useFilterStore((s) => s.setFreeOnly)

  const inputClass =
    'w-full min-w-0 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-[#1b76fb] focus:ring-2 focus:ring-[#1b76fb]/20 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400'

  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
        가격
      </p>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <input
            type="number"
            min="0"
            inputMode="numeric"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder={filterConfig.price.minPlaceholder}
            disabled={freeOnly}
            className={inputClass}
          />
          <span className="shrink-0 text-sm text-slate-400">~</span>
          <input
            type="number"
            min="0"
            inputMode="numeric"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder={filterConfig.price.maxPlaceholder}
            disabled={freeOnly}
            className={inputClass}
          />
        </div>

        <label
          className={`flex shrink-0 cursor-pointer items-center gap-2 rounded-lg border px-4 py-2.5 transition sm:py-2 ${
            freeOnly
              ? 'border-[#1b76fb] bg-[#1b76fb]/10'
              : 'border-slate-200 bg-slate-50'
          }`}
        >
          <input
            type="radio"
            name="price-filter-mode"
            checked={freeOnly}
            onChange={() => setFreeOnly(true)}
            onClick={() => {
              if (freeOnly) setFreeOnly(false)
            }}
            className="h-4 w-4 accent-[#1b76fb]"
          />
          <span className="whitespace-nowrap text-sm font-medium text-slate-700">
            {filterConfig.price.freeOnlyLabel}
          </span>
        </label>
      </div>
    </div>
  )
}

function ProductSearch() {
  const query = useFilterStore((s) => s.query)
  const category = useFilterStore((s) => s.category)
  const minPrice = useFilterStore((s) => s.minPrice)
  const maxPrice = useFilterStore((s) => s.maxPrice)
  const freeOnly = useFilterStore((s) => s.freeOnly)
  const sort = useFilterStore((s) => s.sort)
  const isFilterOpen = useFilterStore((s) => s.isFilterOpen)
  const setQuery = useFilterStore((s) => s.setQuery)
  const setCategory = useFilterStore((s) => s.setCategory)
  const setMinPrice = useFilterStore((s) => s.setMinPrice)
  const setMaxPrice = useFilterStore((s) => s.setMaxPrice)
  const setFreeOnly = useFilterStore((s) => s.setFreeOnly)
  const setSort = useFilterStore((s) => s.setSort)
  const toggleFilterOpen = useFilterStore((s) => s.toggleFilterOpen)
  const setFilterOpen = useFilterStore((s) => s.setFilterOpen)
  const resetFilters = useFilterStore((s) => s.resetFilters)

  const activeCount = getActiveFilterCount({
    category,
    minPrice,
    maxPrice,
    freeOnly,
    sort,
  })

  const categoryLabel = filterConfig.categories.find((c) => c.id === category)?.label
  const priceLabel = getPriceFilterLabel(minPrice, maxPrice, freeOnly)
  const sortLabel = filterConfig.sortOptions.find((s) => s.id === sort)?.label

  const showChips =
    category !== 'all' ||
    hasPriceFilter(minPrice, maxPrice, freeOnly) ||
    sort !== 'latest'

  const clearPriceFilter = () => {
    setMinPrice('')
    setMaxPrice('')
    setFreeOnly(false)
  }

  return (
    <section className="mb-5 space-y-3 sm:mb-6">
      <div className="flex gap-2">
        <div className="relative min-w-0 flex-1">
          <Search
            size={18}
            className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="검색어를 입력해주세요"
            className="w-full rounded-xl border border-slate-200 bg-white py-3 pr-4 pl-10 text-sm shadow-sm outline-none transition focus:border-[#1b76fb] focus:ring-2 focus:ring-[#1b76fb]/20"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="검색어 지우기"
              className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-0.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={toggleFilterOpen}
          aria-expanded={isFilterOpen}
          className={`relative inline-flex shrink-0 items-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition ${
            isFilterOpen || activeCount > 0
              ? 'border-[#1b76fb] bg-[#1b76fb]/10 text-[#1b76fb]'
              : 'border-slate-200 bg-white text-slate-700 shadow-sm hover:border-[#1b76fb]/40'
          }`}
        >
          <SlidersHorizontal size={18} />
          <span className="hidden sm:inline">필터</span>
          {activeCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#1b76fb] px-1 text-xs font-bold text-white">
              {activeCount}
            </span>
          )}
        </button>
      </div>

      {showChips && (
        <div className="flex flex-wrap items-center gap-2">
          {category !== 'all' && (
            <FilterChip
              label={categoryLabel}
              onRemove={() => setCategory('all')}
            />
          )}
          {priceLabel && (
            <FilterChip label={priceLabel} onRemove={clearPriceFilter} />
          )}
          {sort !== 'latest' && (
            <FilterChip label={sortLabel} onRemove={() => setSort('latest')} />
          )}
          <button
            type="button"
            onClick={resetFilters}
            className="text-xs font-medium text-slate-500 underline-offset-2 hover:text-[#1b76fb] hover:underline"
          >
            전체 초기화
          </button>
        </div>
      )}

      <AnimatePresence>
        {isFilterOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="space-y-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <OptionGroup
                title="카테고리"
                options={filterConfig.categories}
                value={category}
                onChange={setCategory}
              />
              <PriceFilter />
              <OptionGroup
                title="정렬"
                options={filterConfig.sortOptions}
                value={sort}
                onChange={setSort}
              />
              <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    resetFilters()
                    setFilterOpen(false)
                  }}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                  초기화
                </button>
                <button
                  type="button"
                  onClick={() => setFilterOpen(false)}
                  className="rounded-lg bg-[#1b76fb] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1667d8]"
                >
                  적용
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

export default ProductSearch
