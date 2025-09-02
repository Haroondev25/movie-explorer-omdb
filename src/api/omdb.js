const API_KEY = "878b31b8"; // 🔑 Replace with your OMDB API key
const BASE_URL = "https://www.omdbapi.com/";

// Fetch movies by search term
export async function searchMovies(query) {
  try {
    const response = await fetch(`${BASE_URL}?s=${query}&apikey=${API_KEY}`);
    const data = await response.json();
    console.log("searchMovies response:", data); // Debug log
    return data;
  } catch (error) {
    console.error("Error fetching movies:", error);
    return { Response: "False", Error: error.message };
  }
}

// Fetch movie details by imdbID
export async function getMovieById(id) {
  try {
    const response = await fetch(`${BASE_URL}?i=${id}&apikey=${API_KEY}`);
    const data = await response.json();
    console.log("getMovieById response:", data); // Debug log
    return data;
  } catch (error) {
    console.error("Error fetching movie by ID:", error);
    return { Response: "False", Error: error.message };
  }
}

