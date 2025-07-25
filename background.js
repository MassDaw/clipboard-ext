// background.js
// Maneja el menú contextual y almacenamiento de recortes

// Crear menú contextual al instalar la extensión
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "guardar-recorte",
    title: "Guardar recorte",
    contexts: ["selection"]
  });
});

// Escuchar clic en el menú contextual
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "guardar-recorte" && info.selectionText) {
    if (tab && tab.id && tab.url) {
      // No intentar en chrome://, edge://, about: o Chrome Web Store
      if (/^(chrome|edge):\/\//.test(tab.url) || tab.url.startsWith('about:') || tab.url.startsWith('https://chrome.google.com/webstore')) {
        console.warn("No se puede guardar recortes en esta página protegida:", tab.url);
        return;
      }
      function enviarMensaje() {
        chrome.tabs.sendMessage(tab.id, {
          action: "solicitarNota",
          texto: info.selectionText,
          url: info.pageUrl
        }, (response) => {
          if (chrome.runtime.lastError) {
            // Intentar inyectar el content script dinámicamente
            chrome.scripting.executeScript({
              target: {tabId: tab.id},
              files: ["content.js"]
            }, () => {
              // Reintentar el mensaje una sola vez
              chrome.tabs.sendMessage(tab.id, {
                action: "solicitarNota",
                texto: info.selectionText,
                url: info.pageUrl
              }, (resp2) => {
                if (chrome.runtime.lastError) {
                  console.warn("No se pudo comunicar con el content script tras inyectar:", chrome.runtime.lastError.message);
                }
              });
            });
          }
        });
      }
      enviarMensaje();
    }
  }
});

// Recibir recorte desde content.js y guardar en storage
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "guardarRecorte") {
    const recorte = {
      texto: message.texto,
      url: message.url,
      fecha: new Date().toISOString(),
      nota: message.nota || "",
      etiqueta: message.etiqueta || ""
    };
    // Obtener recortes existentes, agregar el nuevo y guardar
    chrome.storage.local.get({recortes: [], totalSaved: 0}, (data) => {
      const recortes = data.recortes;
      recortes.unshift(recorte); // Agregar al inicio
      const totalSaved = (data.totalSaved || 0) + 1;
      chrome.storage.local.set({recortes, totalSaved}, () => {
        sendResponse({exito: true});
      });
    });
    // Indicar que la respuesta será asíncrona
    return true;
  }
}); 