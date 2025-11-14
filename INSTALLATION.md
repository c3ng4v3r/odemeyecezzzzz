# Kurulum Rehberi 📦

## Hızlı Başlangıç

### 1. Dosyaları İndirin

Eklenti dosyalarını bilgisayarınıza indirin veya klonlayın.

### 2. Icon Dosyalarını Hazırlayın

Eklentinin çalışması için `icons` klasörüne aşağıdaki dosyaları eklemeniz gerekir:

- **icon16.png** - 16x16 piksel
- **icon48.png** - 48x48 piksel  
- **icon128.png** - 128x128 piksel

#### Icon Oluşturma Önerileri:

**Seçenek 1: Online Araçlar Kullanın**
- [Favicon.io](https://favicon.io/) - Ücretsiz icon oluşturucu
- [Canva](https://www.canva.com/) - Grafik tasarım aracı
- [IconGenerator](https://icon-generator.org/) - Chrome eklenti icon'ı oluşturucu

**Seçenek 2: Hazır Icon Kullanın**
- [Flaticon](https://www.flaticon.com/) - Ücretsiz icon'lar
- [Icons8](https://icons8.com/) - Icon kütüphanesi

**Seçenek 3: Basit Renkli Kare Kullanın**

PowerShell ile basit renkli icon'lar oluşturabilirsiniz:

```powershell
# 16x16 icon
$bmp16 = [System.Drawing.Bitmap]::new(16, 16)
$g16 = [System.Drawing.Graphics]::FromImage($bmp16)
$g16.Clear([System.Drawing.Color]::FromArgb(93, 62, 188))
$bmp16.Save("icons\icon16.png", [System.Drawing.Imaging.ImageFormat]::Png)
$g16.Dispose()
$bmp16.Dispose()

# 48x48 icon
$bmp48 = [System.Drawing.Bitmap]::new(48, 48)
$g48 = [System.Drawing.Graphics]::FromImage($bmp48)
$g48.Clear([System.Drawing.Color]::FromArgb(93, 62, 188))
$bmp48.Save("icons\icon48.png", [System.Drawing.Imaging.ImageFormat]::Png)
$g48.Dispose()
$bmp48.Dispose()

# 128x128 icon
$bmp128 = [System.Drawing.Bitmap]::new(128, 128)
$g128 = [System.Drawing.Graphics]::FromImage($bmp128)
$g128.Clear([System.Drawing.Color]::FromArgb(93, 62, 188))
$bmp128.Save("icons\icon128.png", [System.Drawing.Imaging.ImageFormat]::Png)
$g128.Dispose()
$bmp128.Dispose()

Write-Host "Icon'lar oluşturuldu!" -ForegroundColor Green
```

### 3. Chrome'a Yükleyin

#### Adım 1: Eklentiler Sayfasını Açın
Chrome tarayıcınızda adres çubuğuna şunu yazın:
```
chrome://extensions/
```

#### Adım 2: Geliştirici Modunu Aktif Edin
Sağ üst köşede bulunan "Geliştirici modu" anahtarını açın.

#### Adım 3: Eklentiyi Yükleyin
1. "Paketlenmemiş öğe yükle" butonuna tıklayın
2. İndirdiğiniz eklenti klasörünü seçin
3. "Klasörü seç" butonuna tıklayın

#### Adım 4: Eklentiyi Sabitleyin (Opsiyonel)
1. Chrome araç çubuğunda puzzle simgesine tıklayın
2. "Getir Çarşı Fiyat Karşılaştırıcı" yanındaki pin simgesine tıklayın
3. Eklenti simgesi araç çubuğunda görünecektir

## Kullanım

### İlk Kullanım

1. **Getir.com'a Giriş Yapın**
   - https://getir.com adresine gidin
   - Hesabınıza giriş yapın
   - Teslimat adresinizi seçin

2. **Sepete Ürün Ekleyin**
   - Herhangi bir Getir Çarşı marketinden ürün seçin
   - Sepetinize istediğiniz ürünleri ekleyin

3. **Sepet Sayfasına Gidin**
   - https://getir.com/carsi/sepet/ adresine gidin
   - Sepetinizdeki ürünleri kontrol edin

4. **Eklentiyi Çalıştırın**
   - Tarayıcı araç çubuğundaki eklenti simgesine tıklayın
   - "Fiyatları Karşılaştır" butonuna basın
   - İşlemin tamamlanmasını bekleyin

### Ne Olur?

Eklenti şunları yapar:

1. ✅ Sepetinizdeki ürünleri tarar
2. ✅ Her ürünü tüm marketlerde arar
3. ✅ Tam eşleşen ürünleri (isim + gramaj) bulur
4. ✅ Tüm ürünleri olan marketleri listeler
5. ✅ En ucuz marketi belirler
6. ✅ Mevcut sepetinizi temizler
7. ✅ Yeni marketin ürünlerini ekler
8. ✅ Tasarruf miktarını gösterir
9. ✅ Sayfayı yeniler

## Sorun Giderme

### "Eklenti yüklenemedi" Hatası

**Çözüm:** Icon dosyalarının doğru yerde olduğundan emin olun.

```
gecepazari/
├── icons/
│   ├── icon16.png  ✅
│   ├── icon48.png  ✅
│   └── icon128.png ✅
├── manifest.json
└── ...
```

### "Sepet sayfasında değilsiniz" Uyarısı

**Çözüm:** Tam olarak şu sayfada olmalısınız:
```
https://getir.com/carsi/sepet/
```

### "AccessToken alınamadı" Hatası

**Çözüm:** 
1. Getir.com'dan çıkış yapın
2. Tekrar giriş yapın
3. Sayfayı yenileyin
4. Eklentiyi tekrar deneyin

### "Ürün bulunamadı" Hatası

**Muhtemel Sebepler:**
- Ürün diğer marketlerde mevcut değil
- Ürün ismi farklı yazılmış
- Gramaj/boyut farklı

**Çözüm:**
- Farklı ürünler deneyin
- Daha yaygın ürünler seçin

### Eklenti Çalışmıyor

**Kontrol Listesi:**
1. ✅ Chrome'da "chrome://extensions/" sayfasında eklenti aktif mi?
2. ✅ Eklenti hataları var mı? (Detaylar butonuna tıklayın)
3. ✅ Doğru sayfada mısınız? (getir.com/carsi/sepet/)
4. ✅ Giriş yapmış mısınız?
5. ✅ Sepetinizde ürün var mı?

**Hata Ayıklama:**
1. Chrome DevTools'u açın (F12)
2. Console sekmesine gidin
3. Hataları kontrol edin
4. Gerekirse ekran görüntüsü alın

## Güncelleme

Eklentiyi güncellemek için:

1. Yeni dosyaları indirin
2. Eski dosyaların üzerine yazın
3. Chrome'da "chrome://extensions/" sayfasına gidin
4. Eklentinin yanındaki yenile simgesine tıklayın

## Kaldırma

Eklentiyi kaldırmak için:

1. "chrome://extensions/" sayfasına gidin
2. "Getir Çarşı Fiyat Karşılaştırıcı" bulun
3. "Kaldır" butonuna tıklayın
4. Onaylayın

## Destek

Sorun yaşıyorsanız:

1. Bu rehberi tekrar okuyun
2. [GitHub Issues](https://github.com/yourusername/getir-carsi-price-comparator/issues) sayfasından sorun bildirin
3. Hatanın ekran görüntüsünü ve hata mesajını ekleyin

## Güvenlik Notları

- ✅ Eklenti sadece Getir domain'lerine erişir
- ✅ Verileriniz hiçbir yere gönderilmez
- ✅ Tüm işlemler yerel olarak gerçekleşir
- ✅ Açık kaynak kodludur, inceleyebilirsiniz

## Ek Kaynaklar

- [Chrome Extension Geliştirici Dokümantasyonu](https://developer.chrome.com/docs/extensions/)
- [Manifest V3 Rehberi](https://developer.chrome.com/docs/extensions/mv3/intro/)

---

**Başarılar! 🎉**

Eklentiyi kullanarak Getir Çarşı alışverişlerinizde tasarruf edin!

