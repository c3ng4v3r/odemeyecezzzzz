# Test Rehberi 🧪

Bu rehber, eklentiyi test etmek için adım adım talimatlar içerir.

## Ön Hazırlık

### 1. Eklentiyi Yükleyin
```bash
1. Chrome'u açın
2. chrome://extensions/ adresine gidin
3. "Geliştirici modu"nu aktif edin
4. "Paketlenmemiş öğe yükle" → Klasörü seçin
5. Eklenti yüklendiğini doğrulayın
```

### 2. Getir Hesabınıza Giriş Yapın
```bash
1. https://getir.com adresine gidin
2. "Giriş Yap" butonuna tıklayın
3. Telefon numaranızı ve şifrenizi girin
4. Giriş yaptığınızı doğrulayın
```

### 3. Adres Seçin
```bash
1. Sağ üst köşeden adres seçin
2. Getir Çarşı'nın hizmet verdiği bir adres seçin
3. Adresi kaydedin
```

## Test Senaryoları

### Test 1: Basit Ürün Karşılaştırması

**Amaç:** Tek ürünle temel fonksiyonaliteyi test etmek

**Adımlar:**
1. Herhangi bir Getir Çarşı marketine gidin
2. Yaygın bir ürün ekleyin (örn: Süt, Ekmek)
3. https://getir.com/carsi/sepet/ adresine gidin
4. Eklenti simgesine tıklayın
5. "Fiyatları Karşılaştır" butonuna basın

**Beklenen Sonuç:**
- ✅ Overlay açılmalı
- ✅ "Sepet bilgileri alınıyor..." mesajı
- ✅ Ürün aranmalı
- ✅ Marketler listelenmeli
- ✅ En ucuz market gösterilmeli

**Başarı Kriterleri:**
- Hata mesajı yok
- En az 2 market bulundu
- Fiyat karşılaştırması görüntülendi

---

### Test 2: Çoklu Ürün Karşılaştırması

**Amaç:** Birden fazla ürünle test etmek

**Adımlar:**
1. Bir marketten 3-5 yaygın ürün ekleyin:
   - Süt
   - Ekmek
   - Yumurta
   - Su
   - Peynir
2. Sepete gidin
3. Eklentiyi çalıştırın

**Beklenen Sonuç:**
- ✅ Tüm ürünler aranmalı
- ✅ Sadece tüm ürünleri olan marketler listelenmeli
- ✅ Doğru fiyat hesaplaması

**Başarı Kriterleri:**
- Her ürün için arama yapıldı
- Toplam fiyat doğru
- Sepet güncellendi

---

### Test 3: Sepet Değişimi

**Amaç:** Sepet değiştirme işlevini test etmek

