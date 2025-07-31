// background.js
// Maneja el menú contextual y almacenamiento de recortes

// Función para obtener mensajes localizados
function getMessage(key) {
  return chrome.i18n.getMessage(key);
}

// Crear menús contextuales al instalar la extensión
chrome.runtime.onInstalled.addListener(() => {
  // Menú principal para texto seleccionado
  chrome.contextMenus.create({
    id: "guardar-recorte",
    title: getMessage('contextMenuSaveSnippet'),
    contexts: ["selection"]
  });
    
  // Menú para elementos editables (solo cuando no hay selección)
  chrome.contextMenus.create({
    id: "guardar-recorte-editable",
    title: getMessage('contextMenuSaveSnippet'),
    contexts: ["editable"]
  });
  
  // Verificar que los comandos estén registrados
  chrome.commands.getAll((commands) => {
    console.log("Comandos registrados:", commands);
  });
});

// Manejar comandos de teclado
chrome.commands.onCommand.addListener((command) => {
  console.log("Comando recibido:", command);
  if (command === "save-selected-text") {
    // Obtener la pestaña activa
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      if (tabs[0]) {
        // No intentar en chrome://, edge://, about: o Chrome Web Store
        if (/^(chrome|edge):\/\//.test(tabs[0].url) || 
            tabs[0].url.startsWith('about:') || 
            tabs[0].url.startsWith('https://chrome.google.com/webstore') ||
            tabs[0].url === 'about:blank') {
          console.warn("No se puede guardar recortes en esta página protegida:", tabs[0].url);
          return;
        }
        
        // Ejecutar script en la pestaña activa para mostrar modal
        chrome.scripting.executeScript({
          target: {tabId: tabs[0].id},
          function: handleKeyboardShortcut
        });
      }
    });
  }
});

