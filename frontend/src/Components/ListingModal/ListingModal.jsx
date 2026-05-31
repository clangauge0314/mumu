import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ImagePlus, X } from 'lucide-react'
import { toast } from 'sonner'
import { i18nToast } from '../../utils/i18nToast'
import { useTranslation } from '../../hooks/useTranslation'
import { useAuthStore } from '../../store/useAuthStore'
import {
  isUploadApiConfigured,
  uploadListingPhotos,
} from '../../services/uploadService'
import { createListing, updateListing } from '../../services/listingService'
import { digitsFromRoom, isPlaceholderRoom } from '../../utils/roomNumber'
import { useAppStore } from '../../store/useAppStore'
import { uploadDebugError, isUploadDebugEnabled } from '../../utils/uploadDebug'
import {
  categoryGroups,
  defaultCategoryId,
  getCategoryGroupLabel,
  getCategoryLabel,
} from '../../config/categories'
import {
  getListingStatusLabelKey,
  LISTING_STATUS,
  LISTING_STATUS_OPTIONS,
  normalizeListingStatus,
} from '../../config/listingStatus'
import ListingPhotoGrid from './ListingPhotoGrid'
import PriceInput from '../PriceInput/PriceInput'
import { formatPriceInput, parsePriceDigits } from '../../utils/formatProductPrice'

const MAX_PHOTOS = 6

function revokeBlobPreview(photo) {
  if (photo?.previewUrl?.startsWith('blob:')) {
    URL.revokeObjectURL(photo.previewUrl)
  }
}

