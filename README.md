# Movie Explorer (React + OMDB)

## Features
- Search movies, series, episodes via OMDB API
- Server-side filtering by type (`movie`, `series`, `episode`)
- Pagination
- Details page with plot, ratings, cast, etc.
- Favorites (persisted in localStorage)
- Settings modal for API key
- Error handling and empty states

## Setup
1. Unzip project
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start dev server:
   ```bash
   npm run dev
   ```
4. Open browser at http://localhost:5173/
5. Click **Settings** (top-right) to add your OMDB API key.

## Tech
- React + Vite
- React Router
- LocalStorage for favorites
