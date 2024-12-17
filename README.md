# Quantiq

![Quantiq Logo](src/assets/logo.svg)

Quantiq, modern ve yenilikçi dijital çözümler sunarak işletmenizi geleceğe taşıyan kapsamlı bir e-ticaret platformudur. Kullanıcı dostu arayüzü, güçlü özellikleri ve güvenilir altyapısıyla işletmenizin dijital dönüşümünü hızlandırır.

## Özellikler

- **Responsive Tasarım**: Tüm cihazlarda mükemmel görünümler.
- **Kullanıcı Paneli**: Kolay yönetim ve izleme araçları.
- **E-Ticaret Entegrasyonu**: Güçlü satış ve envanter yönetimi.
- **Güvenli Alan**: Veri koruma ve güvenlik önlemleri.
- **Çoklu Tema Desteği**: Dark ve Light mod seçenekleri.
- **Uzantılar ve Entegrasyonlar**: API dokümantasyonu ile kolay entegrasyon.

## Teknolojiler

### Frontend
- **React**: Kullanıcı arayüzü oluşturma.
- **TypeScript**: Güçlü tipi sağlamak için.
- **CSS Modules**: Bileşen tabanlı stil yönetimi.
- **Framer Motion**: Gelişmiş animasyonlar için.
- **React Router**: Sayfa navigasyonu için.

### Backend
- **ASP.NET Core**: Güçlü ve ölçeklenebilir sunucu tarafı.
- **Entity Framework Core**: Veritabanı yönetimi.
- **PostgreSQL**: Güçlü ve esnek veritabanı çözümü.
- **Swagger**: API dokümantasyonu ve test araçları.
- **Authentication & Authorization**: Güvenli kullanıcı yönetimi.

## Kurulum

Quantiq projesini yerel makinenizde çalıştırmak için aşağıdaki adımları izleyebilirsiniz.

### Gereksinimler

- **Node.js**: [İndir](https://nodejs.org/)
- **.NET 6 SDK**: [İndir](https://dotnet.microsoft.com/download/dotnet/6.0)
- **PostgreSQL**: [İndir](https://www.postgresql.org/download/)
- **Git**: [İndir](https://git-scm.com/)

### Projeyi Klonlama

git clone https://github.com/kullaniciAdi/quantiq.git


### Backend Kurulumu

1. **Veritabanı Ayarlarını Yapılandırma**

   `appsettings.json` dosyasını açın ve PostgreSQL bağlantı dizesini yapılandırın.

   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Host=localhost;Database=quantiq_db;Username=postgres;Password=yourpassword"
     }
   }
   ```

2. **Veritabanını Migrasyonları Uygulama**

   ```bash
   cd Server
   dotnet ef database update
   ```

3. **Backend Sunucusunu Başlatma**

   ```bash
   dotnet run
   ```

### Frontend Kurulumu

1. **Gerekli Paketleri Yükleme**

   ```bash
   cd ../client
   npm install
   ```

2. **Frontend Uygulamasını Başlatma**

   ```bash
   npm start
   ```

## Kullanım

- **Ana Sayfa**: Uygulamanın ana arayüzünü görüntüler.
- **Kayıt Ol/Giriş Yap**: Kullanıcı hesap oluşturma ve oturum açma.
- **Komisyon Hesaplayıcı**: Satış komisyonlarını hesaplama.
- **Hava Durumu Tahmini**: Basit bir hava durumu tahmin servisi.

## Katkıda Bulunanlar

Quantiq projesine katkıda bulunmak için lütfen aşağıdaki adımları izleyin:

1. **Fork Yapın**
2. **Branch Oluşturun** (`git checkout -b feature/ÖzellikAdi`)
3. **Değişiklikleri Yapın**
4. **Commit Atın** (`git commit -m 'Add some feature'`)
5. **Push Yapın** (`git push origin feature/ÖzellikAdi`)
6. **Pull Request Oluşturun**

## Lisans

Bu proje MIT Lisansı ile lisanslanmıştır. Daha fazla bilgi için [LICENSE](LICENSE) dosyasına bakınız.

## İletişim

- **E-posta**: [info@quantiq.com](mailto:info@quantiq.com)
- **Telefon**: +90 (555) 123 4567
- **Adres**: İstanbul, Türkiye
- **GitHub**: [github.com/mustyilmaz/quantiq](https://github.com/mustyilmaz/quantiq)

## Bağlantılar

- [Proje GitHub Sayfası](https://github.com/mustyilmaz/quantiq)
- [API Dokümantasyonu](http://localhost:5146/swagger/index.html)
- [Demo](https://quantiq.com/demo)

---

Quantiq ile dijital dönüşümünüzü başlatın!
