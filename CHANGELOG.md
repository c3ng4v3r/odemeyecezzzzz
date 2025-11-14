# Değişiklik Günlüğü

Bu dosya projedeki tüm önemli değişiklikleri takip eder.

## [1.4.4] - 2025-11-12

### 🐛 UI Düzeltmeleri
- **Tasarruf Badge'i Sadeleştirildi:**
  - ❌ Arka plan rengi kaldırıldı (buton gibi duruyordu)
  - ✅ Sadece renkli metin: "💰 ₺152 tasarruf (15.2%)"
  - Yeşil metin (#4caf50), arka plan yok
  - Daha temiz, minimal görünüm
- **Loader Tamamen Kaldırıldı:**
  - ❌ Spinner kaldırıldı
  - ✅ Sadece ürün resmi, fade in/out animasyonuyla
  - 0.5s fade in (saydamlaşarak beliriyor)
  - 0.3s fade out (saydamlaşarak kayboluyor)
  - Dönen loader yok, sadece yumuşak geçişler
- **Alt Alta Düzen:**
  - ✅ Tüm Ürünleri Bulan Marketler (üstte)
  - ✅ Kısmi Sepet Seçenekleri (altta)
  - İki başlık alt alta, açık ayrım

## [1.4.3] - 2025-11-12

### ✨ Büyük UI/UX İyileştirmeleri
- **Tam Ürün Marketlerinde Tasarruf Gösterimi:**
  - ✅ "En Ucuz" yerine "💰 ₺152 tasarruf (15.2%)"
  - Her tam ürün marketi için tasarruf miktarı
  - Yeşil gradient badge
- **2 Başlık Sistemi:**
  - ✅ "Tüm Ürünleri Bulan Marketler" bölümü
  - 💡 "Kısmi Sepet Seçenekleri" bölümü
  - Her iki bölüm de tam genişlik kartlar
  - Daha düzenli, kategorize görünüm
- **Ürün Arama Animasyonları:**
  - 🖼️ Spinner yerine ürün resmi gösteriliyor
  - ✨ Fade in + Float animasyonu (süzülme)
  - 🎭 Fade out + Up animasyonu (kaybolma)
  - 0.5s yumuşak geçişler
- **Kart Tasarımı İyileştirmeleri:**
  - Tüm kartlar yatay düzen
  - Logo 56x56px
  - Tasarruf sağda, büyük badge
  - Tutarlı görünüm

## [1.4.2] - 2025-11-12

### 🔧 KRİTİK DÜZELTMELER
- **Tasarruf Hesaplama Hatası Düzeltildi:**
  - ❌ Önceki: Sepet toplamı karşılaştırıyordu (11 ürün vs 5 ürün)
  - ✅ Şimdi: Sadece ortak ürünler karşılaştırılıyor
  - Örnek: 5 ortak ürün için mevcut ₺450 → yeni ₺298 = ₺152 tasarruf
  - Artık gerçek tasarruf gösteriliyor!
- **Arayüz Tutarlılığı:**
  - ❌ Turuncu renk kaldırıldı
  - ✅ Mor renk (Getir rengi) kullanılıyor
  - Yatay tasarım (dikey değil)
  - Ana marketlerle uyumlu görünüm
- **Tasarım İyileştirmeleri:**
  - Gradient arka plan (mor-beyaz)
  - Mor kenarlık (#e0d4f7)
  - Badge'ler yatay
  - "Seç" butonu küçük ve sağda
  - Dropdown minimal

## [1.4.1] - 2025-11-12

### 🐛 Kısmi Sepet İyileştirmeleri
- **UI/UX İyileştirmeleri:**
  - Kompakt kart tasarımı (16px padding)
  - Daha küçük fontlar (14px başlık, 12px metin)
  - Modern badge'ler (✓ X ürün, ✕ Y eksik)
  - Hover animasyonları (card + button)
- **Hata Düzeltmeleri:**
  - ❌ 0 ürün bulan marketler artık gösterilmiyor
  - ✅ Sıralama düzeltildi: En çok ürün bulan → En az
  - 📊 İkincil sıralama: Aynı ürün sayısında en ucuz
- **Tasarım İyileştirmeleri:**
  - Daha az boşluk, daha kompakt görünüm
  - Badge'ler yan yana (yeşil + turuncu)
  - Dropdown daha küçük
  - Button daha küçük ama daha etkili

## [1.4.0] - 2025-11-12

### ✨ YENİ ÖZELLİK: Kısmi Sepet Seçeneği
- **💡 Bazı ürünler eksik olsa bile daha ucuz marketi seçebilme!**
  - Tüm ürünleri bulamayan marketler artık seçilebilir
  - Ortak ürünler için tasarruf hesaplama
  - "X ürün için ₺Y tasarruf, Z ürün eksik" bilgisi
  - Her market için "Bu Marketi Seç" butonu
- **⚠️ Detaylı Onay Modalı:**
  - Kaç ürün bulundu, kaç ürün eksik kalacak
  - Hangi ürünler eksik kalacak (liste)
  - Tasarruf miktarı ve yüzdesi
  - "Onayla ve Uygula" butonu
- **🎨 Modern Tasarım:**
  - Turuncu gradient kartlar
  - Tasarruf badge'i (yeşil)
  - Eksik ürünler dropdown
  - Hover animasyonları

## [1.3.7] - 2025-11-12

### 🐛 Debug Hataları Düzeltildi
- **Eksik Ürün Takibi Düzeltildi:**
  - ✅ Artık hangi ürünlerin bulunamadığı takip ediliyor
  - ✅ "Eksik: X ürün" doğru sayıyı gösteriyor
  - 🔍 "Eksik Ürünler" dropdown'ı ile detay
  - Her eksik ürün listelenmiş
  - Adet bilgisi de gösteriliyor
- **Debug Kartları Geliştirildi:**
  - Turuncu arka plan
  - "10/11 ürün bulundu" formatı
  - Dropdown ile eksik ürün listesi

## [1.3.6] - 2025-11-12

### 🔍 Debug Modu Eklendi - OVERLAY'DE GÖRÜNÜR (HATALI)
- **Overlay'de Debug Bilgileri:**
  - ✅ Tüm ürünleri bulan marketler (ana liste)
  - 🔍 Bazı ürünleri bulamayan marketler (debug liste)
  - ⚠️ Hata: "Eksik: 0 ürün" hep 0 gösteriyordu
  - ⚠️ Hata: Hangi ürünler eksik gösterilmiyordu

## [1.3.5] - 2025-11-12

### 🐛 Hata Düzeltmeleri - KRİTİK FİX
- **Parantez İçi Normalizasyon Eklendi:**
  - Sorun: "(500 g)" vs "(500g)" eşleşmiyordu (boşluk farkı) ❌
  - Sorun: "(1 L)" vs "(1 Lt)" eşleşmiyordu (kısaltma farkı) ❌
  - **Çözüm:** Parantez içi normalize ediliyor
    - Boşluklar kaldırılıyor: "500 g" → "500g"
    - Kısaltmalar standardize: "gr", "gram" → "g"
    - Litre standardize: "Lt", "litre" → "l"
  - Örnek: "(500 g)" === "(500g)" ✅
  - Örnek: "(1 L)" === "(1 Lt)" ✅
  - Örnek: "(500 gr)" === "(500 g)" ✅
  - **Sonuç:** Artık tüm marketler doğru eşleşiyor!

## [1.3.4] - 2025-11-12

### 🐛 Hata Düzeltmeleri - KRİTİK FİX (ÇOK KATI OLDU)
- **Parantez Kontrolü Tam Düzeltildi (ama katı):**
  - Önceki hata: Sadece birinde parantez olunca kontrol atlanıyordu ❌
  - **Yeni mantık:**
    1. Her ikisinde de parantez varsa → İçerik eşleşmeli
    2. **Birinde varsa diğerinde yoksa → Eşleşmemeli** (YENİ!)
    3. Her ikisinde de parantez yoksa → Normal karşılaştırma
  - Örnek: "Yağ (1 L)" vs "Yağ (4 L)" → ❌ Eşleşmez
  - Örnek: "Yağ (1 L)" vs "Yağ" → ❌ Eşleşmez (YENİ!)
  - Örnek: "Yağ (1 L)" vs "Yağ (1 L)" → ✅ Eşleşir
  - ⚠️ **Sorun:** Boşluk/kısaltma farkları eşleşmiyor

## [1.3.3] - 2025-11-12

### 🐛 Hata Düzeltmeleri - KRİTİK (EKSIK KALDI)
- **Parantez İçi Kontrolü Eklendi (yarım):**
  - Sorun: "Komili Yağ (1 L)" ararken "Komili Yağ (4 L)" de geliyordu ❌
  - **Çözüm:** Parantez içindeki gramaj/birim bilgisi kontrol ediliyor
  - Artık: "(1 L)" ≠ "(4 L)" → Eşleşme yok ✅
  - "İçim Süt (1 L)" sadece "(1 L)" olanlarla eşleşir
  - ⚠️ **Eksik:** Birinde parantez yoksa kontrolü atlıyordu

## [1.3.2] - 2025-11-12

### 🐛 Hata Düzeltmeleri - KRİTİK
- **Birim Karışıklığı Düzeltildi:**
  - Mevcut sepet: TL (54.50) ❌
  - Bulunan ürünler: Kuruş (5499) ❌
  - Karşılaştırma: 5499 - 54.50 = 5444.5 ❌
  - **Çözüm:** Mevcut sepetteki fiyatlar da kuruşa çevrildi (× 100)
  - Artık doğru: 5499 - 5450 = 49 kuruş = ₺0,49 ✅

### ✨ UI/UX İyileştirmeleri
- **Market adı + Ürün adı** gösterimi:
  - Önce: "Depom Marketçilik"
  - Şimdi: "Depom Marketçilik | İçim Şişe Ayran"
- **Geliştirilmiş fiyat badge'leri:**
  - Renkli arka plan (yeşil/kırmızı/gri)
  - Açıklama metni: "(daha ucuz)" / "(daha pahalı)" / "(aynı fiyat)"
  - Daha okunabilir font boyutları
  - Mobile responsive

## [1.3.1] - 2025-11-12

### 🐛 Hata Düzeltmeleri
- **KRİTİK:** Fiyat gösterimi düzeltildi
  - API'den gelen fiyatlar TL cinsinden (18.5 TL)
  - Sistemimiz kuruş kullanıyor (1850 kuruş)
  - TL → Kuruş dönüşümü eklendi (× 100)
  - Artık fiyatlar doğru görünüyor: ₺18,50 ✅

## [1.3.0] - 2025-11-12

### ✨ Yeni Özellikler
- **Onay Butonu Sistemi**
  - "Sepeti Değiştir ve Uygula" butonu eklendi
  - Artık sepet otomatik değişmiyor, kullanıcı onayı gerekiyor
  - "İptal" butonu ile vazgeçme seçeneği
  - Buton durumları: Aktif, Devre Dışı, Yükleniyor
- **Geliştirilmiş Fiyat Gösterimi**
  - Her ürün kartında hem fiyat hem fark gösteriliyor
  - Fiyat: ₺18,50
  - Fark: ↓ ₺2,50 (daha ucuz)
  - Alt alta düzenleme ile daha okunabilir

### 🎨 UI/UX İyileştirmeleri
- Action buttons bölümü eklendi
- Gradient buton tasarımı (Getir moru)
- Hover ve active efektleri
- Spinner animasyonu (buton yüklenirken)
- Mobile responsive butonlar

## [1.2.1] - 2025-11-12

### 🐛 Hata Düzeltmeleri
- **KRİTİK:** API yanıt yapısı düzeltildi
  - `shop.products` → `shop.searchedProducts` 
  - Artık ürünler gerçekten bulunuyor! 🎉
  - Fallback desteği: `searchedProducts || products`
- **Resim URL:** `squareThumbnailURL` fallback eklendi

## [1.2.0] - 2025-11-12

### Eklenenler
- 🖼️ **Ürün Resimleri Gösterimi**
  - Her fiyat kartında ürün resmi (40x40px)
  - Rounded corners ve border ile şık görünüm
  - Mobile'da 32x32px otomatik küçültme

### İyileştirmeler
- 🎯 **Akıllı Ürün Eşleştirme**
  - `normalizeProductName()` fonksiyonu eklendi
  - Parantez içindeki gramaj bilgisi otomatik çıkarılır
  - Lowercase karşılaştırma
  - Çoklu boşluklar temizlenir
- 🎯 **Esnek Eşleştirme Algoritması**
  - `isProductMatch()` fonksiyonu eklendi
  - 3 seviyeli eşleştirme:
    1. Tam isim eşleşmesi (normalize edilmiş)
    2. shortName ile eşleştirme
    3. shortDescription ile eşleştirme
  - Kısmi eşleşme desteği (5+ karakter için)
- 🎯 **Daha Fazla Ürün Bulma**
  - Önceden bulunamayan ürünler artık bulunuyor
  - "SuperFresh Patates (450g)" → "superfresh patates" eşleşmesi
  - Gramaj farklılıkları göz ardı ediliyor

## [1.1.0] - 2025-11-12

### Eklenenler
- 🎨 **Gerçek Zamanlı Ürün Fiyat Gösterimi**
  - Her ürün arandıkça anında kartlar gösterilir
  - Arama bitene kadar beklemeye gerek yok
- 🎨 **Renk Kodlu Fiyat Karşılaştırması**
  - Yeşil: Daha ucuz fiyatlar
  - Kırmızı: Daha pahalı fiyatlar
  - Gri: Aynı fiyat
- 🎨 **Animasyonlu Geçişler**
  - slideInUp animasyonu ile kartlar
  - pulse animasyonu ile en ucuz fiyat vurgusu
  - Hover efektleri
- 🎨 **Detaylı Fiyat Bilgileri**
  - Her ürün için en fazla 5 market
  - "En Ucuz" badge gösterimi
  - Fiyat farkı hesaplama (↓↑= ikonları)
  - "+X market daha" bilgisi
- 🎨 **Gelişmiş UI/UX**
  - Scrollable ürün listesi (max 400px)
  - Özel scrollbar (Getir moru)
  - Responsive tasarım iyileştirmeleri

### İyileştirmeler
- ⚡ displayProductComparison() fonksiyonu eklendi
- ⚡ searchInAllMarkets() gerçek zamanlı gösterim için güncellendi
- ⚡ CSS animasyonları eklendi (slideInUp, pulse)
- ⚡ Renk şeması ve gradient'ler

## [1.0.0] - 2025-11-12

### Eklenenler
- ✨ İlk sürüm yayınlandı
- ✨ Otomatik sepet tarama özelliği
- ✨ Tüm marketlerde ürün arama
- ✨ Fiyat karşılaştırma algoritması
- ✨ Otomatik sepet değiştirme
- ✨ Modern overlay UI tasarımı
- ✨ Gerçek zamanlı durum güncellemeleri
- ✨ Market logolu karşılaştırma ekranı
- ✨ Tasarruf hesaplayıcı
- ✨ Chrome Extension Manifest V3 desteği

### Teknik Detaylar
- Chrome Extension API v3
- Getir Locals API entegrasyonu
- AccessToken bazlı kimlik doğrulama
- Cookie yönetimi
- Content Script injection
- Background Service Worker
- Responsive CSS tasarımı

### Güvenlik
- CORS politikası uyumlu
- Token güvenliği
- API rate limiting
- Veri gizliliği koruması

### Dokümantasyon
- README.md
- INSTALLATION.md
- FEATURES.md
- CHANGELOG.md
- Kod içi yorumlar

## [Gelecek Sürümler]

### [1.1.0] - Planlanıyor
- Fuzzy search desteği
- Gramaj dönüşümleri
- Performans iyileştirmeleri

### [1.2.0] - Düşünülüyor
- Kampanya desteği
- Favori marketler
- Sepet geçmişi

---

Formatımız [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) standardına uyar,
ve bu proje [Semantic Versioning](https://semver.org/spec/v2.0.0.html) kullanır.

