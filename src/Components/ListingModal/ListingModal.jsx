import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ImagePlus, X } from 'lucide-react'

function ListingModal({ isOpen, onClose }) {
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [isFreeShare, setIsFreeShare] = useState(false)
  const [category, setCategory] = useState('digital')
  const [description, setDescription] = useState('')
  const [photos, setPhotos] = useState([])
  const fileInputRef = useRef(null)

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

  useEffect(() => {
    return () => {
      photos.forEach((photo) => URL.revokeObjectURL(photo.previewUrl))
    }
  }, [photos])

  const handleClose = () => {
    onClose()
  }

  const handlePhotoClick = () => {
    fileInputRef.current?.click()
  }

  const handlePhotoChange = (event) => {
    const fileList = Array.from(event.target.files ?? [])
    if (!fileList.length) return

    const next = fileList.map((file) => ({
      id: `${file.name}-${file.lastModified}-${Math.random()}`,
      file,
      previewUrl: URL.createObjectURL(file),
    }))

    setPhotos((prev) => [...prev, ...next].slice(0, 6))
    event.target.value = ''
  }

  const handleRemovePhoto = (id) => {
    setPhotos((prev) => {
      const target = prev.find((photo) => photo.id === id)
      if (target) URL.revokeObjectURL(target.previewUrl)
      return prev.filter((photo) => photo.id !== id)
    })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    handleClose()
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
            className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl sm:p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[#1b76fb]">
                  mumu
                </p>
                <h2 className="mt-1 text-xl font-bold text-slate-900">상품 등록</h2>
              </div>
              <button
                type="button"
                onClick={handleClose}
                aria-label="등록 모달 닫기"
                className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="상품명"
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-[#1b76fb] focus:ring-2 focus:ring-[#1b76fb]/20"
                required
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="가격 (원)"
                  disabled={isFreeShare}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-[#1b76fb] focus:ring-2 focus:ring-[#1b76fb]/20 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                />
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#1b76fb] focus:ring-2 focus:ring-[#1b76fb]/20"
                >
                  <option value="digital">디지털</option>
                  <option value="fashion">패션</option>
                  <option value="furniture">가구/인테리어</option>
                  <option value="sports">스포츠/레저</option>
                  <option value="etc">기타</option>
                </select>
              </div>
              <label className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-[#1b76fb]/40">
                <input
                  type="checkbox"
                  checked={isFreeShare}
                  onChange={(e) => {
                    setIsFreeShare(e.target.checked)
                    if (e.target.checked) setPrice('0')
                  }}
                  className="h-4 w-4 accent-[#1b76fb]"
                />
                무료나눔
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="상품 설명 (임시)"
                rows={4}
                className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-[#1b76fb] focus:ring-2 focus:ring-[#1b76fb]/20"
              />

              <button
                type="button"
                onClick={handlePhotoClick}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300 bg-slate-50 py-3 text-sm font-medium text-slate-600 transition hover:border-[#1b76fb]/40 hover:text-[#1b76fb]"
              >
                <ImagePlus size={16} />
                사진 업로드 ({photos.length}/6)
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
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {photos.map((photo) => (
                    <div
                      key={photo.id}
                      className="group relative overflow-hidden rounded-lg border border-slate-200 bg-slate-100"
                    >
                      <img
                        src={photo.previewUrl}
                        alt={photo.file.name}
                        className="aspect-square h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(photo.id)}
                        className="absolute right-1 top-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-black/55 text-white opacity-0 transition group-hover:opacity-100"
                        aria-label="사진 제거"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleClose}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[#1b76fb] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1667d8]"
                >
                  임시 등록
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
