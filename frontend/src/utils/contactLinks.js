import { isContactPlaceholder } from './contactId'

export function instagramProfileUrl(instagramId) {
  const handle = String(instagramId ?? '')
    .trim()
    .replace(/^@/, '')
  if (!handle || isContactPlaceholder(handle)) return null
  return `https://www.instagram.com/${encodeURIComponent(handle)}/`
}

export function lineProfileUrl(lineId) {
  const id = String(lineId ?? '')
    .trim()
    .replace(/^@/, '')
  if (!id || isContactPlaceholder(id)) return null
  return `https://line.me/ti/p/~${encodeURIComponent(id)}`
}

export function formatContactDisplay(id) {
  const trimmed = String(id ?? '').trim()
  if (!trimmed || isContactPlaceholder(trimmed)) return null
  return trimmed.startsWith('@') ? trimmed : `@${trimmed}`
}