function ListingModal({ isOpen, onClose, editListing = null }) {
  const { t } = useTranslation()
  const user = useAuthStore((state) => state.user)
  const openProfile = useAppStore((state) => state.openProfile)
  const isEditMode = Boolean(editListing?.id)
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [isFreeShare, setIsFreeShare] = useState(false)
  const [category, setCategory] = useState(defaultCategoryId)
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState(LISTING_STATUS.AVAILABLE)
  const [photos, setPhotos] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef(null)

  const MAX_PHOTO_BYTES = 15 * 1024 * 1024
  const ALLOWED_PHOTO_TYPES = new Set([
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/avif',
    'image/gif',
  ])

  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isOpen, onClose])

  useEffect(() => {
    if (!isOpen) return
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const redirectForPlaceholderRoom = () => {
    i18nToast.warning('listingRoomPlaceholderWarn')
    onClose()
    openProfile()
  }

  useEffect(() => {
    if (!isOpen || isEditMode) return
    if (user && isPlaceholderRoom(user.location)) {
      redirectForPlaceholderRoom()
    }
  }, [isOpen, isEditMode, user?.id, user?.location])

  useEffect(() => {
    if (!isOpen) return

    if (editListing) {
      setTitle(editListing.title ?? '')
      setPrice(
        editListing.price === 0 ? '' : formatPriceInput(String(editListing.price)),
      )
      setIsFreeShare(editListing.price === 0)
      setCategory(editListing.category ?? defaultCategoryId)
      setDescription(editListing.description ?? '')
      setStatus(normalizeListingStatus(editListing.status))
      setPhotos(
        (editListing.imageUrls ?? []).map((url, index) => ({
          id: `existing-${index}-${url}`,
          existingUrl: url,
          previewUrl: url,
        })),
      )
      return
    }

    setTitle('')
    setPrice('')
    setIsFreeShare(false)
    setCategory(defaultCategoryId)
    setDescription('')
    setPhotos([])
  }, [isOpen, editListing?.id])

  const handleClose = () => {
    onClose()
  }

  const resetForm = () => {
    setTitle('')
    setPrice('')
    setIsFreeShare(false)
    setCategory(defaultCategoryId)
    setDescription('')
    setStatus(LISTING_STATUS.AVAILABLE)
    setPhotos((prev) => {
      prev.forEach(revokeBlobPreview)
      return []
    })
  }

  const handlePhotoClick = () => {
    if (photos.length >= MAX_PHOTOS) return
    fileInputRef.current?.click()
  }

  const handlePhotoChange = (event) => {
    const fileList = Array.from(event.target.files ?? [])
    if (!fileList.length) return

    const slotsLeft = MAX_PHOTOS - photos.length
    if (slotsLeft <= 0) {
      event.target.value = ''
      return
    }

    for (const file of fileList) {
      if (!ALLOWED_PHOTO_TYPES.has(file.type)) {
        i18nToast.error('listingImageTypeError')
        event.target.value = ''
        return
      }
      if (file.size > MAX_PHOTO_BYTES) {
        i18nToast.error('listingImageSizeError')
        event.target.value = ''
        return
      }
    }

    const next = fileList.map((file) => ({
      id: `new-${file.name}-${file.lastModified}-${Math.random()}`,
      file,
      previewUrl: URL.createObjectURL(file),
    }))

    setPhotos((prev) => [...prev, ...next].slice(0, MAX_PHOTOS))
    event.target.value = ''
  }

  const handleRemovePhoto = (id) => {
    setPhotos((prev) => {
      const target = prev.find((photo) => photo.id === id)
      revokeBlobPreview(target)
      return prev.filter((photo) => photo.id !== id)
    })
  }

  const handleReorderPhotos = (fromId, toId) => {
    setPhotos((prev) => {
      const fromIndex = prev.findIndex((photo) => photo.id === fromId)
      const toIndex = prev.findIndex((photo) => photo.id === toId)
      if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) return prev
      const next = [...prev]
      const [moved] = next.splice(fromIndex, 1)
      next.splice(toIndex, 0, moved)
      return next
    })
  }

  const uploadErrorKey = (error) => {
    const code = error?.code ?? error?.message?.split('|')?.[0] ?? error?.message ?? ''
    if (code === 'UPLOAD_API_NOT_CONFIGURED') return 'uploadApiNotConfigured'
    if (code === 'UNSUPPORTED_IMAGE_TYPE') return 'listingImageTypeError'
    if (code === 'IMAGE_TOO_LARGE') return 'listingImageSizeError'
    if (code === 'UPLOAD_NETWORK_ERROR') return 'listingUploadNetworkError'
    if (code === 'UPLOAD_INVALID_RESPONSE') return 'listingUploadInvalidResponse'
    return 'listingUploadFailed'
  }

  const listingErrorKey = (error) => {
    const code = error?.code ?? ''
    const message = error?.message ?? ''
    if (code === 'permission-denied' || message === 'LISTING_PERMISSION_DENIED') {
      return 'listingFirestorePermissionError'
    }
    if (message === 'LISTING_NOT_AUTHENTICATED') return 'authErrorNotLoggedIn'
    if (message === 'LISTING_TITLE_REQUIRED') return 'listingTitleRequired'
    if (message.startsWith('LISTING_')) {
      return isEditMode ? 'listingUpdateFailed' : 'listingCreateFailed'
    }
    return null
  }

  const resolveSubmitErrorKey = (error) =>
    listingErrorKey(error) ?? uploadErrorKey(error)

  const logSubmitError = (stage, error, extra) => {
    uploadDebugError(stage, error, extra)
    if (isUploadDebugEnabled()) {
      console.info(
        '[mumu:upload] 디버그: 콘솔에서 window.__mumuUploadDebug.info() 또는 .ping() 실행',
      )
    }
  }

  const buildImageUrls = async () => {
    const newFiles = photos.filter((photo) => photo.file).map((photo) => photo.file)

    let uploadedUrls = []
    if (newFiles.length > 0) {
      if (!isUploadApiConfigured()) {
        throw new Error('UPLOAD_API_NOT_CONFIGURED')
      }
      const uploaded = await uploadListingPhotos(newFiles, {
        roomNumber: digitsFromRoom(user.location),
      })
      uploadedUrls = uploaded.map((item) => item.url)
    }

    let uploadIndex = 0
    return photos
      .map((photo) => {
        if (photo.existingUrl) return photo.existingUrl
        if (photo.file) {
          const url = uploadedUrls[uploadIndex]
          uploadIndex += 1
          return url
        }
        return null
      })
      .filter(Boolean)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (isSubmitting) return
    if (!user) {
      i18nToast.error('authErrorNotLoggedIn')
      return
    }

    if (!isEditMode && isPlaceholderRoom(user.location)) {
      redirectForPlaceholderRoom()
      return
    }

    const listingPayload = {
      title,
      price: parsePriceDigits(price),
      isFreeShare,
      category,
      description,
      seller: user,
    }

    setIsSubmitting(true)
    try {
      const imageUrls = await buildImageUrls()

      if (isEditMode) {
        await updateListing(editListing.id, { ...listingPayload, imageUrls, status })
        i18nToast.success('listingUpdatedSuccess')
      } else {
        await createListing({ ...listingPayload, imageUrls })
        i18nToast.success('listingCreatedSuccess')
      }

      resetForm()
      handleClose()
    } catch (error) {
      logSubmitError(
        isEditMode ? 'listing update' : 'listing submit',
        error,
        { photoCount: photos.length },
      )
      const key = resolveSubmitErrorKey(error)
      if (isUploadDebugEnabled() && (error?.detail || error?.code)) {
        toast.error(
          `${t(key)}${error.detail ? ` — ${error.detail}` : ''}${error.code ? ` (${error.code})` : ''}`,
        )
      } else {
        i18nToast.error(key)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/45 px-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 22, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 360, damping: 30 }}
            className="max-h-[min(92vh,720px)] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl sm:p-6 dark:bg-slate-900 dark:shadow-black/50"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[#1b76fb]">
                  {t('dormName')}
                </p>
                <h2 className="mt-1 text-xl font-bold text-slate-900 dark:text-slate-50">
                  {isEditMode ? t('listingEditTitle') : t('listingFormTitle')}
                </h2>
              </div>
              <button
                type="button"
                onClick={handleClose}
                aria-label={t('closeModal')}
                className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t('listingTitlePlaceholder')}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#1b76fb] focus:ring-2 focus:ring-[#1b76fb]/20 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
                required
              />
              <div className="grid grid-cols-2 gap-3">
                <PriceInput
                  value={price}
                  onChange={setPrice}
                  placeholder={t('listingPricePlaceholder')}
                  disabled={isFreeShare}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#1b76fb] focus:ring-2 focus:ring-[#1b76fb]/20 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:disabled:bg-slate-900 dark:disabled:text-slate-500"
                />
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#1b76fb] focus:ring-2 focus:ring-[#1b76fb]/20 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                >
                  {categoryGroups.map((group) => (
                    <optgroup
                      key={group.id}
                      label={getCategoryGroupLabel(group.id, t)}
                    >
                      {group.items.map((item) => (
                        <option key={item.id} value={item.id}>
                          {getCategoryLabel(item.id, t)}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
              <label className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-[#1b76fb]/40 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200">
                <input
                  type="checkbox"
                  checked={isFreeShare}
                  onChange={(e) => {
                    setIsFreeShare(e.target.checked)
                    if (e.target.checked) setPrice('')
                  }}
                  className="h-4 w-4 accent-[#1b76fb]"
                />
                {t('freeShare')}
              </label>
              {isEditMode && (
                <div>
                  <label
                    htmlFor="listing-status"
                    className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400"
                  >
                    {t('listingStatusLabel')}
                  </label>
                  <select
                    id="listing-status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#1b76fb] focus:ring-2 focus:ring-[#1b76fb]/20 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                  >
                    {LISTING_STATUS_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {t(getListingStatusLabelKey(option))}
                      </option>
                    ))}
                  </select>
                  {status === LISTING_STATUS.AVAILABLE &&
                    normalizeListingStatus(editListing?.status) !==
                      LISTING_STATUS.AVAILABLE && (
                      <p className="mt-1 text-xs text-amber-700 dark:text-amber-300">
                        {t('listingStatusResetHint')}
                      </p>
                    )}
                </div>
              )}
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t('listingDescriptionPlaceholder')}
                rows={4}
                className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#1b76fb] focus:ring-2 focus:ring-[#1b76fb]/20 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
              />

              <button
                type="button"
                onClick={handlePhotoClick}
                disabled={isSubmitting || photos.length >= MAX_PHOTOS}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300 bg-slate-50 py-3 text-sm font-medium text-slate-600 transition hover:border-[#1b76fb]/40 hover:text-[#1b76fb] disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:text-[#5b9dff]"
              >
                <ImagePlus size={16} />
                {t('listingPhotoUpload', { count: photos.length })}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handlePhotoChange}
              />

              {photos.length > 0 && (
                <ListingPhotoGrid
                  photos={photos}
                  onReorder={handleReorderPhotos}
                  onRemove={handleRemovePhoto}
                  disabled={isSubmitting}
                />
              )}

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-50 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  {t('listingCancel')}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-lg bg-[#1b76fb] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1667d8] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting
                    ? t('listingUploading')
                    : isEditMode
                      ? t('listingSaveEdit')
                      : t('listingSubmitDraft')}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ListingModal
