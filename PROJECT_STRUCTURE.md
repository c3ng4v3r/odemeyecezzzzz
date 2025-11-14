# Proje Yapısı 📁

Bu doküman, projenin dosya yapısını ve her dosyanın amacını açıklar.

## Dosya Ağacı

```
gecepazari/
├── 📁 icons/                      # Eklenti ikonları
│   ├── icon16.png                 # 16x16 piksel (toolbar)
│   ├── icon48.png                 # 48x48 piksel (extension management)
│   └── icon128.png                # 128x128 piksel (Chrome Web Store)
│
├── 📁 example_requests/           # Örnek API istekleri (referans)
│   ├── sepeti_goruntule_ve_accesstoken_al.requets
│   ├── urun_ara.requests
│   ├── sepete_urun_ekle.requests
│   └── sepeti_bosalt.reqeusts
│
├── 📄 manifest.json               # Chrome Extension yapılandırması
├── 📄 background.js               # Service Worker (arka plan)
├── 📄 content.js                  # Ana mantık (sayfa etkileşimi)
├── 📄 popup.html                  # Popup arayüzü (HTML)
├── 📄 popup.js                    # Popup mantığı (JavaScript)
├── 📄 styles.css                  # Overlay stilleri
│
├── 📄 README.md                   # Genel proje dokümantasyonu
├── 📄 QUICK_START.md              # Hızlı başlangıç rehberi
├── 📄 INSTALLATION.md             # Detaylı kurulum rehberi
├── 📄 FEATURES.md                 # Özellikler ve çalışma prensibi
├── 📄 TEST_GUIDE.md               # Test rehberi
├── 📄 CHANGELOG.md                # Değişiklik günlüğü
├── 📄 PROJECT_STRUCTURE.md        # Bu dosya
│
├── 📄 create_icons.ps1            # Icon oluşturma scripti
├── 📄 .gitignore                  # Git ignore dosyası
└── 📄 talimatlar.txt              # Orijinal talimatlar (Türkçe)
```

## Dosya Açıklamaları

### 🔧 Ana Eklenti Dosyaları

#### `manifest.json`
**Amaç:** Chrome Extension yapılandırması

**İçerik:**
- Manifest version 3
- Eklenti adı, versiyonu, açıklaması
- İzinler (permissions)
- Host izinleri (host_permissions)
- Content scripts
- Background service worker
- Action (popup) tanımlaması

**Önemli Ayarlar:**
```json
{
  "manifest_version": 3,
  "permissions": ["activeTab", "storage", "cookies"],
  "host_permissions": ["https://getir.com/*", "https://*.getirapi.com/*"]
}
```

---

#### `background.js`
**Amaç:** Service Worker - Arka plan işlemleri

**Görevler:**
- Cookie yönetimi
- Mesaj dinleme (content ↔ background)
- Eklenti lifecycle yönetimi

**Önemli Fonksiyonlar:**
- `getCookies()` - Getir.com cookie'lerini al

**Boyut:** ~650 bytes

---

#### `content.js`
**Amaç:** Ana mantık - Sayfa ile etkileşim

**Görevler:**
- Sepet verilerini çekme
- API istekleri yapma
- Ürün arama ve karşılaştırma
- Sepet güncelleme
- UI yönetimi

**Önemli Fonksiyonlar:**
- `getCurrentBasket()` - Sepet bilgilerini al
- `searchInAllMarkets()` - Tüm marketlerde ara
- `findBestMarket()` - En ucuz marketi bul
- `clearBasket()` - Sepeti boşalt
- `addProductsToBasket()` - Ürünleri ekle
- `startComparison()` - Ana işlem

**Boyut:** ~13 KB

**Satır Sayısı:** ~420 satır

---

#### `popup.html`
**Amaç:** Eklenti popup arayüzü

**İçerik:**
- Başlık ve açıklama
- "Fiyatları Karşılaştır" butonu
- Durum mesajı alanı
- Bilgilendirme kutuları
- Özellik listesi

**Boyut:** ~3.5 KB

---

#### `popup.js`
**Amaç:** Popup mantığı

**Görevler:**
- Aktif sekme kontrolü
- Karşılaştır butonunu yönetme
- Content script'e mesaj gönderme
- Durum mesajlarını gösterme

**Boyut:** ~1.5 KB

---

#### `styles.css`
**Amaç:** Overlay ve UI stilleri

**İçerik:**
- Overlay arka plan
- Market kartları
- Fiyat karşılaştırma bölümü
- Loading animasyonu
- Responsive tasarım

**Boyut:** ~5.4 KB

**Satır Sayısı:** ~200 satır

---

### 📁 Icons Klasörü

