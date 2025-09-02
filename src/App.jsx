import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import SearchPage from './pages/Search.jsx'
import DetailsPage from './pages/Details.jsx'

export default function App() {
  const [apiKey, setApiKey] = useState(localStorage.getItem('omdb_api_key') || '')

  useEffect(() => {
    if (apiKey) localStorage.setItem('omdb_api_key', apiKey)
  }, [apiKey])

  return (
    <Routes>
      <Route path="/" element={<SearchPage apiKey={apiKey} setApiKey={setApiKey} />} />
      <Route path="/movie/:imdbID" element={<DetailsPage apiKey={apiKey} />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
