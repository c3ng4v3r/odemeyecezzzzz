# Özellikler ve Çalışma Prensibi 🚀

## Ana Özellikler

### 1. Otomatik Sepet Tarama
- ✅ Sepetinizdeki tüm ürünleri otomatik algılar
- ✅ Ürün adı, adet ve fiyat bilgilerini çıkarır
- ✅ Mevcut market bilgisini kaydeder

### 2. Akıllı Ürün Arama
- ✅ Her ürün için tüm marketlerde arama yapar
- ✅ Tam eşleşme kontrolü (ürün adı)
- ✅ Gramaj ve boyut kontrolü
- ✅ Paralel arama desteği

### 3. Fiyat Karşılaştırması
- ✅ Tüm marketlerdeki fiyatları karşılaştırır
- ✅ En ucuz marketi otomatik bulur
- ✅ Sadece tüm ürünleri olan marketleri listeler
- ✅ Tasarruf miktarını hesaplar

### 4. Otomatik Sepet Değişimi
- ✅ Mevcut sepeti güvenli şekilde boşaltır
- ✅ En ucuz marketin ürünlerini ekler
- ✅ Doğru adet ve ürün bilgilerini kullanır
- ✅ API rate limit kontrolü

### 5. Kullanıcı Dostu Arayüz
- ✅ Modern ve şık overlay tasarımı
- ✅ Gerçek zamanlı durum güncellemeleri
- ✅ Market logoları ve bilgileri
- ✅ Görsel fiyat karşılaştırması
- ✅ Tasarruf oranı gösterimi

## Çalışma Mantığı

### 1. Veri Toplama Aşaması

```
Kullanıcı → Eklenti Butonu → Content Script
                                     ↓
                            getCurrentBasket()
                                     ↓
                        Next.js Data API çağrısı
                                     ↓
                      Sepet verilerini JSON parse
                                     ↓
                    AccessToken ve Basket bilgisi
```

### 2. Arama Aşaması

```
Her ürün için:
    ↓
searchInAllMarkets()
    ↓
Getir Locals Search API
    ↓
Tüm marketlerde sonuçlar
    ↓
Tam eşleşenleri filtrele
    ↓
Market bazında grupla
```

### 3. Karşılaştırma Aşaması

```
Her market için:
    ↓
Tüm ürünler var mı kontrol
    ↓
Toplam fiyat hesapla
    ↓
Marketleri fiyata göre sırala
    ↓
En ucuz marketi seç
```

### 4. Sepet Güncelleme Aşaması

```
Mevcut sepetteki her ürün için:
    ↓
API'ye count: 0 isteği gönder
    ↓
Ürünü sepetten kaldır
    ↓
Kısa bekleme (rate limit)
    ↓
---
Yeni marketteki her ürün için:
    ↓
API'ye count: X isteği gönder
    ↓
Ürünü sepete ekle
    ↓
Kısa bekleme (rate limit)
```

## API Kullanımı

### 1. Sepet Görüntüleme API

**Endpoint:**
```
GET /_next/data/{buildId}/tr/carsiPage/basket.json
```

**Amaç:** AccessToken ve sepet bilgilerini almak

**Kullanım:**
```javascript
fetch('https://getir.com/_next/data/...', {
  credentials: 'include' // Cookie'leri gönder
})
```

**Response:**
```json
{
  "pageProps": {
    "initialState": {
      "account": {
        "siteConfig": {
          "accessToken": "eyJhbG...",
          "selectedAddressId": "675bc...",
          "location": {
            "lat": 38.409,
            "lon": 27.121
          }
        }
      },
      "localsBasket": {
        "product": {
          "products": [...],
          "shop": { "id": "..." },
          "totalPrice": 7500,
          "totalPriceText": "₺75,00"
        }
      }
    }
  }
}
```

### 2. Ürün Arama API

**Endpoint:**
```
POST https://locals-web-api-gateway.artisan.getirapi.com/v2/search
```

**Headers:**
```
X_access_token: {accessToken}
X_refresh_token: {refreshToken}
Language: tr
Content-Type: application/json
```

**Body:**
```json
{
  "enableBestPriceSorting": false,
  "listingSize": 100,
  "shopSize": 100,
  "searchText": "patates",
  "location": {
    "lat": 38.409,
    "lon": 27.121
  }
}
```

