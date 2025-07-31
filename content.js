// content.js
// Recibe mensaje del background, solicita nota y etiqueta en un modal custom y envía recorte

function crearModalRecorte({texto, url}, callback) {
  // Función para obtener mensajes localizados
  function getMessage(key) {
    return chrome.i18n.getMessage(key);
  }

  // Eliminar si ya existe
  const existente = document.getElementById('zenmarker-modal');
  if (existente) existente.remove();

  // Crear fondo
  const fondo = document.createElement('div');
  fondo.id = 'zenmarker-modal';
  fondo.style = `
    position: fixed; z-index: 999999; inset: 0; background: rgba(24,24,28,0.92); display: flex; align-items: center; justify-content: center;`;

  // Crear modal
  const modal = document.createElement('div');
  modal.style = `background: #23232a; color: #f1f5f9; border-radius: 14px; box-shadow: 0 4px 32px #0008; padding: 18px 14px 14px 14px; min-width: 250px; max-width: 90vw; font-family: system-ui, sans-serif; position: relative;`;
  modal.innerHTML = `
    <div style="font-size:1.08em; font-weight:600; margin-bottom:10px; letter-spacing:0.01em;">${getMessage('contextMenuSaveSnippet')}</div>
    <div style="font-size:0.97em; margin-bottom:8px; color:#cbd5e1;">${texto.length > 80 ? texto.slice(0,80)+'…' : texto}</div>
    <form id="zenmarker-form">
      <label style="display:block; margin-bottom:6px; color:#e0e7ef;">${getMessage('notePrompt')}</label>
      <input id="zenmarker-nota" type="text" style="width:100%;padding:8px 8px;margin-bottom:10px;border:1.5px solid #334155;background:#18181b;color:#f1f5f9;border-radius:8px;font-size:1em;outline:none;" maxlength="200" autocomplete="off" />
      <label style="display:block; margin-bottom:6px; color:#e0e7ef;">${getMessage('tagPrompt')}</label>
      <input id="zenmarker-etiqueta" type="text" style="width:100%;padding:8px 8px;margin-bottom:12px;border:1.5px solid #334155;background:#18181b;color:#f1f5f9;border-radius:8px;font-size:1em;outline:none;" maxlength="50" autocomplete="off" />
      <div style="display:flex;gap:10px;justify-content:flex-end;">
        <button type="button" id="zenmarker-cancelar" style="background:#23232a;color:#a3a3a3;border:1.5px solid #334155;padding:7px 16px;border-radius:8px;cursor:pointer;font-size:1em;transition:background 0.2s;">${getMessage('cancelButton')}</button>
        <button type="submit" style="background:#2563eb;color:#fff;border:none;padding:7px 16px;border-radius:8px;cursor:pointer;font-size:1em;font-weight:500;box-shadow:0 1px 2px #0002;transition:background 0.2s;">${getMessage('saveButton')}</button>
      </div>
    </form>
    <button id="zenmarker-cerrar" style="position:absolute;top:8px;right:10px;background:none;border:none;font-size:1.2em;color:#64748b;cursor:pointer;">&times;</button>
  `;
  fondo.appendChild(modal);
  document.body.appendChild(fondo);

  // Foco automático en el input de título
  setTimeout(() => {
    document.getElementById('zenmarker-nota').focus();
  }, 0);

  // Cierre seguro
  function cerrar() {
    fondo.remove();
  }
  document.getElementById('zenmarker-cerrar').onclick = cerrar;
  document.getElementById('zenmarker-cancelar').onclick = cerrar;
  fondo.onclick = e => { if (e.target === fondo) cerrar(); };
  document.addEventListener('keydown', function esc(e) { if (e.key === 'Escape') { cerrar(); document.removeEventListener('keydown', esc); } });

  // Submit
  document.getElementById('zenmarker-form').onsubmit = function(e) {
    e.preventDefault();
    const nota = document.getElementById('zenmarker-nota').value;
    const etiqueta = document.getElementById('zenmarker-etiqueta').value;
    cerrar();
    callback({nota, etiqueta});
  };
}

