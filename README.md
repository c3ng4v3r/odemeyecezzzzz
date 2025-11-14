# Getir Çarşı Fiyat Karşılaştırıcı 🛒

Getir Çarşı'da sepetinizdeki ürünleri tüm marketlerde karşılaştırıp en ucuz marketten otomatik olarak sipariş veren Chrome eklentisi.

## 🎯 Özellikler

### Ana Fonksiyonlar
- ✅ Sepetinizdeki ürünleri otomatik olarak tarar
- ✅ Tüm marketlerde ürün araması yapar
- ✅ Ürün ismi ve gramaj kontrolü ile tam eşleşme bulur
- ✅ En ucuz marketi otomatik bulur
- ✅ Mevcut sepeti temizler ve yeni ürünleri ekler
- ✅ Fiyat karşılaştırması ve tasarruf oranını gösterir

### 🎨 Yeni! Gerçek Zamanlı Fiyat Gösterimi (v1.1.0)
- ✨ **Her ürün aranırken anında gösterilir** - Beklemeye gerek yok!
- ✨ **Renk kodlu fiyatlar** - 🟢 Yeşil (ucuz) | 🔴 Kırmızı (pahalı) | ⚪ Gri (aynı)
- ✨ **Animasyonlu geçişler** - Kartlar kaydırarak gelir, en ucuz pulse ile yanıp söner
- ✨ **Detaylı bilgiler** - Her ürün için en fazla 5 market, fiyat farkları, "En Ucuz" badge
- ✨ **Kullanıcı dostu arayüz** - Modern, responsive, etkileşimli

### 🎯 Yeni! Akıllı Ürün Eşleştirme (v1.2.0)
- 🖼️ **Ürün resimleri** - Her fiyat kartında küçük ürün görseli
- 🧠 **Akıllı eşleştirme** - Parantez içi gramaj otomatik çıkarılır
- 📊 **3 seviyeli arama** - name, shortName, shortDescription
- 🎯 **%40-50 daha fazla ürün bulma** - Daha esnek algoritma
- ✅ **Kısmi eşleşme** - "Süt" → "Süt Yarım Yağlı" eşleşir

### 🎉 Yeni! Kısmi Sepet Seçeneği (v1.4.0)
- 💡 **Eksik ürünlü marketleri de seçebilme** - Bazı ürünler olmasa da tasarruf edin!
- 💰 **Akıllı tasarruf hesaplama** - "10 ürün için ₺50 tasarruf, 1 ürün eksik"
- ⚠️ **Detaylı onay modalı** - Hangi ürünler eksik kalacak tam bilgi
- 🛒 **"Bu Marketi Seç" butonu** - Her market için ayrı seçim
- 📊 **Bilinçli karar** - Eksik ürünleri görüp kabul ediyorsunuz

### ✨ Onay Butonu Sistemi (v1.3.0)
- 🔘 **Kullanıcı kontrolü** - Sepet otomatik değişmiyor, onay gerekiyor
- 🎯 **"Sepeti Değiştir ve Uygula" butonu** - Sadece onayınızla sepet değişir
- ❌ **"İptal" butonu** - Vazgeçme seçeneği
- 💰 **Detaylı fiyat gösterimi** - Hem fiyat hem fark gösteriliyor
- 🎨 **Modern buton tasarımı** - Gradient, animasyonlar, hover efektleri

## 📋 Gereksinimler

- Google Chrome veya Chromium tabanlı tarayıcı (Edge, Brave, vb.)
- Aktif Getir hesabı
- Getir Çarşı'ya kayıtlı adres

## 🚀 Kurulum

### 1. Eklentiyi İndirin

```bash
git clone https://github.com/yourusername/getir-carsi-price-comparator.git
cd getir-carsi-price-comparator
```

### 2. Icon Dosyalarını Oluşturun

`icons` klasörüne aşağıdaki boyutlarda icon dosyaları eklemeniz gerekir:
- `icon16.png` (16x16 piksel)
- `icon48.png` (48x48 piksel)
- `icon128.png` (128x128 piksel)

