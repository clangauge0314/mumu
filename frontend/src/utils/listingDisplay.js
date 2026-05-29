/** 카드·검색용: "101호 (민수)" */
export function formatListingLocationLabel(location, nickname) {
  const room = String(location ?? '').trim()
  const name = String(nickname ?? '').trim()

  if (room && name) return `${room} (${name})`
  if (room) return room
  if (name) return name
  return ''
}
