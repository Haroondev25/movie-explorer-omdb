export async function searchMovies({ apiKey, query, type, page, year }, signal) {
  const url = new URL('https://www.omdbapi.com/')
  url.searchParams.set('apikey', apiKey)
  url.searchParams.set('s', query)
  if (type) url.searchParams.set('type', type)
  if (year) url.searchParams.set('y', year)
  url.searchParams.set('page', page)

  const res = await fetch(url, { signal })
  const data = await res.json()
  if (data.Response === 'False') throw new Error(data.Error || 'OMDB Error')
  return data
}

export async function getMovieById({ apiKey, imdbID, plot='full' }, signal) {
  const url = new URL('https://www.omdbapi.com/')
  url.searchParams.set('apikey', apiKey)
  url.searchParams.set('i', imdbID)
  url.searchParams.set('plot', plot)
  const res = await fetch(url, { signal })
  const data = await res.json()
  if (data.Response === 'False') throw new Error(data.Error || 'OMDB Error')
  return data
}
