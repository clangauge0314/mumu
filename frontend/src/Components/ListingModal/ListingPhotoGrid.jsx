import { useState } from 'react'
import { GripVertical, X } from 'lucide-react'
import { useTranslation } from '../../hooks/useTranslation'

function ListingPhotoGrid({ photos, onReorder, onRemove, disabled = false }) {
  const { t } = useTranslation()
  const [dragId, setDragId] = useState(null)
  const [overId, setOverId] = useState(null)

  const handleDragStart = (id) => (event) => {
    if (disabled) return
    setDragId(id)
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', id)
  }

  const handleDragEnd = () => {
    setDragId(null)
    setOverId(null)
  }

  const handleDragOver = (id) => (event) => {
    if (disabled || !dragId || dragId === id) return
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
    setOverId(id)
  }

  const handleDrop = (targetId) => (event) => {
    event.preventDefault()
    if (disabled || !dragId || dragId === targetId) return
    onReorder(dragId, targetId)
    setDragId(null)
    setOverId(null)
  }

  return (
    <div className="space-y-2">
      <p className="text-xs text-slate-500 dark:text-slate-400">
        {t('listingPhotoReorderHint')}
      </p>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {photos.map((photo, index) => {
          const isDragging = dragId === photo.id
          const isOver = overId === photo.id && dragId !== photo.id

          return (
            <div
              key={photo.id}
              draggable={!disabled}
              onDragStart={handleDragStart(photo.id)}
              onDragEnd={handleDragEnd}
              onDragOver={handleDragOver(photo.id)}
              onDragLeave={() => setOverId((prev) => (prev === photo.id ? null : prev))}
              onDrop={handleDrop(photo.id)}
              className={`group relative overflow-hidden rounded-lg border bg-slate-100 transition dark:bg-slate-800 ${
                isDragging
                  ? 'scale-[0.97] border-dashed border-[#1b76fb] opacity-50'
                  : isOver
                    ? 'border-2 border-[#1b76fb] ring-2 ring-[#1b76fb]/25'
                    : 'border-slate-200 dark:border-slate-700'
              } ${disabled ? 'pointer-events-none opacity-60' : 'cursor-grab active:cursor-grabbing'}`}
            >
              <img
                src={photo.previewUrl}
                alt=""
                draggable={false}
                className="aspect-square h-full w-full object-cover"
              />

              <span
                className={`absolute left-1 top-1 flex h-6 min-w-6 items-center justify-center rounded-full px-1 text-xs font-bold text-white shadow ${
                  index === 0 ? 'bg-[#1b76fb]' : 'bg-black/60'
                }`}
                aria-label={t('listingPhotoOrder', { order: index + 1 })}
              >
                {index === 0 ? t('listingPhotoCover') : index + 1}
              </span>

              {!disabled && (
                <span className="absolute bottom-1 left-1 inline-flex h-6 w-6 items-center justify-center rounded bg-black/45 text-white">
                  <GripVertical size={14} aria-hidden />
                </span>
              )}

              <button
                type="button"
                disabled={disabled}
                onMouseDown={(event) => event.stopPropagation()}
                onClick={() => onRemove(photo.id)}
                className="absolute right-1 top-1 z-10 inline-flex h-7 w-7 items-center justify-center rounded-full bg-black/65 text-white shadow transition hover:bg-red-600"
                aria-label={t('listingRemovePhoto')}
              >
                <X size={15} />
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ListingPhotoGrid
