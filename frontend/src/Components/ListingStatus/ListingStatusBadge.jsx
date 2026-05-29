import { useTranslation } from '../../hooks/useTranslation'
import { getListingStatusLabelKey, normalizeListingStatus } from '../../config/listingStatus'

const statusStyles = {
  available: 'text-emerald-300',
  purchase_requested: 'text-amber-300',
  in_progress: 'text-sky-300',
  completed: 'text-slate-300',
}

function ListingStatusBadge({ status, className = '' }) {
  const { t } = useTranslation()
  const normalized = normalizeListingStatus(status)
  const style = statusStyles[normalized] ?? statusStyles.available

  return (
    <span
      className={`inline-flex items-center rounded-md bg-black/80 px-2.5 py-1 text-xs font-semibold text-white shadow-md ring-1 ring-white/15 backdrop-blur-md ${style} ${className}`}
    >
      {t(getListingStatusLabelKey(status))}
    </span>
  )
}

export default ListingStatusBadge