**Response:**
```json
{
  "data": {
    "shops": [
      {
        "id": "61bc7e04...",
        "name": "Market Adı",
        "imageURL": "https://...",
        "products": [
          {
            "id": "28a85228...",
            "name": "Patates (1 kg)",
            "price": 2500
          }
        ]
      }
    ]
  }
}
```

### 3. Sepet İşlemleri API

**Endpoint:**
```
POST https://locals-web-api-gateway.artisan.getirapi.com/current-artisan-order/change/product
```

**Headers:**
```
X_access_token: {accessToken}
X_refresh_token: {refreshToken}
Language: tr
Content-Type: application/json
```

**Ürün Ekleme:**
```json
{
  "addressId": "675bc864...",
  "productId": "28a85228...",
  "shopId": "61bc7e04...",
  "analyticsLocation": "extension",
  "count": 2,
  "artisanOrderProductId": "28a85228..."
}
```

**Ürün Silme:**
```json
{
  "productId": "28a85228...",
  "shopId": "61bc7e04...",
  "analyticsLocation": "basket_page",
  "count": 0,
  "artisanOrderProductId": "28a85228..."
}
```

## Güvenlik Önlemleri

### 1. Token Yönetimi
- AccessToken sadece gerekli API'larda kullanılır
- Token'lar yerel değişkenlerde saklanır
- Her işlem sonrası temizlenir

### 2. API Rate Limiting
- İstekler arasında 300-500ms bekleme
- Toplu işlemlerde sıralı çalıştırma
- Hata durumunda yeniden deneme yok

### 3. CORS Güvenliği
- Sadece izin verilen domain'lere istek
- Manifest.json'da tanımlı host_permissions
- Content Security Policy uyumlu

### 4. Veri Gizliliği
- Hiçbir veri dış servise gönderilmez
- Tüm işlemler tarayıcıda yerel
- Kullanıcı bilgileri saklanmaz

## Sınırlamalar

### 1. Teknik Sınırlamalar
- ⚠️ Maksimum 100 market taraması
- ⚠️ Her aramada 100 ürün limiti
- ⚠️ API rate limit: ~10 istek/saniye
- ⚠️ İşlem süresi: ~30-60 saniye (5-10 ürün için)

### 2. Fonksiyonel Sınırlamalar
- ⚠️ Sadece tam eşleşen ürünler bulunur
- ⚠️ Gramaj farklılıkları eşleşmeyebilir
- ⚠️ Marka farklılıkları algılanmaz
- ⚠️ Kampanyalar dahil edilmez

### 3. Kullanıcı Deneyimi
- ⚠️ Sepet değişimi sırasında sayfa yenilenir
- ⚠️ İşlem sırasında başka işlem yapılamaz
- ⚠️ Çok ürün varsa süre uzayabilir

## Performans Optimizasyonları

### 1. Asenkron İşlemler
```javascript
// Tüm aramalar sıralı ama optimize edilmiş
for (const product of products) {
  await searchProduct(product);
  await delay(300); // Rate limit için
}
```

### 2. Veri Önbellekleme
```javascript
// Sepet verisi bir kez alınır
const basket = await getCurrentBasket();
// Sonraki işlemlerde cache kullanılır
```

### 3. DOM Manipülasyonu
```javascript
// Tek overlay, dinamik içerik
const overlay = createOverlay(); // Bir kez
updateStatus('Yeni durum'); // Sadece içerik güncellenir
```

## Gelecek Geliştirmeler

### Planlanıyor
- [ ] Fuzzy search (benzer ürünleri bulma)
- [ ] Gramaj dönüşümleri (1kg vs 1000g)
- [ ] Marka alternatifleri
- [ ] Kampanya desteği
- [ ] Sepet geçmişi
- [ ] Favori marketler
- [ ] Fiyat takibi ve alarm

### Düşünülüyor
- [ ] Çoklu sepet karşılaştırması
- [ ] Tahmini teslimat süreleri
- [ ] Minimum sepet tutarı kontrolü
- [ ] Teslimat ücreti hesaplama
- [ ] PDF/Excel rapor çıktısı

## Katkıda Bulunma

Yeni özellik önerileri için GitHub Issues kullanabilirsiniz!

