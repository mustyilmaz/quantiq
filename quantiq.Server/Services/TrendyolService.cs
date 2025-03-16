using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

public class TrendyolService
{
    private readonly HttpClient _httpClient;
    private const string BaseUrl = "https://api.trendyol.com/sapigw/";

    public TrendyolService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<IEnumerable<TrendyolCategory>> GetCategories(string apiKey, string apiSecret, string suppleirId)
    {
        try
        {   
            var authString = $"{apiKey}:{apiSecret}";
            var base64Auth = Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes(authString));

            using var request = new HttpRequestMessage(HttpMethod.Get, $"{BaseUrl}product-categories");
            request.Headers.Add("Authorization", $"Basic {base64Auth}");
            request.Headers.Add("User-Agent", $"{suppleirId} - SelfIntegration");

            var response = await _httpClient.SendAsync(request);
            response.EnsureSuccessStatusCode();

            var content = await response.Content.ReadAsStringAsync();
            
            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
                DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull
            };

            var result = JsonSerializer.Deserialize<TrendyolCategoryResponse>(content, options);
            return result?.Categories ?? new List<TrendyolCategory>();
        }
        catch (Exception ex)
        {
            // Log the error
            throw new Exception("Failed to fetch Trendyol categories", ex);
        }
    }
}

public class TrendyolCategoryResponse
{
    [JsonPropertyName("categories")]
    public List<TrendyolCategory> Categories { get; set; }
}

public class TrendyolCategory
{
    [JsonPropertyName("id")]
    public long Id { get; set; }

    [JsonPropertyName("name")]
    public string Name { get; set; }

    [JsonPropertyName("parentId")]
    public long? ParentId { get; set; }

    [JsonPropertyName("subCategories")]
    public List<TrendyolCategory> SubCategories { get; set; } = new List<TrendyolCategory>();
} 