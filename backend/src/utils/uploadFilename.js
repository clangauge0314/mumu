import fs from 'node:fs/promises'
import path from 'node:path'

/** 호실: 숫자 3자리만 (예: 101) */
export function sanitizeRoomNumber(value) {
  const digits = String(value ?? '').replace(/\D/g, '').slice(0, 3)
  if (digits.length === 3) return digits
  return 'unknown'
}

export function formatBatchTime(value) {
  if (value && /^\d{8}-\d{6}$/.test(value)) return value

  const d = value ? new Date(value) : new Date()
  if (Number.isNaN(d.getTime())) return formatBatchTime()

  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`
}

export function buildUploadFilename({ roomNumber, batchTime, index, ext }) {
  const room = sanitizeRoomNumber(roomNumber)
  const time = formatBatchTime(batchTime)
  const num = Math.max(1, Math.floor(Number(index)) || 1)
  const safeExt = ext.startsWith('.') ? ext : `.${ext}`
  return `${room}_${time}_${num}${safeExt}`
}

/** 동일 이름이 있으면 _dup2 … 붙임 */
export async function resolveUniqueFilename(uploadsDir, baseFilename) {
  const ext = path.extname(baseFilename)
  const stem = baseFilename.slice(0, -ext.length)
  let candidate = baseFilename
  let suffix = 1

  while (true) {
    try {
      await fs.access(path.join(uploadsDir, candidate))
      suffix += 1
      candidate = `${stem}_dup${suffix}${ext}`
    } catch {
      return candidate
    }
  }
}
