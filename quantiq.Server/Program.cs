using Microsoft.EntityFrameworkCore;
using quantiq.Server.Data;

namespace quantiq.Server
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // CORS politikası tanımlama
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowLocalhost", builder =>
                {
                    builder.WithOrigins("https://localhost:54375")
                           .AllowAnyHeader()
                           .AllowAnyMethod();
                });
            });

            // Controller servislerini ekleme
            builder.Services.AddControllers();

            // Swagger ve API Explorer ekleme
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            // AppDbContext'i servislere ekleme
            builder.Services.AddDbContext<AppDbContext>(options =>
                options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

            // HTTP Client ekleme
            builder.Services.AddHttpClient();

            var app = builder.Build();

            // Varsayılan dosyalar ve statik dosya ayarları
            app.UseDefaultFiles();
            app.UseStaticFiles();

            // CORS kullanımını aktif etme
            app.UseCors("AllowLocalhost");

            // Geliştirme ortamı için Swagger ve hata sayfası
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
                app.UseDeveloperExceptionPage();
            }

            app.UseHttpsRedirection();
            app.UseAuthorization();

            // Controller'ları haritalama
            app.MapControllers();

            // SPA fallback dosyası
            app.MapFallbackToFile("/index.html");

            app.Run();
        }
    }
}
