import { useState } from "react";

// OMDB API
const API_KEY = "878b31b8"; // your OMDB API key
const BASE_URL = "https://www.omdbapi.com/";

export default function Search() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedPoster, setSelectedPoster] = useState(null);

  // API call
  const searchMovies = async (q) => {
    try {
      const res = await fetch(`${BASE_URL}?apikey=${API_KEY}&s=${q}`);
      return await res.json();
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  // Handle search submit
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) return;

    setLoading(true);
    setError("");
    setMovies([]);

    const data = await searchMovies(query);

    if (data && data.Response === "True") {
      setMovies(data.Search);
    } else {
      setError(data?.Error || "No results found.");
    }

    setLoading(false);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Movie Search</h1>

      {/* Search Box */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Search movies..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border border-gray-400 p-2 rounded w-full"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </form>

      {/* Loading */}
      {loading && <p>Loading...</p>}

      {/* Error */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Results */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {movies.map((movie) => (
          <div
            key={movie.imdbID}
            className="border rounded shadow p-2 text-center bg-white"
          >
            <img
              src={
                movie.Poster !== "N/A"
                  ? movie.Poster
                  : "https://via.placeholder.com/300x450?text=No+Image"
              }
              alt={movie.Title}
              className="w-full h-80 object-contain cursor-pointer transition-transform duration-300 hover:scale-105"
              onClick={() =>
                movie.Poster !== "N/A" ? setSelectedPoster(movie.Poster) : null
              }
            />
            <h3 className="mt-2 font-semibold">{movie.Title}</h3>
            <p className="text-sm text-gray-500">{movie.Year}</p>
          </div>
        ))}
      </div>

      {/* Modal Full Poster */}
      {selectedPoster && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setSelectedPoster(null)}
        >
          <img
            src={selectedPoster}
            alt="Poster"
            className="max-h-[90vh] max-w-[90vw] rounded-lg shadow-lg"
          />
        </div>
      )}
    </div>
  );
}
