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
    private const string BaseUrl = "https://apigw.trendyol.com/integration/"; // yeni apı rotasıyla degistirildi.

    public TrendyolService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<IEnumerable<TrendyolCategory>> GetCategories(string apiKey, string apiSecret, string supplierId)
    {
        try
        {   
            var authString = $"{apiKey}:{apiSecret}";
            var base64Auth = Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes(authString));

            using var request = new HttpRequestMessage(HttpMethod.Get, $"{BaseUrl}product/product-categories");
            request.Headers.Add("Authorization", $"Basic {base64Auth}");
            request.Headers.Add("User-Agent", $"{supplierId} - SelfIntegration");

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

    public async Task<TrendyolBrandResponse> GetBrands(string apiKey, string apiSecret, int page, int size = 1000)
    {
        try
        {
            var authString = $"{apiKey}:{apiSecret}";
            var base64Auth = Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes(authString));

            using var request = new HttpRequestMessage(HttpMethod.Get, $"{BaseUrl}product/brands?page={page}&size={size}");
            request.Headers.Add("Authorization", $"Basic {base64Auth}");

            var response = await _httpClient.SendAsync(request);
            response.EnsureSuccessStatusCode();

            var content = await response.Content.ReadAsStringAsync();
            
            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
                DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull
            };

            var result = JsonSerializer.Deserialize<TrendyolBrandResponse>(content, options);
            if (result == null)
            {
                return new TrendyolBrandResponse { Brands = new List<TrendyolBrand>() };
            }
            return result;
        }
        catch (Exception ex)
        {
            throw new Exception("Failed to fetch Trendyol brands", ex);
        }
    }

    public async Task<IEnumerable<TrendyolBrand>> GetBrandsByName(string apiKey, string apiSecret, string brandName)
    {
        try
        {
            var authString = $"{apiKey}:{apiSecret}";
            var base64Auth = Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes(authString));

            var encodedBrandName = Uri.EscapeDataString(brandName.Trim());
            var requestUrl = $"{BaseUrl}product/brands/by-name?name={encodedBrandName}";


            using var request = new HttpRequestMessage(HttpMethod.Get, requestUrl);
            request.Headers.Add("Authorization", $"Basic {base64Auth}");
            
            var response = await _httpClient.SendAsync(request);
            var content = await response.Content.ReadAsStringAsync();

            response.EnsureSuccessStatusCode();

            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
                DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull
            };

            // API doğrudan TrendyolBrand dizisi dönüyor
            var brands = JsonSerializer.Deserialize<List<TrendyolBrand>>(content, options);
            return brands ?? new List<TrendyolBrand>();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Trendyol API Error: {ex.Message}");
            throw new Exception($"Marka araması başarısız oldu. Marka adı: {brandName}, Hata: {ex.Message}", ex);
        }
    }
}

public class TrendyolCategoryResponse
{
    [JsonPropertyName("categories")]
    public required List<TrendyolCategory> Categories { get; set; }
}

public class TrendyolCategory
{
    [JsonPropertyName("id")]
    public long Id { get; set; }

    [JsonPropertyName("name")]
    public required string Name { get; set; }

    [JsonPropertyName("parentId")]
    public long? ParentId { get; set; }

    [JsonPropertyName("subCategories")]
    public List<TrendyolCategory> SubCategories { get; set; } = new List<TrendyolCategory>();
}

public class TrendyolBrandResponse
{
    [JsonPropertyName("brands")]
    public required List<TrendyolBrand> Brands { get; set; }
}

public class TrendyolBrand
{
    [JsonPropertyName("id")]
    public long Id { get; set; }

    [JsonPropertyName("name")]
    public required string Name { get; set; }
}