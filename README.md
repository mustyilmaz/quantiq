# QuantiQ E-Commerce Solutions

![QuantiQ Logo](src/assets/logo.svg)

QuantiQ, e-ticaret entegrasyonları için geliştirilmiş modern bir çözüm platformudur. .NET Core backend ve React TypeScript frontend kullanılarak geliştirilmiştir.

## 🛠 Teknoloji Yığını

### Backend
- **.NET 9.0**
- **Entity Framework Core**
- **PostgreSQL 17**
- **JWT Authentication**
- **BCrypt.Net**
- **Cloudflare Turnstile Integration**

### Frontend
- **React 18**
- **TypeScript**
- **Vite**
- **React Router v6**
- **CSS Modules**
- **Dark/Light Theme Support**

## 📋 Ön Gereksinimler
- .NET 9.0 SDK
- Node.js (v16+)
- PostgreSQL 17
- Visual Studio 2022 / VS Code
- Git

## 🚀 Kurulum Adımları

### 1. Repo Klonlama
```bash
git clone https://github.com/mustyilmaz/quantiq.git
cd quantiq
```

### 2. Backend Kurulumu
```bash
cd quantiq.Server
```

appsettings.json içinde aşağıdaki değerleri güncelleyin:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=quantiq;Username=postgres;Password=Pwd123;Port=5432;"
  },
  "Jwt": {
    "SecretKey": "your-secret-key-min-16-chars",
    "Issuer": "your-issuer",
    "Audience": "your-audience"
  },
  "Turnstile": {
    "SecretKey": "your-turnstile-secret-key"
  }
}
```

```bash
# Paketleri yükleyin
dotnet restore

# Database migration
dotnet ef database update

# Projeyi çalıştırın
dotnet run
```

### 3. Frontend Kurulumu
```bash
cd quantiq.client

# Bağımlılıkları yükleyin
npm install

# .env dosyasını oluşturun
cp .env.example .env
```

.env içinde aşağıdaki değerleri güncelleyin:
```env
VITE_TURNSTILE_SITE_KEY=your-turnstile-site-key
```

```bash
# Geliştirme sunucusunu başlatın
npm run dev
```

## 📁 Proje Yapısı

```
quantiq/
├── quantiq.Server/           # Backend projesi
│   ├── Controllers/         # API Controllers
│   ├── Services/           # Business logic
│   ├── Models/            # Domain models
│   │   ├── Entities/     # Database entities
│   │   └── Enums/       # Enumerations
│   ├── DTOs/            # Data transfer objects
│   │   ├── Auth/       # Authentication DTOs
│   │   └── User/      # User related DTOs
│   └── Data/          # Database context
│
└── quantiq.client/          # Frontend projesi
    ├── src/
    │   ├── components/    # React components
    │   ├── services/     # API services
    │   ├── context/     # React context
    │   ├── hooks/      # Custom hooks
    │   ├── routes/    # Route components
    │   └── types/    # TypeScript types
```

## 🔒 Güvenlik Özellikleri
- JWT Authentication
- Password Hashing (BCrypt)
- Cloudflare Turnstile Bot Protection
- HTTPS Enforcement
- CORS Policy
- XSS Protection

## 🎨 Tema Desteği
Proje, CSS değişkenleri kullanarak dark/light tema desteği sunar. Tema değişimi otomatik olarak kullanıcı tercihlerine göre yapılır.

## 🤝 Katkıda Bulunma
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📫 İletişim
- Email: your-email@example.com
- Project Link: https://github.com/mustyilmaz/quantiq

## 📄 Lisans
Bu proje [MIT](LICENSE) lisansı altında lisanslanmıştır.

---

QuantiQ ile dijital dönüşümünüzü başlatın!
