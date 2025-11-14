// Getir Çarşı Fiyat Karşılaştırıcı - Content Script

let accessToken = null;
let refreshToken = null;
let addressId = null;
let currentBasket = [];
let currentShopId = null;

// UI Overlay oluştur
function createOverlay() {
  const overlay = document.createElement('div');
  overlay.id = 'getir-compare-overlay';
  overlay.innerHTML = `
    <div class="overlay-content">
      <div class="overlay-header">
        <h2>Fiyat Karşılaştırması</h2>
        <button class="close-btn" onclick="this.closest('#getir-compare-overlay').remove()">×</button>
      </div>
      <div class="overlay-body">
        <div class="loading-section">
          <p class="status-text">Marketler taranıyor...</p>
        </div>
        <div class="product-search-results">
          <h3>Ürün Fiyat Karşılaştırması</h3>
          <div class="products-grid"></div>
        </div>
        <div class="markets-list"></div>
        <div class="result-section" style="display:none;">
          <div class="price-comparison">
            <div class="old-price">
              <span class="label">Mevcut Sepet:</span>
              <span class="price"></span>
            </div>
            <div class="new-price">
              <span class="label">En Ucuz Sepet:</span>
              <span class="price"></span>
            </div>
            <div class="savings">
              <span class="label">Kazancınız:</span>
              <span class="amount"></span>
              <span class="percentage"></span>
            </div>
          </div>
          <div class="action-buttons">
            <button class="apply-btn" id="apply-changes-btn">
              <span class="btn-icon">✓</span>
              <span class="btn-text">Sepeti Değiştir ve Uygula</span>
            </button>
            <button class="cancel-btn" onclick="this.closest('#getir-compare-overlay').remove()">
              <span class="btn-icon">×</span>
              <span class="btn-text">İptal</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
  return overlay;
}

// Sepet verilerini al
async function getCurrentBasket() {
  try {
    // Sayfadan accessToken'ı al
    const cookies = await getCookies();
    accessToken = cookies.accessToken;
    refreshToken = cookies.refreshToken;
    
    // Next.js data endpoint'inden sepet bilgisini al
    const response = await fetch('https://getir.com/_next/data/ov_fCGrTtLfrc37z01dnE/tr/carsiPage/basket.json', {
      credentials: 'include',
      headers: {
        'Accept': '*/*',
        'Sec-Fetch-Site': 'same-origin',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Dest': 'empty'
      }
    });
    
    const data = await response.json();
    
    // AccessToken'ı response'dan al
    if (data.pageProps?.initialState?.account?.siteConfig?.accessToken) {
      accessToken = data.pageProps.initialState.account.siteConfig.accessToken;
    }
    
    if (data.pageProps?.initialState?.account?.siteConfig?.refreshToken) {
      refreshToken = data.pageProps.initialState.account.siteConfig.refreshToken;
    }
    
    if (data.pageProps?.initialState?.account?.siteConfig?.selectedAddressId) {
      addressId = data.pageProps.initialState.account.siteConfig.selectedAddressId;
    }
    
    // Sepet bilgisini al
    const basketData = data.pageProps?.initialState?.localsBasket?.product;
    
    if (!basketData || !basketData.products || basketData.products.length === 0) {
      throw new Error('Sepetinizde ürün bulunmuyor!');
    }
    
    console.log('🛒 Sepet verileri:', {
      totalPrice: basketData.totalPrice,
      totalPriceText: basketData.totalPriceText,
      shopId: basketData.shop?.id,
      shopName: basketData.shop?.name,
      productCount: basketData.products.length
    });
    
    currentBasket = basketData.products.map(p => ({
      name: p.name,
      count: p.count,
      price: Math.round(p.price * 100), // TL → Kuruş dönüşümü (54.50 → 5450)
      priceText: p.priceText,
      productId: p.product || p.id,
      masterProductId: p.masterProductId,
      imageURL: p.imageURL || p.squareThumbnailURL || null
    }));
    
    currentShopId = basketData.shop?.id;
    
    console.log('📦 currentShopId set to:', currentShopId);
    
    // Location bilgisini al
    const location = data.pageProps?.initialState?.account?.siteConfig?.location;
    
    return {
      products: currentBasket,
      shopId: currentShopId,
      totalPrice: basketData.totalPrice ? Math.round(basketData.totalPrice * 100) : null, // TL → Kuruş
      totalPriceText: basketData.totalPriceText,
      location: location ? { lat: location.lat, lon: location.lon } : null
    };
    
  } catch (error) {
    console.error('Sepet bilgisi alınamadı:', error);
    throw error;
  }
}

// Cookie'leri al
async function getCookies() {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ action: 'getCookies' }, (response) => {
      resolve(response);
    });
  });
}

// Parantez içindeki bilgiyi çıkar ve normalize et (gramaj, birim, vs.)
function extractParenthesesContent(name) {
  if (!name) return null;
  const match = name.match(/\(([^)]+)\)/);
  if (!match) return null;
  
  let content = match[1].toLowerCase().trim();
  
  // Normalize et: boşlukları kaldır, standart kısaltmalar
  content = content.replace(/\s+/g, ''); // Tüm boşlukları kaldır
  content = content.replace(/gr(am)?/g, 'g'); // "gram", "gr" → "g"
  content = content.replace(/lt|litre/g, 'l'); // "lt", "litre" → "l"
  content = content.replace(/ml|mililitre/g, 'ml'); // standardize
  content = content.replace(/kg|kilogram/g, 'kg'); // standardize
  
  return content;
}

// Ürün adını normalize et (gramaj ve parantez temizleme)
function normalizeProductName(name) {
  if (!name) return '';
  
  // Lowercase yap
  let normalized = name.toLowerCase().trim();
  
  // Parantez içindeki gramaj bilgisini çıkar: (450 g), (1 kg), (200 ml) vb.
  normalized = normalized.replace(/\s*\([^)]*\)\s*/g, ' ');
  
  // Çoklu boşlukları tek boşluğa çevir
  normalized = normalized.replace(/\s+/g, ' ').trim();
  
  return normalized;
}

// İki ürün adının eşleşip eşleşmediğini kontrol et (parantez içi kontrolü ile)
function isProductMatch(productName1, productName2) {
  // Parantez içeriğini çıkar (gramaj, birim kontrolü için)
  const paren1 = extractParenthesesContent(productName1);
  const paren2 = extractParenthesesContent(productName2);
  
  // KRİTİK: Parantez kontrolü
  // 1. Her ikisinde de parantez varsa → İçerik eşleşmeli
  // 2. Birinde varsa diğerinde yoksa → Eşleşmemeli
  // 3. Her ikisinde de parantez yoksa → Normal karşılaştırma
  
  if (paren1 || paren2) {
    // En az birinde parantez var
    if (paren1 !== paren2) {
      // Farklı veya biri null → Eşleşme yok
      // Örnek: "(1 L)" vs "(4 L)" → false
      // Örnek: "(1 L)" vs null → false
      return false;
    }
    // Her ikisi de aynı → Devam et
  }
  
  // İsim karşılaştırması (parantez olmadan)
  const name1 = normalizeProductName(productName1);
  const name2 = normalizeProductName(productName2);
  
  // Tam eşleşme
  if (name1 === name2) return true;
  
  // Biri diğerini içeriyor mu? (en az 5 karakter için)
  if (name1.length >= 5 && name2.length >= 5) {
    if (name1.includes(name2) || name2.includes(name1)) return true;
  }
  
  return false;
}

// Ürün kartı oluştur ve göster
function displayProductComparison(originalProduct, foundPrices) {
  const productsGrid = document.querySelector('#getir-compare-overlay .products-grid');
  
  // Ürün kartı oluştur
  const productCard = document.createElement('div');
  productCard.className = 'product-comparison-card animate-in';
  
  // En ucuz fiyatı bul
  const minPrice = foundPrices.length > 0 ? Math.min(...foundPrices.map(p => p.price)) : null;
  
  // Fiyat listesi HTML'i oluştur
  const pricesHTML = foundPrices.length > 0 
    ? foundPrices.slice(0, 5).map(priceInfo => {
        const priceDiff = priceInfo.price - originalProduct.price;
        const isCheaper = priceDiff < 0;
        const isSame = priceDiff === 0;
        const isBest = priceInfo.price === minPrice;
        
        let statusClass = isSame ? 'same' : (isCheaper ? 'cheaper' : 'expensive');
        let statusIcon = isSame ? '=' : (isCheaper ? '↓' : '↑');
        let statusText = isSame ? 'aynı fiyat' : (isCheaper ? 'daha ucuz' : 'daha pahalı');
        
        return `
          <div class="price-item ${statusClass} ${isBest ? 'best-price' : ''}">
            ${priceInfo.imageURL ? `<img src="${priceInfo.imageURL}" alt="${priceInfo.productName}" class="product-thumb">` : ''}
            <div class="market-info">
              <span class="market-name">${priceInfo.shopName} | ${priceInfo.productName}</span>
              ${isBest ? '<span class="best-badge">En Ucuz</span>' : ''}
            </div>
            <div class="price-info">
              <div class="price-details">
                <span class="price">${formatPrice(priceInfo.price)}</span>
                <span class="diff-badge ${statusClass}">${statusIcon} ${formatPrice(Math.abs(priceDiff))} <small>(${statusText})</small></span>
              </div>
            </div>
          </div>
        `;
      }).join('')
    : '<p class="no-results">Başka markette bulunamadı</p>';
  
  productCard.innerHTML = `
    <div class="product-header">
      <h4>${originalProduct.name}</h4>
      <span class="original-price">Mevcut: ${originalProduct.priceText || formatPrice(originalProduct.price)}</span>
    </div>
    <div class="prices-list">
      ${pricesHTML}
    </div>
    ${foundPrices.length > 5 ? `<p class="more-info">+${foundPrices.length - 5} market daha</p>` : ''}
  `;
  
  productsGrid.appendChild(productCard);
  
  // Auto-scroll: Yeni eklenen karta kaydır (smooth scroll)
  setTimeout(() => {
    const productsGrid = document.querySelector('#getir-compare-overlay .products-grid');
    if (productsGrid) {
      // Kartın pozisyonunu hesapla
      const cardTop = productCard.offsetTop;
      const cardHeight = productCard.offsetHeight;
      const gridHeight = productsGrid.clientHeight;
      const scrollTop = productsGrid.scrollTop;
      
      // Kart görünür alanın dışındaysa scroll yap
      if (cardTop < scrollTop || cardTop + cardHeight > scrollTop + gridHeight) {
        productsGrid.scrollTo({
          top: cardTop - 20, // 20px padding ekle
          behavior: 'smooth'
        });
      }
    } else {
      // Fallback: scrollIntoView kullan
      productCard.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center',
        inline: 'nearest'
      });
    }
  }, 150); // Animasyonun başlaması için kısa gecikme
}

// Tüm marketlerde ürün ara
async function searchInAllMarkets(products, location) {
  const results = [];
  
  for (const product of products) {
    updateStatus(`"${product.name}" aranıyor...`, product.imageURL || null);
    
    try {
      const response = await fetch('https://locals-web-api-gateway.artisan.getirapi.com/v2/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X_access_token': accessToken,
          'X_refresh_token': refreshToken,
          'Language': 'tr'
        },
        body: JSON.stringify({
          enableBestPriceSorting: false,
          listingSize: 100,
          shopSize: 100,
          searchText: product.name,
          location: location
        })
      });
      
      const data = await response.json();
      
      if (data.data && data.data.shops) {
        // Sonuçları kaydet
        results.push({
          searchProduct: product,
          foundInShops: data.data.shops
        });
        
        // Bulunan fiyatları topla
        const foundPrices = [];
        data.data.shops.forEach(shop => {
          // API yanıtında "searchedProducts" alanı kullanılıyor
          const products = shop.searchedProducts || shop.products || [];
          
          if (products.length > 0) {
            // Daha esnek eşleştirme ile ürün bul
            const matchingProduct = products.find(p => {
              // 1. Tam isim eşleşmesi (normalize edilmiş)
              if (isProductMatch(p.name, product.name)) return true;
              
              // 2. shortName ile eşleştir (varsa)
              if (p.shortName && isProductMatch(p.shortName, product.name)) return true;
              
              // 3. shortDescription ile eşleştir (varsa)
              if (p.shortDescription && isProductMatch(p.shortDescription, product.name)) return true;
              
              return false;
            });
            
            if (matchingProduct) {
              // API'den gelen price TL cinsinden (18.5), biz kuruş kullanıyoruz (1850)
              const priceInCents = Math.round(matchingProduct.price * 100);
              
              foundPrices.push({
                shopName: shop.name,
                shopId: shop.id,
                price: priceInCents, // Kuruş cinsinden
                productName: matchingProduct.name,
                imageURL: matchingProduct.imageURL || matchingProduct.squareThumbnailURL || null,
                product: matchingProduct
              });
            }
          }
        });
        
        // Gerçek zamanlı olarak ürün kartını göster
        displayProductComparison(product, foundPrices);
      }
      
      // API rate limit için kısa bekleme
      await new Promise(resolve => setTimeout(resolve, 300));
      
    } catch (error) {
      console.error(`"${product.name}" araması başarısız:`, error);
      // Hata durumunda da kartı göster
      displayProductComparison(product, []);
    }
  }
  
  return results;
}

// En uygun marketi bul
function findBestMarket(searchResults, originalProducts) {
  const marketBaskets = {};
  
  // Her market için sepet oluştur ve ürün arama sonuçlarını takip et
  searchResults.forEach(result => {
    const originalProduct = result.searchProduct;
    
    result.foundInShops.forEach(shop => {
      // Market sepetini oluştur (yoksa)
      if (!marketBaskets[shop.id]) {
        marketBaskets[shop.id] = {
          shopId: shop.id,
          shopName: shop.name,
          shopImage: shop.imageURL,
          products: [],
          totalPrice: 0,
          foundProductCount: 0,
          missingProducts: []
        };
      }
      
      // API yanıtında "searchedProducts" alanı kullanılıyor
      const products = shop.searchedProducts || shop.products || [];
      
      // Esnek eşleştirme ile ürün bul
      const matchingProduct = products.find(p => {
        // 1. Normalize edilmiş isim eşleşmesi
        if (isProductMatch(p.name, originalProduct.name)) return true;
        
        // 2. shortName ile eşleştir
        if (p.shortName && isProductMatch(p.shortName, originalProduct.name)) return true;
        
        // 3. shortDescription ile eşleştir
        if (p.shortDescription && isProductMatch(p.shortDescription, originalProduct.name)) return true;
        
        return false;
      });
      
      if (matchingProduct) {
        // Ürün bulundu - sepete ekle
        const priceInCents = Math.round(matchingProduct.price * 100);
        
        marketBaskets[shop.id].products.push({
          ...matchingProduct,
          price: priceInCents,
          requestedCount: originalProduct.count,
          totalProductPrice: priceInCents * originalProduct.count
        });
        
        marketBaskets[shop.id].totalPrice += priceInCents * originalProduct.count;
        marketBaskets[shop.id].foundProductCount++;
      } else {
        // Ürün bulunamadı - eksik listeye ekle
        marketBaskets[shop.id].missingProducts.push({
          name: originalProduct.name,
          count: originalProduct.count
        });
      }
    });
  });
  
  // Tüm market sepetlerini sakla (debug için)
  const allMarketBasketsArray = Object.values(marketBaskets);
  
  // Debug: Hangi marketler kaç ürün buldu?
  console.log('=== MARKET SEPET DETAYLARI ===');
  allMarketBasketsArray.forEach(market => {
    console.log(`${market.shopName}: ${market.foundProductCount}/${originalProducts.length} ürün bulundu`);
    console.log(`  Toplam: ${formatPrice(market.totalPrice)}`);
    if (market.foundProductCount < originalProducts.length) {
      console.log(`  ❌ Eksik ürün sayısı: ${originalProducts.length - market.foundProductCount}`);
    }
  });
  console.log('=============================');
  
  // Tüm ürünleri bulan marketleri filtrele
  const completeMarkets = allMarketBasketsArray.filter(
    market => market.foundProductCount === originalProducts.length
  );
  
  if (completeMarkets.length === 0) {
    console.warn('⚠️ Hiçbir market tüm ürünleri bulamadı!');
    console.log('En fazla ürün bulan marketler:');
    
    // En fazla ürün bulanları göster
    const sortedByCount = allMarketBasketsArray.sort((a, b) => b.foundProductCount - a.foundProductCount);
    sortedByCount.slice(0, 3).forEach(market => {
      console.log(`  ${market.shopName}: ${market.foundProductCount}/${originalProducts.length} ürün`);
    });
    
    return { completeMarkets: null, allMarkets: allMarketBasketsArray };
  }
  
  // En ucuz marketi bul
  completeMarkets.sort((a, b) => a.totalPrice - b.totalPrice);
  
  console.log(`✅ ${completeMarkets.length} market tüm ürünleri buldu!`);
  
  return { completeMarkets, allMarkets: allMarketBasketsArray };
}

// Sepeti boşalt
async function clearBasket() {
  updateStatus('Sepet boşaltılıyor...');
  
  console.log('🗑️ Sepet temizleniyor... Mevcut ürünler:', currentBasket.length);
  
  for (const product of currentBasket) {
    try {
      console.log(`➖ Siliniyor: ${product.name} (ID: ${product.productId})`);
      
      const response = await fetch('https://locals-web-api-gateway.artisan.getirapi.com/current-artisan-order/change/product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X_access_token': accessToken,
          'X_refresh_token': refreshToken,
          'Language': 'tr'
        },
        body: JSON.stringify({
          productId: product.productId,
          shopId: currentShopId,
          analyticsLocation: 'basket_page',
          count: 0,
          artisanOrderProductId: product.productId
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        console.log(`✅ Silindi: ${product.name}`);
      } else {
        console.error(`❌ Silinemedi: ${product.name}`, data);
      }
      
      await new Promise(resolve => setTimeout(resolve, 300)); // API rate limit için bekleme
      
    } catch (error) {
      console.error(`❌ Hata: ${product.name}`, error);
    }
  }
  
  console.log('✅ Sepet temizlendi');
}

// Yeni ürünleri sepete ekle
async function addProductsToBasket(market) {
  updateStatus(`${market.shopName} marketinden ürünler ekleniyor...`);
  
  console.log('🛒 Sepete eklenecek ürünler:', market.products);
  console.log('🏪 Market ID:', market.shopId);
  console.log('📍 Adres ID:', addressId);
  
  let successCount = 0;
  let failCount = 0;
  
  for (const product of market.products) {
    try {
      console.log(`➕ Ekleniyor: ${product.name} (ID: ${product.id}), Adet: ${product.requestedCount}`);
      
      const response = await fetch('https://locals-web-api-gateway.artisan.getirapi.com/current-artisan-order/change/product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X_access_token': accessToken,
          'X_refresh_token': refreshToken,
          'Language': 'tr'
        },
        body: JSON.stringify({
          addressId: addressId,
          productId: product.id,
          shopId: market.shopId,
          analyticsLocation: 'extension',
          count: product.requestedCount,
          artisanOrderProductId: product.id
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        console.log(`✅ Başarılı: ${product.name}`);
        successCount++;
      } else {
        console.error(`❌ Başarısız: ${product.name}`, data);
        failCount++;
      }
      
      await new Promise(resolve => setTimeout(resolve, 500)); // API rate limit için bekleme
      
    } catch (error) {
      console.error(`❌ Hata: ${product.name}`, error);
      failCount++;
    }
  }
  
  console.log(`📊 Sonuç: ${successCount} başarılı, ${failCount} başarısız`);
  
  if (failCount > 0) {
    throw new Error(`${failCount} ürün eklenemedi. Lütfen sayfayı yenileyip tekrar deneyin.`);
  }
}

// Durumu güncelle (ürün resmi ile - loader yok)
function updateStatus(text, productImageURL = null) {
  const statusElement = document.querySelector('#getir-compare-overlay .status-text');
  const loadingSection = document.querySelector('#getir-compare-overlay .loading-section');
  
  if (statusElement) {
    statusElement.textContent = text;
  }
  
  // Ürün resmi varsa göster (loader yok, sadece resim)
  if (productImageURL && loadingSection) {
    // Önceden oluşturulmuş resim container'ı kontrol et
    let imageContainer = loadingSection.querySelector('.product-image-container');
    
    if (!imageContainer) {
      // İlk kez oluştur
      imageContainer = document.createElement('div');
      imageContainer.className = 'product-image-container';
      imageContainer.style.cssText = `
        width: 120px;
        height: 120px;
        margin: 20px auto 16px;
        display: flex;
        align-items: center;
        justify-content: center;
      `;
      
      // Spinner'ı kaldır
      const spinner = loadingSection.querySelector('.spinner');
      if (spinner) {
        spinner.remove();
      }
      
      loadingSection.insertBefore(imageContainer, statusElement);
    }
    
    // Önceki resmi fade out yap
    const existingImage = imageContainer.querySelector('img');
    if (existingImage) {
      existingImage.style.animation = 'fadeOut 0.3s ease-out forwards';
      setTimeout(() => {
        existingImage.remove();
        
        // Yeni resim ekle
        const productImage = document.createElement('img');
        productImage.src = productImageURL;
        productImage.style.cssText = `
          width: 120px;
          height: 120px;
          object-fit: contain;
          border-radius: 12px;
          opacity: 0;
          animation: fadeIn 0.5s ease-in forwards;
        `;
        imageContainer.appendChild(productImage);
      }, 300);
    } else {
      // İlk resim
      const productImage = document.createElement('img');
      productImage.src = productImageURL;
      productImage.style.cssText = `
        width: 120px;
        height: 120px;
        object-fit: contain;
        border-radius: 12px;
        opacity: 0;
        animation: fadeIn 0.5s ease-in forwards;
      `;
      imageContainer.appendChild(productImage);
    }
  }
}

// Marketleri listele
function displayMarkets(markets, allMarketBaskets, currentPrice) {
  const marketsList = document.querySelector('#getir-compare-overlay .markets-list');
  marketsList.innerHTML = '';
  
  console.log('📋 displayMarkets çağrıldı:');
  console.log('  - currentPrice:', currentPrice, 'kuruş =', formatPrice(currentPrice));
  console.log('  - currentShopId:', currentShopId);
  console.log('  - markets sayısı:', markets?.length || 0);
  
  // BAŞLIK 1: Tüm Ürünleri Bulan Marketler
  if (markets && markets.length > 0) {
    const completeSection = document.createElement('div');
    completeSection.className = 'complete-markets-section';
    completeSection.innerHTML = `
      <h3 style="color: #5d3ebc; font-size: 16px; margin: 0 0 12px 0; font-weight: 600; display: flex; align-items: center; gap: 8px;">
        <span style="font-size: 20px;">✅</span>
        <span>Tüm Ürünleri Bulan Marketler</span>
      </h3>
    `;
    
    markets.forEach((market, index) => {
      // Mevcut sepetteki market mi kontrol et
      const isCurrentMarket = market.shopId === currentShopId;
      
      const savings = currentPrice - market.totalPrice;
      const savingsPercent = currentPrice > 0 ? ((savings / currentPrice) * 100).toFixed(1) : 0;
      
      console.log(`  ${index + 1}. ${market.shopName}:`, {
        shopId: market.shopId,
        isCurrentMarket,
        totalPrice: market.totalPrice + ' kuruş = ' + formatPrice(market.totalPrice),
        savings: savings + ' kuruş = ' + formatPrice(savings),
        currentPrice: currentPrice + ' kuruş'
      });
      
      // En ucuz market (ve mevcut market değilse)
      const isCheapest = index === 0 && !isCurrentMarket;
      
      const marketCard = document.createElement('div');
      marketCard.className = 'market-card';
      marketCard.style.cssText = `
        background: ${isCheapest ? 'linear-gradient(135deg, #f0fdf4 0%, #fff 100%)' : (isCurrentMarket ? 'linear-gradient(135deg, #e3f2fd 0%, #fff 100%)' : 'white')};
        border: 2px solid ${isCheapest ? '#4caf50' : (isCurrentMarket ? '#2196f3' : '#e0e0e0')};
        border-radius: 12px;
        padding: 16px;
        margin-bottom: 12px;
        display: flex;
        align-items: center;
        gap: 16px;
      `;
      
      marketCard.innerHTML = `
        <img src="${market.shopImage}" alt="${market.shopName}" style="width: 56px; height: 56px; border-radius: 10px; object-fit: cover; border: 2px solid ${isCheapest ? '#4caf50' : (isCurrentMarket ? '#2196f3' : '#e0e0e0')};">
        <div style="flex: 1;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
            <h3 style="margin: 0; font-size: 16px; color: #333; font-weight: 600;">${market.shopName}</h3>
            ${isCheapest ? '<span style="background: linear-gradient(135deg, #4caf50 0%, #45a049 100%); color: white; padding: 4px 12px; border-radius: 6px; font-size: 11px; font-weight: 700; box-shadow: 0 2px 6px rgba(76, 175, 80, 0.3);">⭐ EN UCUZ</span>' : ''}
            ${isCurrentMarket ? '<span style="background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%); color: white; padding: 4px 12px; border-radius: 6px; font-size: 11px; font-weight: 700; box-shadow: 0 2px 6px rgba(33, 150, 243, 0.3);">📍 MEVCUT SEPETİNİZ</span>' : ''}
          </div>
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <div style="display: flex; gap: 8px; align-items: center;">
              <span style="background: #5d3ebc; color: white; padding: 3px 10px; border-radius: 5px; font-size: 11px; font-weight: 600;">
                ${market.foundProductCount} ürün
              </span>
              <span style="font-size: 18px; font-weight: 700; color: #5d3ebc;">${formatPrice(market.totalPrice)}</span>
            </div>
            ${isCurrentMarket ? `
              <span style="color: #2196f3; font-size: 13px; font-weight: 600;">
                Mevcut sepetiniz
              </span>
            ` : savings > 0 ? `
              <span style="color: #4caf50; font-size: 14px; font-weight: 700;">
                💰 ${formatPrice(savings)} tasarruf (${savingsPercent}%)
              </span>
            ` : savings < 0 ? `
              <span style="color: #d32f2f; font-size: 13px; font-weight: 600;">
                ${formatPrice(Math.abs(savings))} daha pahalı
              </span>
            ` : `
              <span style="color: #666; font-size: 13px; font-weight: 600;">
                Aynı fiyat
              </span>
            `}
          </div>
        </div>
      `;
      
      completeSection.appendChild(marketCard);
    });
    
    marketsList.appendChild(completeSection);
  }
  
  // Kısmi sepet seçenekleri (bazı ürünler eksik ama yine de ucuz olabilir)
  if (allMarketBaskets && allMarketBaskets.length > 0) {
    // Tüm ürünleri bulamayan marketleri filtrele
    let incompleteMarkets = allMarketBaskets.filter(m => 
      !markets.find(cm => cm.shopId === m.shopId)
    );
    
    // 0 ürün bulan marketleri eleme
    incompleteMarkets = incompleteMarkets.filter(m => m.foundProductCount > 0);
    
    if (incompleteMarkets.length > 0) {
      // Mevcut sepet fiyatını al (window'dan geçeceğiz)
      const currentBasketPrice = window.getirCompareCurrentPrice || 0;
      
      const partialSection = document.createElement('div');
      partialSection.className = 'partial-basket-section';
      partialSection.innerHTML = `
        <div style="margin-top: 24px; padding-top: 20px; border-top: 2px solid #e8e8e8;">
          <h3 style="color: #5d3ebc; font-size: 16px; margin: 0 0 12px 0; font-weight: 600; display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 20px;">💡</span>
            <span>Kısmi Sepet Seçenekleri</span>
          </h3>
          <p style="color: #888; font-size: 12px; margin-bottom: 16px; line-height: 1.4;">
            Bu marketler bazı ürünleri bulamadı ama yine de tasarruf sağlayabilir.
          </p>
        </div>
      `;
      
      // Önce her market için tasarruf hesapla
      const currentBasket = window.getirCompareCurrentBasket || [];
      
      incompleteMarkets.forEach(market => {
        let currentPriceForFoundProducts = 0;
        
        market.products.forEach(foundProduct => {
          const originalProduct = currentBasket.find(p => 
            isProductMatch(p.name, foundProduct.name)
          );
          if (originalProduct) {
            currentPriceForFoundProducts += originalProduct.price * foundProduct.requestedCount;
          }
        });
        
        // Tasarrufu market objesine ekle
        market.savingsEstimate = currentPriceForFoundProducts > 0
          ? currentPriceForFoundProducts - market.totalPrice
          : 0;
        market.currentPriceForFoundProducts = currentPriceForFoundProducts;
      });
      
      // Kısmi sepetleri AKILLI sırala:
      // 1. Tasarruf sağlayanlar önce (savings > 0)
      // 2. En çok ürün bulanlar önce
      // 3. En çok tasarruf sağlayanlar önce
      incompleteMarkets.sort((a, b) => {
        // Önce tasarruf sağlayan/sağlamayana göre ayır
        const aSaves = a.savingsEstimate > 0;
        const bSaves = b.savingsEstimate > 0;
        
        if (aSaves !== bSaves) {
          return bSaves ? 1 : -1; // Tasarruf sağlayanlar önce
        }
        
        // İkisi de tasarruf sağlıyorsa veya ikisi de sağlamıyorsa
        // Önce ürün sayısına göre (çoktan aza)
        if (b.foundProductCount !== a.foundProductCount) {
          return b.foundProductCount - a.foundProductCount;
        }
        
        // Aynı ürün sayısında tasarruf miktarına göre (çoktan aza)
        return b.savingsEstimate - a.savingsEstimate;
      });
      
      incompleteMarkets.forEach(market => {
        const missingCount = market.missingProducts?.length || 0;
        const foundCount = market.foundProductCount;
        const savingsEstimate = market.savingsEstimate;
        
        const savingsPercent = market.currentPriceForFoundProducts > 0
          ? ((savingsEstimate / market.currentPriceForFoundProducts) * 100).toFixed(1)
          : 0;
        
        // Eksik ürünlerin listesi
        const missingProductsHTML = market.missingProducts && market.missingProducts.length > 0
          ? market.missingProducts.map(p => `<li style="font-size: 11px; color: #666; line-height: 1.6;">❌ ${p.name}${p.count > 1 ? ` (${p.count} adet)` : ''}</li>`).join('')
          : '<li style="font-size: 11px; color: #999;">Bilgi yok</li>';
        
        const partialCard = document.createElement('div');
        partialCard.className = 'market-card partial-card';
        partialCard.style.cssText = `
          border: 2px solid #e0d4f7;
          border-radius: 12px;
          background: linear-gradient(135deg, #f8f5ff 0%, #fff 100%);
          padding: 16px;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 16px;
          transition: all 0.3s ease;
        `;
        
        partialCard.innerHTML = `
          <img src="${market.shopImage}" alt="${market.shopName}" style="width: 56px; height: 56px; border-radius: 10px; object-fit: cover; border: 2px solid #e0d4f7;">
          <div style="flex: 1;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
              <h3 style="margin: 0; font-size: 16px; color: #333; font-weight: 600;">${market.shopName}</h3>
              ${savingsEstimate > 0 ? `
                <span style="color: #4caf50; font-size: 14px; font-weight: 700;">
                  💰 ${formatPrice(savingsEstimate)} tasarruf (${savingsPercent}%)
                </span>
              ` : savingsEstimate < 0 ? `
                <span style="color: #d32f2f; font-size: 13px; font-weight: 600;">
                  ${formatPrice(Math.abs(savingsEstimate))} daha pahalı
                </span>
              ` : `
                <span style="color: #666; font-size: 13px; font-weight: 600;">
                  Aynı fiyat
                </span>
              `}
            </div>
            <div style="display: flex; gap: 8px; align-items: center; justify-content: space-between;">
              <div style="display: flex; gap: 6px; align-items: center;">
                <span style="background: #5d3ebc; color: white; padding: 3px 10px; border-radius: 5px; font-size: 11px; font-weight: 600;">
                  ${foundCount} ürün bulundu
                </span>
                <span style="background: #e0d4f7; color: #5d3ebc; padding: 3px 10px; border-radius: 5px; font-size: 11px; font-weight: 600;">
                  ${missingCount} ürün eksik
                </span>
                <details style="display: inline-flex;">
                  <summary style="cursor: pointer; font-size: 11px; color: #5d3ebc; font-weight: 600; list-style: none; display: inline-flex; align-items: center; gap: 4px; padding: 3px 8px; background: white; border-radius: 5px; border: 1px solid #e0d4f7;">
                    <span style="font-size: 9px;">▶</span>
                    <span>Detay</span>
                  </summary>
                  <ul style="position: absolute; margin: 4px 0 0 0; padding: 8px 12px; font-size: 11px; color: #666; background: white; border-radius: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 10;">
                    ${missingProductsHTML}
                  </ul>
                </details>
              </div>
              <button 
                class="partial-basket-select-btn" 
                data-shop-id="${market.shopId}"
                data-shop-name="${market.shopName}"
                data-found-count="${foundCount}"
                data-missing-count="${missingCount}"
                data-savings="${savingsEstimate}"
                style="padding: 8px 20px; background: linear-gradient(135deg, #5d3ebc 0%, #7c52d1 100%); color: white; border: none; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s ease; box-shadow: 0 2px 6px rgba(93, 62, 188, 0.3);">
                Seç
              </button>
            </div>
          </div>
        `;
        
        // Butona click event ekle
        const selectBtn = partialCard.querySelector('.partial-basket-select-btn');
        selectBtn.addEventListener('click', () => {
          showPartialBasketConfirmation(market, currentBasketPrice);
        });
        
        // Hover efektleri
        partialCard.addEventListener('mouseenter', function() {
          this.style.boxShadow = '0 4px 16px rgba(93, 62, 188, 0.15)';
          this.style.borderColor = '#c4b5e8';
        });
        
        partialCard.addEventListener('mouseleave', function() {
          this.style.boxShadow = 'none';
          this.style.borderColor = '#e0d4f7';
        });
        
        selectBtn.addEventListener('mouseenter', function() {
          this.style.transform = 'translateY(-1px)';
          this.style.boxShadow = '0 4px 10px rgba(93, 62, 188, 0.4)';
        });
        
        selectBtn.addEventListener('mouseleave', function() {
          this.style.transform = 'translateY(0)';
          this.style.boxShadow = '0 2px 6px rgba(93, 62, 188, 0.3)';
        });
        
        partialSection.appendChild(partialCard);
      });
      
      marketsList.appendChild(partialSection);
    }
  }
}

// Fiyat formatlama (kuruş cinsinden)
function formatPrice(price) {
  return `₺${(price / 100).toFixed(2).replace('.', ',')}`;
}

// Fiyat formatlama (TL cinsinden - API sonuçları için)
function formatPriceTL(price) {
  return `₺${price.toFixed(2).replace('.', ',')}`;
}

// Sonuçları göster
function displayResults(oldPrice, newPrice) {
  const loadingSection = document.querySelector('#getir-compare-overlay .loading-section');
  const resultSection = document.querySelector('#getir-compare-overlay .result-section');
  
  loadingSection.style.display = 'none';
  resultSection.style.display = 'block';
  
  const savings = oldPrice - newPrice;
  const percentage = ((savings / oldPrice) * 100).toFixed(1);
  
  document.querySelector('.old-price .price').textContent = formatPrice(oldPrice);
  document.querySelector('.new-price .price').textContent = formatPrice(newPrice);
  document.querySelector('.savings .amount').textContent = formatPrice(savings);
  document.querySelector('.savings .percentage').textContent = `(%${percentage})`;
}

// Kısmi sepet onay modalı
function showPartialBasketConfirmation(market, currentPrice) {
  const missingCount = market.missingProducts?.length || 0;
  const foundCount = market.foundProductCount;
  // DOĞRU tasarruf hesaplama - market.savingsEstimate'i kullan
  const savings = market.savingsEstimate || 0;
  
  const missingProductsList = market.missingProducts
    .map(p => `<li style="color: #d32f2f; font-weight: 500;">❌ ${p.name}${p.count > 1 ? ` (${p.count} adet)` : ''}</li>`)
    .join('');
  
  const modal = document.createElement('div');
  modal.id = 'partial-basket-modal';
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    z-index: 10000000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
  `;
  
  modal.innerHTML = `
    <div style="background: white; border-radius: 16px; max-width: 500px; width: 100%; padding: 24px; box-shadow: 0 8px 32px rgba(0,0,0,0.3);">
      <h3 style="margin: 0 0 16px 0; color: #5d3ebc; font-size: 20px;">⚠️ Kısmi Sepet Onayı</h3>
      
      <div style="background: #fff8f0; border: 2px solid #ff9800; border-radius: 12px; padding: 16px; margin-bottom: 16px;">
        <p style="margin: 0 0 12px 0; color: #333; font-size: 14px; line-height: 1.6;">
          <strong>${market.shopName}</strong> marketini seçiyorsunuz:
        </p>
        <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #666;">
          <li>✅ <strong>${foundCount} ürün</strong> bulundu ve eklenecek</li>
          <li>❌ <strong>${missingCount} ürün</strong> eksik kalacak</li>
          ${savings > 0 ? `<li>💰 <strong>${formatPrice(savings)}</strong> tasarruf</li>` : ''}
        </ul>
      </div>
      
      <div style="background: #ffebee; border-radius: 8px; padding: 12px; margin-bottom: 16px;">
        <p style="margin: 0 0 8px 0; color: #d32f2f; font-weight: 600; font-size: 13px;">⚠️ Eksik kalacak ürünler:</p>
        <ul style="margin: 0; padding-left: 20px; font-size: 12px;">
          ${missingProductsList}
        </ul>
      </div>
      
      <p style="color: #666; font-size: 13px; margin-bottom: 20px;">
        Onayladığınızda mevcut sepetiniz temizlenecek ve sadece <strong>${foundCount} ürün</strong> eklenecektir.
      </p>
      
      <div style="display: flex; gap: 12px;">
        <button id="partial-confirm-btn" style="flex: 1; padding: 14px; background: linear-gradient(135deg, #4caf50 0%, #45a049 100%); color: white; border: none; border-radius: 8px; font-size: 15px; font-weight: 600; cursor: pointer; box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);">
          ✓ Onayla ve Uygula
        </button>
        <button id="partial-cancel-btn" style="flex: 1; padding: 14px; background: #f5f5f5; color: #666; border: none; border-radius: 8px; font-size: 15px; font-weight: 600; cursor: pointer;">
          ✕ İptal
        </button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Buton event'leri
  document.getElementById('partial-confirm-btn').onclick = () => {
    modal.remove();
    applyBasketChange(currentPrice, market, true); // true = kısmi sepet
  };
  
  document.getElementById('partial-cancel-btn').onclick = () => {
    modal.remove();
  };
  
  // Arka plana tıklayınca kapat
  modal.onclick = (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  };
}

// Sepet değiştirme işlemini uygula
async function applyBasketChange(oldPrice, bestMarket, isPartial = false) {
  const applyBtn = document.getElementById('apply-changes-btn');
  const cancelBtn = document.querySelector('.cancel-btn');
  
  // Overlay'i göster
  const loadingSection = document.querySelector('#getir-compare-overlay .loading-section');
  const resultSection = document.querySelector('#getir-compare-overlay .result-section');
  const productResults = document.querySelector('#getir-compare-overlay .product-search-results');
  const marketsList = document.querySelector('#getir-compare-overlay .markets-list');
  
  if (loadingSection) loadingSection.style.display = 'block';
  if (resultSection) resultSection.style.display = 'none';
  if (productResults) productResults.style.display = 'none';
  if (marketsList) marketsList.style.display = 'none';
  
  if (applyBtn) {
    applyBtn.disabled = true;
    applyBtn.innerHTML = '<span class="spinner-small"></span> Uygulanıyor...';
  }
  
  if (cancelBtn) {
    cancelBtn.disabled = true;
  }
  
  try {
    console.log('🔄 Sepet değiştirme başlıyor...');
    console.log('Market:', bestMarket.shopName);
    console.log('Ürün sayısı:', bestMarket.products.length);
    
    // Sepeti boşalt
    updateStatus('Mevcut sepet temizleniyor...');
    await clearBasket();
    
    // Biraz bekle (API'nin sepeti boşaltması için)
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Yeni ürünleri ekle
    if (isPartial) {
      updateStatus(`${bestMarket.shopName} marketinden ${bestMarket.foundProductCount} ürün ekleniyor...`);
    } else {
      updateStatus('Yeni ürünler ekleniyor...');
    }
    await addProductsToBasket(bestMarket);
    
    updateStatus('✓ İşlem tamamlandı! Sayfa yenileniyor...');
    
    console.log('✅ Sepet değiştirme tamamlandı!');
    
    setTimeout(() => {
      window.location.reload();
    }, 2000);
    
  } catch (error) {
    console.error('❌ Sepet değiştirme hatası:', error);
    updateStatus('❌ Hata: ' + error.message);
    
    // Hata durumunda geri göster
    if (loadingSection) loadingSection.style.display = 'none';
    if (resultSection) resultSection.style.display = 'block';
    if (productResults) productResults.style.display = 'block';
    if (marketsList) marketsList.style.display = 'block';
    
    if (applyBtn) {
      applyBtn.disabled = false;
      applyBtn.innerHTML = '<span class="btn-icon">✓</span><span class="btn-text">Sepeti Değiştir ve Uygula</span>';
    }
    
    if (cancelBtn) {
      cancelBtn.disabled = false;
    }
    
    // Hata mesajını alert ile de göster
    alert('Sepet değiştirilemedi: ' + error.message + '\n\nLütfen konsolda detaylara bakın ve tekrar deneyin.');
  }
}

// Ana işlem
async function startComparison() {
  const overlay = createOverlay();
  
  try {
    // 1. Sepeti al
    updateStatus('Sepet bilgileri alınıyor...');
    const basket = await getCurrentBasket();
    
    if (!basket || basket.products.length === 0) {
      updateStatus('Sepetinizde ürün bulunmuyor!');
      return;
    }
    
    // Fiyat hesapla
    let oldPrice;
    if (basket.totalPriceText) {
      // Türkçe format: "₺1.605,10" (nokta=bin ayracı, virgül=ondalık)
      // 1. ₺ işaretini kaldır
      // 2. Bin ayracı noktaları kaldır (. → '')
      // 3. Ondalık virgülü noktaya çevir (, → .)
      const cleaned = basket.totalPriceText
        .replace('₺', '')
        .replace(/\./g, '')  // Tüm noktaları kaldır (bin ayracı)
        .replace(',', '.');   // Virgülü noktaya çevir (ondalık)
      
      oldPrice = parseFloat(cleaned) * 100;
      console.log('💰 Sepet fiyatı (totalPriceText):', basket.totalPriceText, '→ cleaned:', cleaned, '→', oldPrice, 'kuruş');
    } else if (basket.totalPrice) {
      oldPrice = basket.totalPrice;
      console.log('💰 Sepet fiyatı (totalPrice):', basket.totalPrice, 'kuruş');
    } else {
      // Manuel hesaplama - ürünlerin toplam fiyatını hesapla
      oldPrice = basket.products.reduce((sum, p) => sum + (p.price * p.count), 0);
      console.log('💰 Sepet fiyatı (manuel hesaplama):', oldPrice, 'kuruş');
    }
    
    console.log('📊 Final oldPrice:', oldPrice, 'kuruş =', formatPrice(oldPrice));
    
    // Location bilgisini al
    const location = basket.location || { lat: 38.409397039875664, lon: 27.12108839303255 };
    
    // 2. Tüm marketlerde ara
    updateStatus('Marketler taranıyor...');
    const searchResults = await searchInAllMarkets(basket.products, location);
    
    // 3. En uygun marketi bul
    updateStatus('En uygun market bulunuyor...');
    const result = findBestMarket(searchResults, basket.products);
    
    if (!result || !result.completeMarkets || result.completeMarkets.length === 0) {
      updateStatus('Maalesef tüm ürünleri bulabilen başka market bulunamadı.');
      
      // Yine de diğer marketleri göster (debug için)
      if (result && result.allMarkets) {
        displayMarkets([], result.allMarkets, oldPrice);
      }
      
      return;
    }
    
    const markets = result.completeMarkets;
    const bestMarket = markets[0];
    
    console.log('🏆 En iyi market:', bestMarket.shopName);
    console.log('   Shop ID:', bestMarket.shopId);
    console.log('   Fiyat:', bestMarket.totalPrice, 'kuruş =', formatPrice(bestMarket.totalPrice));
    console.log('   currentShopId:', currentShopId);
    console.log('   Aynı mı?', bestMarket.shopId === currentShopId);
    
    // Mevcut sepet fiyatını ve sepet içeriğini global'e kaydet (kısmi sepet için)
    window.getirCompareCurrentPrice = oldPrice;
    window.getirCompareCurrentBasket = basket.products;
    
    console.log('📞 displayMarkets çağrılıyor, oldPrice:', oldPrice, '=', formatPrice(oldPrice));
    
    // 4. Marketleri listele (tüm marketlerle birlikte, mevcut fiyatla)
    displayMarkets(markets, result.allMarkets, oldPrice);
    
    // 5. Sonuçları göster (sepeti değiştirmeden)
    displayResults(oldPrice, bestMarket.totalPrice);
    
    // 6. Kullanıcı kararını bekle
    const applyBtn = document.getElementById('apply-changes-btn');
    
    if (bestMarket.shopId !== currentShopId && oldPrice > bestMarket.totalPrice) {
      // Farklı market ve daha ucuz - buton aktif
      updateStatus('✓ Karşılaştırma tamamlandı! Uygulamak için butona tıklayın.');
      
      applyBtn.onclick = () => {
        applyBasketChange(oldPrice, bestMarket);
      };
      
    } else if (bestMarket.shopId === currentShopId) {
      // Aynı market
      updateStatus('✓ Zaten en ucuz marketteki ürünleri sepetinizde!');
      applyBtn.disabled = true;
      applyBtn.innerHTML = '<span class="btn-icon">✓</span><span class="btn-text">Zaten En Ucuz Sepette</span>';
      
    } else {
      // Mevcut sepet daha ucuz
      updateStatus('✓ Mevcut sepetiniz zaten daha uygun!');
      applyBtn.disabled = true;
      applyBtn.innerHTML = '<span class="btn-icon">✓</span><span class="btn-text">Mevcut Sepet Daha Uygun</span>';
    }
    
  } catch (error) {
    console.error('Karşılaştırma hatası:', error);
    updateStatus('Bir hata oluştu: ' + error.message);
  }
}

// Mesaj dinleyici
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'ping') {
    // Content script yüklendiğini doğrula
    sendResponse({ ready: true });
  } else if (request.action === 'startComparison') {
    startComparison();
    sendResponse({ success: true });
  }
  return true; // Async response için
});

console.log('Getir Çarşı Fiyat Karşılaştırıcı yüklendi!');

