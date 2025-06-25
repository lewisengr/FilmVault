import { Movie, RawMovie } from "../types/Movie";
import { get } from "../utils/api";

/**
 * Fetches a movie by its ID from the API.
 * @param movieId - The ID of the movie to fetch.
 * @param token - Optional authentication token for API access.
 * @returns A Promise that resolves to a Movie object or null if the movie is not found.
 * @throws Will log an error to the console if the fetch fails.
 */
export const fetchMovieById = async (
  movieId: number,
  token?: string
): Promise<Movie | null> => {
  try {
    const raw = await get<RawMovie>(`/movies/${movieId}`, token);

    const movie: Movie = {
      id: raw.id,
      title: raw.title,
      overview: raw.overview,
      posterPath: raw.poster_path ?? null,
      voteAverage: raw.vote_average ?? 0,
      releaseDate: raw.release_date ?? null,
      fullPosterPath: raw.poster_path
        ? `https://image.tmdb.org/t/p/w500${raw.poster_path}`
        : null,
    };

    return movie;
  } catch (error) {
    console.error("Error fetching movie:", error);
    return null;
  }
};
