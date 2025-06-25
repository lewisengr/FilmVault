export const TMDB_POSTER_BASE_URL = "https://image.tmdb.org/t/p/w500";

/**
 * Constructs the full URL for a movie poster image.
 * If the posterPath is null, it returns a default placeholder image.
 * @param posterPath - The path to the poster image from TMDb.
 * @returns The full URL to the poster image or a placeholder if no path is provided.
 */
export const getFullPosterUrl = (posterPath: string | null) =>
  posterPath
    ? `${TMDB_POSTER_BASE_URL}${posterPath}`
    : "../assets/Camera Logo.svg";
