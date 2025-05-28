using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using FilmVault.Models;
using Microsoft.Extensions.Configuration;

namespace FilmVault.Services
{
    public class TMDBService(HttpClient httpClient, IConfiguration configuration)
    {
        private readonly HttpClient _httpClient = httpClient;
        private readonly string _apiKey = configuration["TMDB:ApiKey"] ?? throw new ArgumentNullException("TMDB API Key is missing");
        private readonly string _baseUrl = "https://api.themoviedb.org/3";

        private readonly JsonSerializerOptions _jsonOptions = new()
        {
            PropertyNameCaseInsensitive = true,
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        };

        public async Task<Movie> GetMovieByIdAsync(int id)
        {
            var url = $"{_baseUrl}/movie/{id}?api_key={_apiKey}";
            var response = await _httpClient.GetStringAsync(url);
            return JsonSerializer.Deserialize<Movie>(response);
        }

        public async Task<List<Movie>> SearchMoviesAsync(string query, int page = 1)
        {
            var url = $"{_baseUrl}/search/movie?api_key={_apiKey}&query={Uri.EscapeDataString(query)}&page={page}";
            var response = await _httpClient.GetStringAsync(url);

            Console.WriteLine("RAW TMDB RESPONSE:");
            Console.WriteLine(response);

            var result = JsonSerializer.Deserialize<MovieSearchResult>(response, _jsonOptions);
            Console.WriteLine($"TMDB returned {result?.Results?.Count ?? 0} movies for query: {query}");

            return result?.Results ?? new List<Movie>();
        }

        public async Task<List<Movie>> GetPopularMoviesAsync()
        {
            var url = $"{_baseUrl}/movie/popular?api_key={_apiKey}";
            var response = await _httpClient.GetStringAsync(url);
            var result = JsonSerializer.Deserialize<MovieSearchResult>(response);
            return result?.Results ?? [];
        }
    }
}