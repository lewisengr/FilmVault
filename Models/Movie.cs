using System.Text.Json.Serialization;

namespace FilmVault.Models
{
    public class Movie
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }

        [JsonPropertyName("title")]
        public string Title { get; set; }

        [JsonPropertyName("overview")]
        public string Overview { get; set; }

        [JsonPropertyName("poster_path")]
        public string PosterPath { get; set; }

        [JsonPropertyName("vote_average")]
        public double VoteAverage { get; set; }

        [JsonPropertyName("release_date")]
        public string ReleaseDate { get; set; }

        // Derived property, not part of TMDB JSON
        public string FullPosterPath =>
            string.IsNullOrEmpty(PosterPath)
                ? ""
                : $"https://image.tmdb.org/t/p/w500{PosterPath}";
    }
    public class MovieSearchResult
    {
        [JsonPropertyName("results")]
        public List<Movie> Results { get; set; }
    }
}