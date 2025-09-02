export function loadFavorites() {
  try { return JSON.parse(localStorage.getItem('favorites') || '[]') } catch { return [] }
}

export function saveFavorites(favs) {
  try { localStorage.setItem('favorites', JSON.stringify(favs)) } catch {}
}

export function hasFavorite(favs, id) {
  for (const f of favs) if (f.imdbID === id) return true
  return false
}

export function toggleFavorite(favs, item) {
  let found = false
  const next = []
  for (const f of favs) {
    if (f.imdbID === item.imdbID) { found = true; continue }
    next.push(f)
  }
  if (!found) next.push(item)
  return next
}

export function clearFavorites() {
  return []
}
