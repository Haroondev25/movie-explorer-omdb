import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getMovieById } from '../api/omdb.js'
import Poster from '../components/Poster.jsx'
import { loadFavorites, saveFavorites, hasFavorite, toggleFavorite } from '../components/FavoritesStore.js'

export default function DetailsPage({ apiKey }) {
  const { imdbID } = useParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [d, setD] = useState(null)

  const [favorites, setFavorites] = useState(loadFavorites())
  useEffect(()=> saveFavorites(favorites), [favorites])

  useEffect(()=>{
    if (!apiKey || !imdbID) { setError(!apiKey ? 'Missing API key. Open Settings on the search page.' : 'Missing id'); setLoading(false); return }
    let ignore = false; const ctrl = new AbortController()
    setError(''); setLoading(true)
    getMovieById({ apiKey, imdbID, plot: 'full' }, ctrl.signal)
      .then((data)=>{ if (!ignore) setD(data) })
      .catch((e)=>{ if (!ignore) setError(e.message || 'Failed to load details') })
      .finally(()=>{ if (!ignore) setLoading(false) })
    return ()=>{ ignore = true; ctrl.abort() }
  }, [apiKey, imdbID])

  if (loading) return <div className="container"><p className="small">Loading details…</p></div>
  if (error) return <div className="container"><div className="error">{error}</div></div>
  if (!d) return <div className="container"><div className="empty">No details found.</div></div>

  return (
    <div className="container">
      <div style={{marginTop:16}}>
        <Link to="/" className="btn small">← Back to search</Link>
      </div>
      <div className="details" style={{marginTop:16}}>
        <Poster src={d.Poster} alt={d.Title} />
        <div>
          <h2 style={{margin:'0 0 8px 0'}}>{d.Title}</h2>
          <p className="small">{d.Year} • {d.Genre}</p>
          <p>{d.Plot}</p>

          <div className="meta-row"><div className="k">Director</div><div>{d.Director}</div></div>
          <div className="meta-row"><div className="k">Writer</div><div>{d.Writer}</div></div>
          <div className="meta-row"><div className="k">Actors</div><div>{d.Actors}</div></div>
          <div className="meta-row"><div className="k">Language</div><div>{d.Language}</div></div>
          <div className="meta-row"><div className="k">Runtime</div><div>{d.Runtime}</div></div>
          <div className="meta-row"><div className="k">Released</div><div>{d.Released}</div></div>
          <div className="meta-row"><div className="k">Awards</div><div>{d.Awards}</div></div>

          <div style={{marginTop:16}}>
            {d.Ratings && d.Ratings.map((r,i)=>(
              <div key={i} className="small">{r.Source}: {r.Value}</div>
            ))}
          </div>

          <div style={{marginTop:16}}>
            <button onClick={()=>setFavorites(prev=>toggleFavorite(prev, d))} className={'fav ' + (hasFavorite(favorites, d.imdbID) ? 'active' : '')}>
              {hasFavorite(favorites, d.imdbID) ? '★ In Favorites' : '☆ Add to Favorites'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
