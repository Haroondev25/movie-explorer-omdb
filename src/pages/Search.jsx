import React, { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { searchMovies, getMovieById } from '../api/omdb.js'
import Poster from '../components/Poster.jsx'
import Settings from '../components/Settings.jsx'
import { loadFavorites, saveFavorites, hasFavorite, toggleFavorite, clearFavorites } from '../components/FavoritesStore.js'

export default function SearchPage({ apiKey, setApiKey }) {
  const [params, setParams] = useSearchParams()
  const [query, setQuery] = useState(params.get('q') || '')
  const [type, setType] = useState(params.get('type') || '')
  const [page, setPage] = useState(Number(params.get('page') || 1))
  const [year, setYear] = useState(params.get('y') || '')

  const [results, setResults] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [favorites, setFavorites] = useState(loadFavorites())
  useEffect(() => saveFavorites(favorites), [favorites])

  useEffect(() => {
    const sp = {}
    if (query) sp.q = query
    if (type) sp.type = type
    if (page > 1) sp.page = page
    if (year) sp.y = year
    setParams(sp)
  }, [query, type, page, year])

  useEffect(() => {
    if (!query || !apiKey) return
    let ignore = false
    const ctrl = new AbortController()
    setLoading(true); setError('')
    searchMovies({ apiKey, query, type, page, year }, ctrl.signal)
      .then(async (data) => {
        if (ignore) return
        setTotal(Number(data.totalResults || 0))
        const items = data.Search || []
        // fetch extra details (plot)
        const detailed = await Promise.all(items.map(async (m) => {
          try {
            const det = await getMovieById({ apiKey, imdbID: m.imdbID, plot:'short' }, ctrl.signal)
            return { ...m, Plot: det.Plot }
          } catch {
            return m
          }
        }))
        setResults(detailed)
      })
      .catch((e) => {
        if (!ignore) setError(e.message || 'Failed to fetch')
      })
      .finally(() => { if (!ignore) setLoading(false) })
    return () => { ignore = true; ctrl.abort() }
  }, [apiKey, query, type, page, year])

  const pages = Math.ceil(total / 10)

  return (
    <div className="container">
      <div className="header">
        <div className="brand">Movie Explorer</div>
        <Settings apiKey={apiKey} setApiKey={setApiKey} />
      </div>

      <div style={{marginTop:16, display:'flex', gap:8}}>
        <input className="input" placeholder="Search movies…" value={query} onChange={e => { setQuery(e.target.value); setPage(1) }} />
        <select value={type} onChange={e => { setType(e.target.value); setPage(1) }}>
          <option value="">All</option>
          <option value="movie">Movie</option>
          <option value="series">Series</option>
          <option value="episode">Episode</option>
        </select>
        <input className="input" placeholder="Year" value={year} onChange={e => { setYear(e.target.value); setPage(1) }} style={{width:80}} />
      </div>

      {loading && <p className="small">Loading…</p>}
      {error && <div className="error">{error}</div>}
      {!loading && !error && results.length === 0 && query && <div className="empty">No results.</div>}

      <div style={{marginTop:16}}>
        {pages > 1 && (
          <div style={{display:'flex', gap:8, alignItems:'center'}}>
            <button className="btn small" disabled={page<=1} onClick={()=>setPage(p=>Math.max(1, p-1))}>Prev</button>
            <span className="small">Page {page} of {pages}</span>
            <button className="btn small" disabled={page>=pages} onClick={()=>setPage(p=>Math.min(pages, p+1))}>Next</button>
          </div>
        )}
      </div>

      <div className="grid" style={{marginTop:16}}>
        {results.map(m => (
          <div key={m.imdbID} className="card">
            <Poster src={m.Poster} alt={m.Title} />
            <div className="card-title">{m.Title}</div>
            <div className="meta">
              <span>{m.Year}</span>
              <span className="badge">{m.Type}</span>
            </div>
            {m.Plot && <div className="small" style={{marginTop:4}}>{m.Plot}</div>}
            <div style={{marginTop:8}}>
              <button onClick={() => setFavorites(prev => toggleFavorite(prev, m))} className={'fav ' + (hasFavorite(favorites, m.imdbID) ? 'active' : '')}>
                {hasFavorite(favorites, m.imdbID) ? '★' : '☆'} Favorite
              </button>
              <Link to={`/movie/${m.imdbID}`} className="btn small">Details</Link>
            </div>
          </div>
        ))}
      </div>

      {favorites.length > 0 && (
        <div style={{marginTop:32}}>
          <h3>Favorites</h3>
          <button className="btn small" onClick={()=>setFavorites(clearFavorites())}>Clear All</button>
          <div className="grid" style={{marginTop:8}}>
            {favorites.map(f=>(
              <div key={f.imdbID} className="card">
                <Poster src={f.Poster} alt={f.Title} />
                <div className="card-title">{f.Title}</div>
                <div className="meta">
                  <span>{f.Year}</span>
                  <span className="badge">{f.Type}</span>
                </div>
                <div style={{marginTop:8}}>
                  <button onClick={()=>setFavorites(prev => toggleFavorite(prev, f))} className="fav active">★ Remove</button>
                  <Link to={`/movie/${f.imdbID}`} className="btn small">Details</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
