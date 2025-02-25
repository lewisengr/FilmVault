const API_BASE_URL = "https://localhost:7170/api/movies"; // Use HTTPS and port 7170

// Define the Movie type
interface Movie {
  id: number;
  title: string;
  overview: string;
  posterPath: string | null;
  voteAverage: number;
  releaseDate: string | null;
  fullPosterPath: string;
}

// Function to fetch movie by ID with proper TypeScript typing
export const fetchMovieById = async (
  movieId: number
): Promise<Movie | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${movieId}`, {
      method: "GET",
      mode: "cors", // Ensures request respects CORS
      credentials: "include", // If you're using authentication (cookies, tokens)
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch movie data: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      id: data.id,
      title: data.title,
      overview: data.overview,
      posterPath: data.poster_path ?? null,
      voteAverage: data.vote_average ?? 0,
      releaseDate: data.release_date ?? null,
      fullPosterPath: data.poster_path
        ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
        : "",
    };
  } catch (error) {
    console.error("Error fetching movie:", error);
    return null;
  }
};
