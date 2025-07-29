// content.js
// Recibe mensaje del background, solicita nota y etiqueta en un modal custom y envía recorte

function crearModalRecorte({texto, url}, callback) {
  // Detectar idioma del navegador
  const lang = (navigator.language || 'es').slice(0,2);
  const i18n = {
    es: { guardar: 'Guardar recorte', titulo: 'Título (opcional):', etiqueta: 'Etiqueta (opcional):', cancelar: 'Cancelar', aceptar: 'Aceptar' },
    en: { guardar: 'Save clipping', titulo: 'Title (optional):', etiqueta: 'Tag (optional):', cancelar: 'Cancel', aceptar: 'OK' },
    it: { guardar: 'Salva ritaglio', titulo: 'Titolo (opzionale):', etiqueta: 'Etichetta (opzionale):', cancelar: 'Annulla', aceptar: 'OK' },
    fr: { guardar: 'Enregistrer extrait', titulo: 'Titre (optionnel):', etiqueta: 'Étiquette (optionnelle):', cancelar: 'Annuler', aceptar: 'OK' },
    de: { guardar: 'Ausschnitt speichern', titulo: 'Titel (optional):', etiqueta: 'Tag (optional):', cancelar: 'Abbrechen', aceptar: 'OK' }
  };
  const t = i18n[lang] || i18n['es'];

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
    <div style="font-size:1.08em; font-weight:600; margin-bottom:10px; letter-spacing:0.01em;">${t.guardar}</div>
    <div style="font-size:0.97em; margin-bottom:8px; color:#cbd5e1;">${texto.length > 80 ? texto.slice(0,80)+'…' : texto}</div>
    <form id="zenmarker-form">
      <label style="display:block; margin-bottom:6px; color:#e0e7ef;">${t.titulo}</label>
      <input id="zenmarker-nota" type="text" style="width:100%;padding:8px 8px;margin-bottom:10px;border:1.5px solid #334155;background:#18181b;color:#f1f5f9;border-radius:8px;font-size:1em;outline:none;" maxlength="200" autocomplete="off" />
      <label style="display:block; margin-bottom:6px; color:#e0e7ef;">${t.etiqueta}</label>
      <input id="zenmarker-etiqueta" type="text" style="width:100%;padding:8px 8px;margin-bottom:12px;border:1.5px solid #334155;background:#18181b;color:#f1f5f9;border-radius:8px;font-size:1em;outline:none;" maxlength="50" autocomplete="off" />
      <div style="display:flex;gap:10px;justify-content:flex-end;">
        <button type="button" id="zenmarker-cancelar" style="background:#23232a;color:#a3a3a3;border:1.5px solid #334155;padding:7px 16px;border-radius:8px;cursor:pointer;font-size:1em;transition:background 0.2s;">${t.cancelar}</button>
        <button type="submit" style="background:#2563eb;color:#fff;border:none;padding:7px 16px;border-radius:8px;cursor:pointer;font-size:1em;font-weight:500;box-shadow:0 1px 2px #0002;transition:background 0.2s;">${t.aceptar}</button>
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
      textoConFormato = message.texto;
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
  }
}); 