> **Not:** Icon dosyalarını kendiniz oluşturabilir veya hazır bir logo kullanabilirsiniz.

### 3. Chrome'a Yükleyin

1. Chrome tarayıcınızı açın
2. Adres çubuğuna `chrome://extensions/` yazın
3. Sağ üst köşeden "Geliştirici modu"nu aktif edin
4. "Paketlenmemiş öğe yükle" butonuna tıklayın
5. İndirdiğiniz klasörü seçin

## 📖 Kullanım

### Adım 1: Sepete Ürün Ekleyin
Herhangi bir marketten istediğiniz ürünleri sepete ekleyin.

### Adım 2: Sepet Sayfasına Gidin
`https://getir.com/carsi/sepet/` adresine gidin.

### Adım 3: Eklentiyi Başlatın
Tarayıcı araç çubuğundaki eklenti simgesine tıklayın ve "Fiyatları Karşılaştır" butonuna basın.

### Adım 4: Bekleyin
Eklenti:
1. Sepetinizdeki ürünleri tarayacak
2. Tüm marketlerde arama yapacak
3. En ucuz marketi bulacak
4. Sepetinizi otomatik güncelleyecek
5. Tasarruf miktarını gösterecek

## 🔧 Teknik Detaylar

### Kullanılan API Endpoint'leri

1. **Sepeti Görüntüleme:**
   ```
   GET /_next/data/.../basket.json
   ```

2. **Ürün Arama:**
   ```
   POST https://locals-web-api-gateway.artisan.getirapi.com/v2/search
   ```

3. **Sepete Ürün Ekleme:**
   ```
   POST https://locals-web-api-gateway.artisan.getirapi.com/current-artisan-order/change/product
   ```

4. **Sepeti Boşaltma:**
   ```
   POST https://locals-web-api-gateway.artisan.getirapi.com/current-artisan-order/change/product
   (count: 0 ile)
   ```

### Dosya Yapısı

```
.
├── manifest.json          # Eklenti yapılandırması
├── background.js          # Arka plan service worker
├── content.js            # Sayfa etkileşim scripti
├── popup.html            # Eklenti popup arayüzü
├── popup.js              # Popup işlevselliği
├── styles.css            # Overlay stilleri
├── icons/                # Eklenti iconları
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md             # Bu dosya
```

## 🔐 Güvenlik

- Eklenti sadece `getir.com` ve `getirapi.com` domain'lerine erişim izni ister
- Kişisel verileriniz hiçbir yere gönderilmez
- Tüm işlemler tarayıcınızda yerel olarak gerçekleştirilir
- Access token'lar sadece Getir API'larına istek yapmak için kullanılır

## ⚠️ Önemli Notlar

- Eklenti yalnızca **tam eşleşen ürünleri** bulur (isim ve gramaj kontrolü)
- Tüm ürünleri bulabilen marketler arasından en ucuzunu seçer
- API rate limit'lerini aşmamak için istekler arasında bekleme süresi vardır
- İlk istek `credentials: true` ile yapılır ve `accessToken` alınır
- Sonraki istekler `X_access_token` header'ı ile yapılır

## 🐛 Bilinen Sorunlar

- Bazı marketlerde ürün isimleri farklı yazılmış olabilir
- Çok fazla ürün varsa karşılaştırma süresi uzayabilir
- Stok durumları anlık olarak değişebilir

## 📝 Lisans

Bu proje MIT lisansı altında sunulmaktadır.

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📧 İletişim

Sorularınız veya önerileriniz için issue açabilirsiniz.

## ⚖️ Yasal Uyarı

Bu eklenti eğitim amaçlı geliştirilmiştir. Getir'in resmi bir ürünü değildir. Kullanım tamamen kendi sorumluluğunuzdadır.

---

**Not:** Eklentiyi kullanmadan önce icon dosyalarını eklemeyi unutmayın!