// Función que se ejecuta en el contexto de la página web
function handleKeyboardShortcut() {
  const selectedText = window.getSelection().toString().trim();
  console.log("Texto seleccionado:", selectedText);
  
  if (!selectedText) {
    return null;
  }
  
  // Obtener el idioma actual del navegador
  const browserLang = navigator.language || 'en';
  const lang = browserLang.startsWith('es') ? 'es' : 
               browserLang.startsWith('it') ? 'it' : 
               browserLang.startsWith('fr') ? 'fr' : 
               browserLang.startsWith('de') ? 'de' : 'en';
  
  // Traducciones para el modal
  const translations = {
    es: {
      title: 'Guardar recorte',
      titleLabel: 'Título (opcional):',
      tagLabel: 'Etiqueta (opcional):',
      cancel: 'Cancelar',
      save: 'Guardar'
    },
    en: {
      title: 'Save snippet',
      titleLabel: 'Title (optional):',
      tagLabel: 'Tag (optional):',
      cancel: 'Cancel',
      save: 'Save'
    },
    it: {
      title: 'Salva ritaglio',
      titleLabel: 'Titolo (opzionale):',
      tagLabel: 'Etichetta (opzionale):',
      cancel: 'Annulla',
      save: 'Salva'
    },
    fr: {
      title: 'Enregistrer extrait',
      titleLabel: 'Titre (optionnel):',
      tagLabel: 'Étiquette (optionnel):',
      cancel: 'Annuler',
      save: 'Enregistrer'
    },
    de: {
      title: 'Ausschnitt speichern',
      titleLabel: 'Titel (optional):',
      tagLabel: 'Tag (optional):',
      cancel: 'Abbrechen',
      save: 'Speichern'
    }
  };
  
  const t = translations[lang] || translations.en;
  
  // Crear un modal simple directamente en la página
  const modal = document.createElement('div');
  modal.id = 'zenmarker-keyboard-modal';
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999999;
    font-family: system-ui, sans-serif;
  `;
  
  modal.innerHTML = `
    <div style="
      background: #23232a;
      color: #f1f5f9;
      border-radius: 14px;
      padding: 20px;
      min-width: 300px;
      max-width: 90vw;
      position: relative;
    ">
      <h3 style="margin: 0 0 15px 0; font-size: 1.1em;">${t.title}</h3>
      <div style="margin-bottom: 15px; color: #cbd5e1; font-size: 0.9em;">
        ${selectedText.length > 100 ? selectedText.slice(0, 100) + '...' : selectedText}
      </div>
      <form id="zenmarker-keyboard-form">
        <label style="display: block; margin-bottom: 5px; color: #e0e7ef;">${t.titleLabel}</label>
        <input type="text" id="zenmarker-keyboard-nota" style="
          width: 100%;
          padding: 8px;
          margin-bottom: 10px;
          border: 1.5px solid #334155;
          background: #18181b;
          color: #f1f5f9;
          border-radius: 6px;
          font-size: 0.9em;
          box-sizing: border-box;
        " maxlength="200" autocomplete="off">
        
        <label style="display: block; margin-bottom: 5px; color: #e0e7ef;">${t.tagLabel}</label>
        <input type="text" id="zenmarker-keyboard-etiqueta" style="
          width: 100%;
          padding: 8px;
          margin-bottom: 15px;
          border: 1.5px solid #334155;
          background: #18181b;
          color: #f1f5f9;
          border-radius: 6px;
          font-size: 0.9em;
          box-sizing: border-box;
        " maxlength="50" autocomplete="off">
        
        <div style="display: flex; gap: 10px; justify-content: flex-end; align-items: center;">
          <button type="button" id="zenmarker-keyboard-cancelar" style="
            background: #23232a;
            color: #a3a3a3;
            border: 1.5px solid #334155;
            padding: 8px 16px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 0.9em;
            text-align: center;
            min-width: 80px;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 36px;
          ">${t.cancel}</button>
          <button type="button" id="zenmarker-keyboard-guardar" style="
            background: #2563eb;
            color: #fff;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 0.9em;
            font-weight: 500;
            text-align: center;
            min-width: 80px;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 36px;
          ">${t.save}</button>
        </div>
      </form>
      <button id="zenmarker-keyboard-cerrar" style="
        position: absolute;
        top: 10px;
        right: 15px;
        background: none;
        border: none;
        font-size: 1.5em;
        color: #64748b;
        cursor: pointer;
      ">&times;</button>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Foco en el campo de nota
  setTimeout(() => {
    document.getElementById('zenmarker-keyboard-nota').focus();
  }, 100);
  
  // Event listeners
  const cerrar = () => {
    modal.remove();
  };
  
  document.getElementById('zenmarker-keyboard-cerrar').onclick = cerrar;
  document.getElementById('zenmarker-keyboard-cancelar').onclick = cerrar;
  modal.onclick = (e) => {
    if (e.target === modal) cerrar();
  };
  
  // Manejar teclas especiales
  const handleKey = (e) => {
    if (e.key === 'Escape') {
      cerrar();
      document.removeEventListener('keydown', handleKey);
    } else if (e.key === 'Enter' && (e.target.id === 'zenmarker-keyboard-nota' || e.target.id === 'zenmarker-keyboard-etiqueta')) {
      e.preventDefault();
      // Guardar automáticamente al presionar Enter
      const nota = document.getElementById('zenmarker-keyboard-nota').value.trim();
      const etiqueta = document.getElementById('zenmarker-keyboard-etiqueta').value.trim();
      cerrar();
      
      // Enviar mensaje al background script
      chrome.runtime.sendMessage({
        action: "guardarRecorteDesdeTeclado",
        data: {
          texto: selectedText,
          url: window.location.href,
          nota: nota,
          etiqueta: etiqueta
        }
      });
    }
  };
  document.addEventListener('keydown', handleKey);
  
  // Guardar con el botón
  document.getElementById('zenmarker-keyboard-guardar').onclick = () => {
    const nota = document.getElementById('zenmarker-keyboard-nota').value.trim();
    const etiqueta = document.getElementById('zenmarker-keyboard-etiqueta').value.trim();
    cerrar();
    
    // Enviar mensaje al background script
    chrome.runtime.sendMessage({
      action: "guardarRecorteDesdeTeclado",
      data: {
        texto: selectedText,
        url: window.location.href,
        nota: nota,
        etiqueta: etiqueta
      }
    });
  };
  
  return null;
}

