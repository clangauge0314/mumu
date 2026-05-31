import { useTranslation } from '../../hooks/useTranslation'
import { getListingStatusLabelKey, normalizeListingStatus } from '../../config/listingStatus'

const statusStyles = {
  available: 'bg-emerald-600 text-white ring-emerald-400/40',
  purchase_requested: 'bg-amber-400 text-amber-950 ring-amber-200/50',
  in_progress: 'bg-amber-400 text-amber-950 ring-amber-200/50',
  completed: 'bg-slate-600 text-slate-200 ring-slate-500/40',
}

const variantStyles = {
  inline:
    'inline-flex shrink-0 rounded-md px-2 py-0.5 text-[10px] font-semibold shadow-sm backdrop-blur-md sm:px-2.5 sm:py-1 sm:text-xs',
}

function ListingStatusBadge({ status, variant = 'inline', className = '' }) {
  const { t } = useTranslation()
  const normalized = normalizeListingStatus(status)
  const style = statusStyles[normalized] ?? statusStyles.available
  const variantStyle = variantStyles[variant] ?? variantStyles.inline

  return (
    <span
      className={`inline-flex items-center ring-1 ring-inset ${variantStyle} ${style} ${className}`}
    >
      {t(getListingStatusLabelKey(status))}
    </span>
  )
}

export default ListingStatusBadge
