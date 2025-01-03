using Microsoft.EntityFrameworkCore;
using quantiq.Server.Data;
using quantiq.Server.Services;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;

namespace quantiq.Server
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // CORS ayarları
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowLocalhost", builder =>
                {
                    builder.WithOrigins("https://localhost:54375", "http://localhost:54375")
                           .AllowAnyHeader()
                           .AllowAnyMethod()
                           .AllowCredentials();
                });
            });

            // Oturum tabanlı kimlik doğrulama
            builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
                .AddCookie(options =>
                {
                    options.Cookie.HttpOnly = true;
                    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
                    options.Cookie.SameSite = SameSiteMode.Strict;
                    options.Cookie.Name = "session_id";
                    options.LoginPath = "/api/Auth/login";
                    options.LogoutPath = "/api/Auth/logout";
                    options.ExpireTimeSpan = TimeSpan.FromHours(1);
                    options.SlidingExpiration = true;
                    options.Events = new CookieAuthenticationEvents
                    {
                        OnValidatePrincipal = async context =>
                        {
                            var sessionService = context.HttpContext.RequestServices.GetRequiredService<SessionService>();
                            var sessionId = context.Principal?.FindFirst("session_id")?.Value;

                            if (string.IsNullOrEmpty(sessionId) || !await sessionService.ValidateSession(sessionId, context.Request.HttpContext.Connection.RemoteIpAddress?.ToString() ?? "", context.Request.Headers["User-Agent"].ToString()))
                            {
                                context.RejectPrincipal();
                                await context.HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
                            }
                        }
                    };
                });

            builder.Services.AddSwaggerGen();
            builder.Services.AddAntiforgery(options =>
            {
                options.Cookie.HttpOnly = true;
                options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
                options.HeaderName = "X-XSRF-TOKEN";
            });

            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();
            

            // Veri tabanı bağlamı
            builder.Services.AddDbContext<AppDbContext>(options =>
                options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

            // Servisleri ekleyin
            builder.Services.AddHttpClient();
            builder.Services.AddScoped<AuthService>();
            builder.Services.AddScoped<SessionService>();

            var app = builder.Build();

            // CORS kullanımı
            app.UseCors("AllowLocalhost");

            // Swagger middleware'ini ekleyin geliştirme ortamında
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI(c =>
                {
                    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Quantiq API V1");
                    c.RoutePrefix = "swagger";
                });
            }

            // Authentication ve Authorization middleware'lerini ekleyin
            app.UseAuthentication();
            app.UseAuthorization();

            // Controllers'ı haritalayın
            app.MapControllers();

            app.Run();
        }
    }
}