**Adımlar:**
1. X marketinden ürünler ekleyin
2. Karşılaştırma yapın
3. En ucuz market Y olsun (X'ten farklı)
4. İşlemin tamamlanmasını bekleyin

**Beklenen Sonuç:**
- ✅ X marketindeki ürünler silinmeli
- ✅ Y marketinden ürünler eklenmeli
- ✅ Sayfa yenilenmeli
- ✅ Yeni sepette doğru ürünler olmalı

**Başarı Kriterleri:**
- Eski sepet temizlendi
- Yeni sepet oluşturuldu
- Aynı ürünler ve adetler

---

### Test 4: Aynı Market Senaryosu

**Amaç:** Zaten en ucuz marketteysek ne olur?

**Adımlar:**
1. En ucuz marketten ürün ekleyin
2. Karşılaştırma yapın

**Beklenen Sonuç:**
- ✅ "Zaten en ucuz marketteki ürünleri sepetinizde!" mesajı
- ✅ Sepet değişmemeli
- ✅ Fiyat karşılaştırması gösterilmeli

---

### Test 5: Bulunamayan Ürün

**Amaç:** Bazı ürünler diğer marketlerde yoksa

**Adımlar:**
1. Bir markete özel ürün ekleyin
2. Yaygın bir ürün de ekleyin
3. Karşılaştırma yapın

**Beklenen Sonuç:**
- ✅ "Tüm ürünleri bulabilen market bulunamadı" mesajı
- ✅ Sepet değişmemeli

---

### Test 6: Boş Sepet

**Amaç:** Sepette ürün yoksa ne olur?

**Adımlar:**
1. Sepeti tamamen boşaltın
2. Eklentiyi çalıştırın

**Beklenen Sonuç:**
- ✅ "Sepetinizde ürün bulunmuyor!" mesajı
- ✅ İşlem durmalı

---

### Test 7: Ağ Hatası

**Amaç:** İnternet bağlantısı kesilirse

**Adımlar:**
1. Ürünleri sepete ekleyin
2. İnterneti kapatın
3. Eklentiyi çalıştırın

**Beklenen Sonuç:**
- ✅ Hata mesajı görüntülenmeli
- ✅ Overlay kapanabilmeli

---

### Test 8: Token Hatası

**Amaç:** AccessToken yoksa veya geçersizse

**Adımlar:**
1. Getir'den çıkış yapın
2. Sepet sayfasına gitmeye çalışın
3. Eklentiyi çalıştırın

**Beklenen Sonuç:**
- ✅ Giriş sayfasına yönlendirilmeli
- ✅ veya "Token alınamadı" hatası

---

## Manuel Kontroller

### 1. UI/UX Kontrolleri

**Overlay:**
- [ ] Overlay tam ekrana yayılıyor mu?
- [ ] Kapatma (X) butonu çalışıyor mu?
- [ ] Spinner animasyonu düzgün mü?
- [ ] Durum mesajları okunabilir mi?

**Market Kartları:**
- [ ] Logolar yükleniyor mu?
- [ ] İsimler tam görünüyor mu?
- [ ] Fiyatlar doğru formatlanmış mı?
- [ ] "En Ucuz" badge'i doğru yerde mi?

**Fiyat Karşılaştırması:**
- [ ] Eski fiyat üstü çizili mi?
- [ ] Yeni fiyat vurgulanmış mı?
- [ ] Tasarruf yeşil renkte mi?
- [ ] Yüzde hesaplaması doğru mu?

### 2. Performans Kontrolleri

**Süre:**
- [ ] 1 ürün: ~5 saniye
- [ ] 5 ürün: ~20 saniye
- [ ] 10 ürün: ~40 saniye

**Bellek:**
- [ ] Bellek sızıntısı yok
- [ ] Overlay kapanınca temizleniyor

**CPU:**
- [ ] Aşırı CPU kullanımı yok
- [ ] Browser donmuyor

### 3. Güvenlik Kontrolleri

**Network:**
- [ ] Sadece Getir domain'lerine istek
- [ ] Token güvenli şekilde gönderiliyor
- [ ] HTTPS kullanılıyor

**Console:**
- [ ] Hassas bilgi loglanmıyor
- [ ] Hata mesajları kullanıcı dostu

## Hata Ayıklama

### Chrome DevTools Kullanımı

1. **Console Açın:**
   ```
   F12 veya Sağ tık → İncele → Console
   ```

2. **Network Sekmesi:**
   ```
   Network → XHR → API isteklerini izleyin
   ```

3. **Eklenti Konsolu:**
   ```
   chrome://extensions/ → Eklenti → "Detaylar" → "service worker"
   ```

### Yaygın Hatalar ve Çözümleri

**"AccessToken alınamadı"**
- Çözüm: Tekrar giriş yapın, sayfa yenileyin

**"Sepet boş"**
- Çözüm: Önce ürün ekleyin

**"CORS hatası"**
- Çözüm: Manifest.json'da host_permissions kontrol edin

**"Rate limit aşıldı"**
- Çözüm: 1 dakika bekleyin, tekrar deneyin

**"Ürün bulunamadı"**
- Çözüm: Daha yaygın ürünler deneyin

## Otomatik Test (Gelecek)

```javascript
// test.js - Gelecekte eklenebilir
describe('Getir Çarşı Eklenti Testleri', () => {
  test('Sepet bilgisi alınıyor', async () => {
    const basket = await getCurrentBasket();
    expect(basket.products).toBeDefined();
  });
  
  test('Ürün aranıyor', async () => {
    const results = await searchInAllMarkets([...]);
    expect(results.length).toBeGreaterThan(0);
  });
  
  test('En ucuz market bulunuyor', () => {
    const best = findBestMarket(...);
    expect(best).toBeDefined();
  });
});
```

## Test Raporu Şablonu

```markdown
## Test Raporu - [Tarih]

### Test Edilen Sürüm
- Versiyon: 1.0.0
- Chrome Versiyonu: ...
- İşletim Sistemi: ...

### Test Sonuçları
| Test | Durum | Notlar |
|------|-------|--------|
| Test 1 | ✅ Pass | - |
| Test 2 | ✅ Pass | - |
| Test 3 | ❌ Fail | Hata: ... |
| Test 4 | ✅ Pass | - |
| Test 5 | ✅ Pass | - |
| Test 6 | ✅ Pass | - |
| Test 7 | ⚠️ Warning | Yavaş |
| Test 8 | ✅ Pass | - |

### Bulunan Hatalar
1. [Hata açıklaması]
2. [Hata açıklaması]

### Öneriler
1. [İyileştirme önerisi]
2. [İyileştirme önerisi]
```

## Topluluk Testleri

Topluluğun test etmesini istediğiniz senaryolar:

1. **Farklı Şehirler:** İzmir, Ankara, İstanbul
2. **Farklı Mahalleler:** Merkez, kenar mahalleler
3. **Farklı Saatler:** Sabah, öğle, akşam
4. **Farklı Ürünler:** Gıda, temizlik, kişisel bakım

## Geri Bildirim

Test sonuçlarınızı paylaşın:
- GitHub Issues
- Pull Request
- E-posta

---

**İyi Testler! 🧪**

