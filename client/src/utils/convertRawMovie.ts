import { Movie, RawMovie } from "../types/Movie";

/**
 * Converts a RawMovie object from the TMDb API to a Movie object.
 * @param raw - The raw movie data from the API.
 * @returns A Movie object with formatted properties.
 */
export const convertRawMovie = (raw: RawMovie): Movie => ({
  id: raw.id,
  title: raw.title,
  overview: raw.overview,
  posterPath: raw.poster_path,
  voteAverage: raw.vote_average,
  releaseDate: raw.release_date,
  fullPosterPath: raw.poster_path
    ? `https://image.tmdb.org/t/p/w500${raw.poster_path}`
    : null,
});
