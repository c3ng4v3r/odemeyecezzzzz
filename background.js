// Background Service Worker

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getCookies') {
    // Getir.com'dan cookie'leri al
    chrome.cookies.getAll({ domain: '.getir.com' }, (cookies) => {
      const cookieObj = {};
      
      cookies.forEach(cookie => {
        cookieObj[cookie.name] = cookie.value;
      });
      
      sendResponse(cookieObj);
    });
    
    return true; // Async response için
  }
});

// Eklenti yüklendiğinde
chrome.runtime.onInstalled.addListener(() => {
  console.log('Getir Çarşı Fiyat Karşılaştırıcı kuruldu!');
});

