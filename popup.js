// Popup Script

document.addEventListener('DOMContentLoaded', function() {
  const compareBtn = document.getElementById('compareBtn');
  const statusMessage = document.getElementById('statusMessage');
  
  // Aktif sekmeyi kontrol et
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    const currentTab = tabs[0];
    
    if (!currentTab.url || !currentTab.url.includes('getir.com/carsi/sepet')) {
      compareBtn.disabled = true;
      showStatus('Lütfen Getir Çarşı sepet sayfasına gidin!', 'error');
    }
  });
  
  // Karşılaştır butonuna tıklama
  compareBtn.addEventListener('click', async function() {
    compareBtn.disabled = true;
    compareBtn.textContent = 'Karşılaştırılıyor...';
    
    // Content script'e mesaj gönder
    chrome.tabs.query({ active: true, currentWindow: true }, async function(tabs) {
      const tabId = tabs[0].id;
      
      try {
        // Önce content script'in yüklenip yüklenmediğini kontrol et
        await chrome.tabs.sendMessage(tabId, { action: 'ping' });
      } catch (error) {
        // Content script yüklü değil, inject et
        try {
          await chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: ['content.js']
          });
          
          // CSS'yi de inject et
          await chrome.scripting.insertCSS({
            target: { tabId: tabId },
            files: ['styles.css']
          });
          
          // Script'in yüklenmesi için kısa bir süre bekle
          await new Promise(resolve => setTimeout(resolve, 100));
        } catch (injectError) {
          showStatus('Hata: Script yüklenemedi - ' + injectError.message, 'error');
          compareBtn.disabled = false;
          compareBtn.textContent = 'Fiyatları Karşılaştır';
          return;
        }
      }
      
      // Şimdi mesajı gönder
      chrome.tabs.sendMessage(tabId, { action: 'startComparison' }, function(response) {
        if (chrome.runtime.lastError) {
          showStatus('Hata: ' + chrome.runtime.lastError.message, 'error');
          compareBtn.disabled = false;
          compareBtn.textContent = 'Fiyatları Karşılaştır';
        } else {
          showStatus('Karşılaştırma başlatıldı! Lütfen bekleyin...', 'success');
          setTimeout(() => {
            window.close();
          }, 2000);
        }
      });
    });
  });
  
  function showStatus(message, type) {
    statusMessage.textContent = message;
    statusMessage.className = 'status-message ' + type;
  }
});