#### `icon16.png`
- Boyut: 16x16 piksel
- Kullanım: Browser toolbar
- Renk: Getir moru (#5d3ebc)

#### `icon48.png`
- Boyut: 48x48 piksel
- Kullanım: Extension management sayfası
- Renk: Getir moru (#5d3ebc)

#### `icon128.png`
- Boyut: 128x128 piksel
- Kullanım: Chrome Web Store
- Renk: Getir moru (#5d3ebc)

**Not:** Basit renkli kareler. İlerleyen versiyonlarda logo eklenebilir.

---

### 📚 Dokümantasyon Dosyaları

#### `README.md`
**Amaç:** Genel proje tanıtımı

**İçerik:**
- Proje açıklaması
- Özellikler
- Kurulum
- Kullanım
- Teknik detaylar
- Lisans

**Hedef Kitle:** Genel kullanıcılar, geliştiriciler

**Boyut:** ~4.8 KB

---

#### `QUICK_START.md`
**Amaç:** 5 dakikalık hızlı başlangıç

**İçerik:**
- Adım adım kurulum
- İlk kullanım
- İpuçları
- Sorun giderme

**Hedef Kitle:** Yeni kullanıcılar

**Boyut:** ~7.5 KB

---

#### `INSTALLATION.md`
**Amaç:** Detaylı kurulum rehberi

**İçerik:**
- Adım adım kurulum
- Icon oluşturma
- Sorun giderme
- Güvenlik notları

**Hedef Kitle:** Tüm kullanıcılar

**Boyut:** ~6.2 KB

---

#### `FEATURES.md`
**Amaç:** Özellikler ve teknik detaylar

**İçerik:**
- Ana özellikler
- Çalışma mantığı
- API kullanımı
- Güvenlik
- Sınırlamalar

**Hedef Kitle:** Geliştiriciler, meraklı kullanıcılar

**Boyut:** ~7.2 KB

---

#### `TEST_GUIDE.md`
**Amaç:** Test senaryoları ve rehberi

**İçerik:**
- Test senaryoları
- Manuel kontroller
- Hata ayıklama
- Test raporu şablonu

**Hedef Kitle:** Test edecek kullanıcılar, geliştiriciler

**Boyut:** ~7.5 KB

---

#### `CHANGELOG.md`
**Amaç:** Versiyon geçmişi

**İçerik:**
- Sürüm notları
- Değişiklikler
- Yeni özellikler

**Hedef Kitle:** Tüm kullanıcılar

**Boyut:** ~1.4 KB

---

#### `PROJECT_STRUCTURE.md`
**Amaç:** Proje yapısı dokümantasyonu (bu dosya)

**İçerik:**
- Dosya ağacı
- Dosya açıklamaları
- Teknik detaylar

**Hedef Kitle:** Geliştiriciler

---

### 🛠️ Yardımcı Dosyalar

#### `create_icons.ps1`
**Amaç:** Icon dosyalarını otomatik oluşturma

**Kullanım:**
```powershell
powershell -ExecutionPolicy Bypass -File create_icons.ps1
```

**Boyut:** ~1 KB

---

#### `.gitignore`
**Amaç:** Git için ignore kuralları

**İçerik:**
- Chrome extension özel dosyalar (*.pem, *.crx)
- IDE dosyaları
- Log dosyaları
- Example requests (API key içerebilir)

---

#### `talimatlar.txt`
**Amaç:** Orijinal proje talimatları (Türkçe)

**İçerik:**
- Proje amacı
- Çalışma şekli
- API kullanım notları

**Not:** Projenin başlangıç dokümanı

---

### 📁 Example Requests (Referans)

#### `sepeti_goruntule_ve_accesstoken_al.requets`
**Amaç:** Sepet görüntüleme API'si örneği

**İçerik:**
- HTTP request
- Headers
- Response örneği
- AccessToken alımı

---

#### `urun_ara.requests`
**Amaç:** Ürün arama API'si örneği

**İçerik:**
- HTTP request
- Headers (X_access_token)
- Request body
- Response örneği

---

#### `sepete_urun_ekle.requests`
**Amaç:** Sepete ürün ekleme API'si örneği

**İçerik:**
- HTTP request
- Headers
- Request body
- Response örneği

---

#### `sepeti_bosalt.reqeusts`
**Amaç:** Sepet boşaltma API'si örneği

**İçerik:**
- HTTP request
- Headers
- Request body (count: 0)
- Response örneği

---

## Dosya İlişkileri

```
manifest.json
    ↓
    ├─→ background.js (Service Worker)
    │   └─→ Cookie yönetimi
    │
    ├─→ content.js (Ana mantık)
    │   ├─→ API çağrıları
    │   ├─→ Sepet işlemleri
    │   └─→ UI (styles.css)
    │
    └─→ popup.html + popup.js
        └─→ Kullanıcı arayüzü
```

## Toplam İstatistikler

### Kod Dosyaları
- JavaScript: ~15.5 KB
- HTML: ~3.5 KB
- CSS: ~5.4 KB
- JSON: ~1 KB
- **Toplam:** ~25.4 KB

### Dokümantasyon
- Markdown: ~35 KB
- **7 adet** rehber dosyası

### Görsel
- PNG: ~768 bytes (3 icon)

### Genel Toplam
- **Proje Boyutu:** ~61 KB
- **Dosya Sayısı:** 20+
- **Kod Satırı:** ~800 satır

## Teknoloji Stack'i

### Frontend
- **HTML5** - Popup arayüzü
- **CSS3** - Stil ve animasyonlar
- **Vanilla JavaScript** - Ana mantık

### Browser API'ları
- **Chrome Extension API v3** - Manifest v3
- **Content Scripts API** - Sayfa etkileşimi
- **Service Worker API** - Arka plan
- **Storage API** - Veri saklama
- **Cookies API** - Cookie yönetimi

### External API'lar
- **Getir Next.js Data API** - Sepet bilgisi
- **Getir Locals Search API** - Ürün arama
- **Getir Artisan Order API** - Sepet işlemleri

### Araçlar
- **PowerShell** - Icon oluşturma
- **Git** - Versiyon kontrolü
- **Chrome DevTools** - Debug

## Lisans

MIT License - Detaylar için README.md'ye bakın.

## Son Güncelleme

2025-11-12 - v1.0.0

