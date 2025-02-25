const API_BASE_URL = "http://localhost:5000/api/movies";

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
    const response = await fetch(`${API_BASE_URL}/${movieId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch movie data");
    }
    return (await response.json()) as Movie;
  } catch (error) {
    console.error("Error fetching movie:", error);
    return null;
  }
};