// Función para guardar recorte directamente desde el background script
function guardarRecorteDirectamente(data) {
  // Normalizar la etiqueta antes de guardar
  function normalizarTag(tag) {
    return (tag || "").trim().toLowerCase();
  }
  
  const recorte = {
    texto: data.texto,
    url: data.url,
    fecha: new Date().toISOString(),
    nota: data.nota || "",
    etiqueta: normalizarTag(data.etiqueta)
  };
  
  // Obtener recortes existentes, agregar el nuevo y guardar
  chrome.storage.local.get({recortes: [], totalSaved: 0}, (storageData) => {
    const recortes = storageData.recortes;
    recortes.unshift(recorte); // Agregar al inicio
    const totalSaved = (storageData.totalSaved || 0) + 1;
    chrome.storage.local.set({recortes, totalSaved}, () => {
      console.log("Recorte guardado desde atajo de teclado:", recorte);
    });
  });
}

// Escuchar clic en el menú contextual
chrome.contextMenus.onClicked.addListener((info, tab) => {
  const menuIds = ["guardar-recorte", "guardar-recorte-editable"];
  
  if (menuIds.includes(info.menuItemId)) {
    if (tab && tab.id && tab.url) {
      // No intentar en chrome://, edge://, about: o Chrome Web Store
      if (/^(chrome|edge):\/\//.test(tab.url) || 
          tab.url.startsWith('about:') || 
          tab.url.startsWith('https://chrome.google.com/webstore') ||
          tab.url === 'about:blank') {
        // Silenciar el aviso para páginas conocidas que no soportan content scripts
        if (tab.url !== 'about:blank' && !tab.url.startsWith('https://chrome.google.com/webstore')) {
          console.warn("No se puede guardar recortes en esta página protegida:", tab.url);
        }
        return;
      }
      
      // Obtener el texto seleccionado o el texto del elemento editable
      let textoParaGuardar = info.selectionText || '';
      
      // Si no hay texto seleccionado y es un elemento editable, intentar obtener el texto del elemento activo
      if (!textoParaGuardar && info.menuItemId === "guardar-recorte-editable") {
        // Para elementos editables, intentar obtener el texto del campo activo
        chrome.scripting.executeScript({
          target: {tabId: tab.id},
          func: () => {
            const activeElement = document.activeElement;
            if (activeElement) {
              if (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA') {
                return activeElement.value || activeElement.textContent || '';
              } else if (activeElement.contentEditable === 'true') {
                return activeElement.textContent || '';
              }
            }
            
            // Buscar otros elementos editables
            const editableElements = document.querySelectorAll('input, textarea, [contenteditable="true"]');
            for (let element of editableElements) {
              if (element.value && element.value.trim()) {
                return element.value;
              }
            }
            
            return '';
          }
        }, (results) => {
          if (results && results[0] && results[0].result) {
            textoParaGuardar = results[0].result;
            enviarMensaje(textoParaGuardar);
          }
        });
        return;
      }
      
      function enviarMensaje(texto = textoParaGuardar) {
        if (!texto || texto.trim() === '') {
          console.warn("No hay texto para guardar");
          return;
        }
        
        chrome.tabs.sendMessage(tab.id, {
          action: "solicitarNota",
          texto: texto,
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
                texto: texto,
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
    // Normalizar la etiqueta antes de guardar
    function normalizarTag(tag) {
      return (tag || "").trim().toLowerCase();
    }
    const recorte = {
      texto: message.texto,
      url: message.url,
      fecha: new Date().toISOString(),
      nota: message.nota || "",
      etiqueta: normalizarTag(message.etiqueta)
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
  } else if (message.action === "guardarRecorteDesdeTeclado") {
    // Guardar recorte desde atajo de teclado
    guardarRecorteDirectamente(message.data);
    sendResponse({exito: true});
    return true;
  }
}); 