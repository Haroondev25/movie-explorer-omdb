import React from 'react'

export default function Poster({ src, alt }) {
  const valid = src && src !== 'N/A'
  return <img src={valid ? src : 'https://via.placeholder.com/300x450?text=No+Image'} alt={alt} style={{width:'100%', borderRadius:8}} />
}
