export const TMDB_POSTER_BASE_URL = "https://image.tmdb.org/t/p/w500";

export const getFullPosterUrl = (posterPath: string | null) =>
  posterPath
    ? `${TMDB_POSTER_BASE_URL}${posterPath}`
    : "../assets/Camera Logo.svg";
