using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using FilmVault.Models;
using Microsoft.Extensions.Configuration;

namespace FilmVault.Services
{
    public class TMDBService
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey;
        private readonly string _baseUrl = "https://api.themoviedb.org/3";

        public TMDBService(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _apiKey = configuration["TMDB:ApiKey"] ?? throw new ArgumentNullException("TMDB API Key is missing");
        }

        public async Task<Movie> GetMovieByIdAsync(int id)
        {
            var url = $"{_baseUrl}/movie/{id}?api_key={_apiKey}";
            var response = await _httpClient.GetStringAsync(url);
            return JsonSerializer.Deserialize<Movie>(response);
        }

        public async Task<List<Movie>> SearchMoviesAsync(string query)
        {
            var url = $"{_baseUrl}/search/movie?api_key={_apiKey}&query={Uri.EscapeDataString(query)}";
            var response = await _httpClient.GetStringAsync(url);
            var result = JsonSerializer.Deserialize<MovieSearchResult>(response);
            return result?.Results ?? new List<Movie>();
        }

        public async Task<List<Movie>> GetPopularMoviesAsync()
        {
            var url = $"{_baseUrl}/movie/popular?api_key={_apiKey}";
            var response = await _httpClient.GetStringAsync(url);
            var result = JsonSerializer.Deserialize<MovieSearchResult>(response);
            return result?.Results ?? new List<Movie>();
        }
    }

    public class MovieSearchResult
    {
        public List<Movie> Results { get; set; }
    }
}