// Escuchar mensajes del background
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "solicitarNota") {
    // Obtener el texto seleccionado con formato HTML
    const selection = window.getSelection();
    let textoConFormato = '';
    
    // Función para obtener texto del elemento activo (para formularios y elementos editables)
    function obtenerTextoElementoActivo() {
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
    
    // Función para obtener texto de PDFs y documentos
    function obtenerTextoPDF() {
      // Intentar obtener texto seleccionado primero
      const selection = window.getSelection();
      if (selection && selection.toString().trim()) {
        return selection.toString();
      }
      
      // Intentar obtener texto de elementos PDF
      const pdfElements = document.querySelectorAll('embed[type="application/pdf"], object[type="application/pdf"]');
      if (pdfElements.length > 0) {
        // Para PDFs embebidos, intentar obtener el texto del contexto
        return selection.toString() || message.texto || '';
      }
      
      // Intentar obtener texto de elementos de texto en el documento
      const textElements = document.querySelectorAll('p, div, span, h1, h2, h3, h4, h5, h6');
      let texto = '';
      textElements.forEach(element => {
        if (element.textContent && element.textContent.trim()) {
          texto += element.textContent.trim() + '\n';
        }
      });
      
      return texto.trim();
    }
    
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      
      // Crear un contenedor temporal
      const container = document.createElement('div');
      container.appendChild(range.cloneContents());
      
      // Obtener el HTML directamente
      textoConFormato = container.innerHTML;
      
      // Si está vacío, usar el texto original
      if (!textoConFormato || textoConFormato.trim() === '') {
        textoConFormato = message.texto;
      } else {
        // Preservar la estructura pero limpiar elementos innecesarios
        textoConFormato = textoConFormato
          // Convertir elementos de bloque a saltos de línea
          .replace(/<div[^>]*>/gi, '<br>')
          .replace(/<\/div>/gi, '')
          .replace(/<p[^>]*>/gi, '<br>')
          .replace(/<\/p>/gi, '')
          .replace(/<h[1-6][^>]*>/gi, '<br>')
          .replace(/<\/h[1-6]>/gi, '<br>')
          .replace(/<li[^>]*>/gi, '<br>• ')
          .replace(/<\/li>/gi, '')
          .replace(/<ul[^>]*>/gi, '')
          .replace(/<\/ul>/gi, '')
          .replace(/<ol[^>]*>/gi, '')
          .replace(/<\/ol>/gi, '')
          // Eliminar enlaces pero preservar el texto dentro de ellos
          .replace(/<a[^>]*>/gi, '')
          .replace(/<\/a>/gi, '')
          // Limpiar elementos de span pero preservar el texto
          .replace(/<span[^>]*>/gi, '')
          .replace(/<\/span>/gi, '')
          // Limpiar elementos de estilo pero preservar el texto
          .replace(/<strong[^>]*>/gi, '<b>')
          .replace(/<\/strong>/gi, '</b>')
          .replace(/<em[^>]*>/gi, '<i>')
          .replace(/<\/em>/gi, '</i>')
          // Limpiar saltos de línea múltiples
          .replace(/<br>\s*<br>/gi, '<br>')
          .replace(/^<br>/i, '')
          .replace(/<br>$/i, '')
          // Limpiar espacios extra
          .replace(/\s+/g, ' ')
          .trim();
      }
      
    } else {
      // Si no hay selección, intentar obtener texto del elemento activo o del mensaje
      textoConFormato = obtenerTextoElementoActivo() || obtenerTextoPDF() || message.texto;
    }
    
    crearModalRecorte({texto: textoConFormato, url: message.url}, ({nota, etiqueta}) => {
      chrome.runtime.sendMessage({
        action: "guardarRecorte",
        texto: textoConFormato,
        url: message.url,
        nota: nota,
        etiqueta: etiqueta
      });
    });
  } else if (message.action === "saveSnippetFromKeyboard") {
    console.log("Mensaje de atajo de teclado recibido:", message);
    // Manejar guardado desde atajo de teclado
    crearModalRecorte(message.data, ({nota, etiqueta}) => {
      chrome.runtime.sendMessage({
        action: "guardarRecorte",
        texto: message.data.texto,
        url: message.data.url,
        nota: nota,
        etiqueta: etiqueta
      });
    });
  }
}); 