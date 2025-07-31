// popup.js
// Muestra y permite eliminar recortes guardados, búsqueda, exportar, copiar, etiquetas, contador, modo oscuro y donación

document.addEventListener('DOMContentLoaded', () => {
  const lista = document.getElementById('recortes-list');
  const sinRecortes = document.getElementById('sin-recortes');
  const buscador = document.getElementById('buscador-recortes');
  const filtroEtiqueta = document.getElementById('filtro-etiqueta');
  const exportarBtn = document.getElementById('exportar-md');
  const totalRecortesDiv = document.getElementById('total-recortes');
  const themeToggle = document.getElementById('theme-toggle');
  const donacionBtnFinal = document.getElementById('donacion-btn-final');
  const exportarPdfBtn = document.getElementById('exportar-pdf');
  const langSelect = document.getElementById('lang-select');
  const tituloPrincipal = document.getElementById('titulo-principal');
  const donacionMsg = document.getElementById('donacion-msg');
  const eliminarTodoBtn = document.getElementById('eliminar-todo-btn');
  
  // Función para obtener mensajes localizados
  function getMessage(key, substitutions = []) {
    return chrome.i18n.getMessage(key, substitutions);
  }
  
  // Diccionario de traducciones
  const i18n = {
    es: {
      titulo: 'Recortes',
      total: recs => `Has guardado ${recs} recortes`,
      buscar: 'Buscar…',
      sinRecortes: 'No hay recortes guardados.',
      todasEtiquetas: 'Etiquetas',
      exportarPdf: 'Exportar a PDF 🖨️',
      copiar: 'Copiar recorte',
      copiado: 'Copiado',
      eliminar: 'Eliminar',
      irPagina: 'Ir a la página',
      texto: 'Texto',
      nota: 'Título',
      url: 'URL',
      etiqueta: 'Etiqueta',
      fecha: 'Fecha',
      recorte: i => `Recorte ${i}`,
      recortesGuardados: 'Recortes guardados',
      donacion: '¿Esta extensión te ha sido útil? ¡Invítame un café! ☕',
      buyMeCoffee: 'Invítame un café',

      pin: 'Pinear',
      unpin: 'Despinear',
      compartir: 'Compartir',
      compartirWhatsapp: 'Compartir por WhatsApp',
      compartirGmail: 'Compartir por Gmail',
      compartirTelegram: 'Compartir por Telegram',
      confirmarEliminar: '¿Seguro que quieres eliminar este recorte?',
      confirmar: 'Eliminar',
      cancelar: 'Cancelar',
      ordenarFecha: 'Ordenar por fecha',
      eliminarTodo: 'Eliminar todo',
      confirmarEliminarTodo: '¿Estás seguro de que quieres eliminar todos los recortes? Esta acción no se puede deshacer.',
    },
    en: {
      titulo: 'Clippings',
      total: recs => `You have saved ${recs} clippings`,
      buscar: 'Search…',
      sinRecortes: 'No clippings saved.',
      todasEtiquetas: 'All tags',
      exportarPdf: 'Export to PDF 🖨️',
      copiar: 'Copy clipping',
      copiado: 'Copied',
      eliminar: 'Delete',
      irPagina: 'Go to page',
      texto: 'Text',
      nota: 'Title',
      url: 'URL',
      etiqueta: 'Tag',
      fecha: 'Date',
      recorte: i => `Clipping ${i}`,
      recortesGuardados: 'Saved clippings',
      donacion: 'Has this extension been useful? Buy me a coffee! ☕',
      buyMeCoffee: 'Buy me a coffee',

      pin: 'Pin',
      unpin: 'Unpin',
      compartir: 'Share',
      compartirWhatsapp: 'Share via WhatsApp',
      compartirGmail: 'Share via Gmail',
      compartirTelegram: 'Share via Telegram',
      confirmarEliminar: 'Are you sure you want to delete this snippet?',
      confirmar: 'Delete',
      cancelar: 'Cancel',
      ordenarFecha: 'Sort by date',
      eliminarTodo: 'Delete all',
      confirmarEliminarTodo: 'Are you sure you want to delete all clippings? This action cannot be undone.',
    },
    it: {
      titulo: 'Ritagli',
      total: recs => `Hai salvato ${recs} ritagli`,
      buscar: 'Cerca…',
      sinRecortes: 'Nessun ritaglio salvato.',
      todasEtiquetas: 'Tutte le etichette',
      exportarPdf: 'Esporta in PDF 🖨️',
      copiar: 'Copia ritaglio',
      copiado: 'Copiato',
      eliminar: 'Elimina',
      irPagina: 'Vai alla pagina',
      texto: 'Testo',
      nota: 'Titolo',
      url: 'URL',
      etiqueta: 'Etichetta',
      fecha: 'Data',
      recorte: i => `Ritaglio ${i}`,
      recortesGuardados: 'Ritagli salvati',
      donacion: 'Questa estensione ti è stata utile? Offrimi un caffè! ☕',
      buyMeCoffee: 'Offrimi un caffè',

      pin: 'Fissa',
      unpin: 'Sblocca',
      compartir: 'Condividi',
      compartirWhatsapp: 'Condividi su WhatsApp',
      compartirGmail: 'Condividi su Gmail',
      compartirTelegram: 'Condividi su Telegram',
      confirmarEliminar: 'Sei sicuro di voler eliminare questo ritaglio?',
      confirmar: 'Elimina',
      cancelar: 'Annulla',
      ordenarFecha: 'Ordina per data',
      eliminarTodo: 'Elimina tutto',
      confirmarEliminarTodo: 'Sei sicuro di voler eliminare tutti i ritagli? Questa azione non può essere annullata.',
    },
    fr: {
      titulo: 'Extraits',
      total: recs => `Vous avez enregistré ${recs} extraits`,
      buscar: 'Rechercher…',
      sinRecortes: 'Aucun extrait enregistré.',
      todasEtiquetas: 'Toutes les étiquettes',
      exportarPdf: 'Exporter en PDF 🖨️',
      copiar: 'Copier l\'extrait',
      copiado: 'Copié',
      eliminar: 'Supprimer',
      irPagina: 'Aller à la page',
      texto: 'Texte',
      nota: 'Titre',
      url: 'URL',
      etiqueta: 'Étiquette',
      fecha: 'Date',
      recorte: i => `Extrait ${i}`,
      recortesGuardados: 'Extraits enregistrés',
      donacion: 'Cette extension vous a été utile ? Offrez-moi un café ! ☕',
      buyMeCoffee: 'Offrez-moi un café',

      pin: 'Épingler',
      unpin: 'Désépingler',
      compartir: 'Partager',
      compartirWhatsapp: 'Partager via WhatsApp',
      compartirGmail: 'Partager via Gmail',
      compartirTelegram: 'Partager via Telegram',
      confirmarEliminar: 'Êtes-vous sûr de vouloir supprimer cet extrait ?',
      confirmar: 'Supprimer',
      cancelar: 'Annuler',
      ordenarFecha: 'Trier par date',
      eliminarTodo: 'Tout supprimer',
      confirmarEliminarTodo: 'Êtes-vous sûr de vouloir supprimer tous les extraits ? Cette action ne peut pas être annulée.',
    },
    de: {
      titulo: 'Ausschnitte',
      total: recs => `Du hast ${recs} Ausschnitte gespeichert`,
      buscar: 'Suchen…',
      sinRecortes: 'Keine Ausschnitte gespeichert.',
      todasEtiquetas: 'Alle Tags',
      exportarPdf: 'Als PDF exportieren 🖨️',
      copiar: 'Ausschnitt kopieren',
      copiado: 'Kopiert',
      eliminar: 'Löschen',
      irPagina: 'Zur Seite',
      texto: 'Text',
      nota: 'Titel',
      url: 'URL',
      etiqueta: 'Tag',
      fecha: 'Datum',
      recorte: i => `Ausschnitt ${i}`,
      recortesGuardados: 'Gespeicherte Ausschnitte',
      donacion: 'War diese Erweiterung nützlich? Spendier mir einen Kaffee! ☕',
      buyMeCoffee: 'Spendier mir einen Kaffee',

      pin: 'Anheften',
      unpin: 'Lösen',
      compartir: 'Teilen',
      compartirWhatsapp: 'Über WhatsApp teilen',
      compartirGmail: 'Über Gmail teilen',
      compartirTelegram: 'Über Telegram teilen',
      confirmarEliminar: 'Möchtest du diesen Ausschnitt wirklich löschen?',
      confirmar: 'Löschen',
      cancelar: 'Abbrechen',
      ordenarFecha: 'Nach Datum sortieren',
      eliminarTodo: 'Alles löschen',
      confirmarEliminarTodo: 'Sind Sie sicher, dass Sie alle Ausschnitte löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.',
    }
  };
  let lang = 'es';
  // Cargar idioma guardado
  chrome.storage.local.get({lang: 'es'}, data => {
    lang = data.lang;
    langSelect.value = lang;
    traducirUI();
  });
  langSelect.addEventListener('change', e => {
    lang = e.target.value;
    chrome.storage.local.set({lang});
    traducirUI();
    mostrarRecortes(); // Recargar recortes para mantener orden y fechas correctas
  });
  function traducirUI() {
    const t = i18n[lang];
    tituloPrincipal.textContent = t.titulo;
    buscador.placeholder = t.buscar;
    filtroEtiqueta.querySelector('option[value=""]').textContent = t.todasEtiquetas;
    exportarPdfBtn.textContent = t.exportarPdf;
    totalRecortesDiv.textContent = t.total(recortes.length);
    sinRecortes.textContent = t.sinRecortes;
    donacionMsg.textContent = t.donacion;
    eliminarTodoBtn.textContent = t.eliminarTodo;
    donacionBtnFinal.textContent = t.buyMeCoffee;

    // Actualizar tooltip del botón de ordenar
    document.getElementById('ordenar-fecha').title = t.ordenarFecha;
    // Actualizar tooltips de botones sin afectar fechas
    document.querySelectorAll('.recorte').forEach((li, idx) => {
      const meta = li.querySelector('.meta');
      if (meta) {
        const copiarBtn = meta.querySelector('.btn-copiar');
        if (copiarBtn) copiarBtn.title = t.copiar;
        const eliminarBtn = meta.querySelector('.eliminar');
        if (eliminarBtn) eliminarBtn.title = t.eliminar;
        const link = meta.querySelector('a');
        if (link) link.title = t.irPagina;
      }
      // No actualizar fechas aquí para mantener el orden correcto
    });
  }

  let recortes = [];
  let filtro = '';
  let etiquetaSeleccionada = '';
  let ordenFechaAsc = false;

  // --- Botón de ordenar por fecha ---
  document.getElementById('ordenar-fecha').addEventListener('click', () => {
    ordenFechaAsc = !ordenFechaAsc;
    const icono = document.getElementById('icono-ordenar-fecha');
    icono.src = ordenFechaAsc ? 'icons/order-by-up.svg' : 'icons/order-by.svg';
    mostrarRecortes();
  });

  // --- Modo claro/oscuro ---
  function aplicarTema(modo) {
    document.body.classList.toggle('dark-mode', modo === 'oscuro');
    themeToggle.textContent = modo === 'oscuro' ? '☀️' : '🌙';
  }
  chrome.storage.local.get({theme: 'claro'}, data => {
    aplicarTema(data.theme);
  });
  themeToggle.addEventListener('click', () => {
    const nuevoModo = document.body.classList.contains('dark-mode') ? 'claro' : 'oscuro';
    chrome.storage.local.set({theme: nuevoModo}, () => aplicarTema(nuevoModo));
  });

  // --- Cargar y mostrar recortes ---
  function cargarRecortesYTotal() {
    chrome.storage.local.get({recortes: [], totalSaved: 0, lang: 'es'}, (data) => {
      recortes = data.recortes;
      lang = data.lang || 'es';
      mostrarRecortes();
      totalRecortesDiv.textContent = i18n[lang].total(data.totalSaved);
      actualizarDropdownEtiquetas();
    });
  }

  // --- Mostrar recortes filtrados ---
  function mostrarRecortes() {
    lista.innerHTML = '';
    let filtrados = recortes.filter(r => {
      const texto = (r.texto || '').toLowerCase();
      const nota = (r.nota || '').toLowerCase();
      const url = (r.url || '').toLowerCase();
      const etiqueta = (r.etiqueta || '').toLowerCase();
      const f = filtro.toLowerCase();
      const coincideFiltro = !f || texto.includes(f) || nota.includes(f) || url.includes(f) || etiqueta.includes(f);
      const coincideEtiqueta = !etiquetaSeleccionada || etiqueta === etiquetaSeleccionada.toLowerCase();
      return coincideFiltro && coincideEtiqueta;
    });
    // Ordenar: pinneados primero
    filtrados.sort((a, b) => (b.pinned === true) - (a.pinned === true));
    // Ordenar por fecha
    filtrados.sort((a, b) => {
      if (a.pinned !== b.pinned) return (b.pinned === true) - (a.pinned === true);
      const fa = new Date(a.fecha).getTime();
      const fb = new Date(b.fecha).getTime();
      return ordenFechaAsc ? fa - fb : fb - fa;
    });
    
    // Mostrar/ocultar botón "Eliminar todo" según si hay recortes
    if (recortes.length > 0) {
      eliminarTodoBtn.style.display = 'block';
    } else {
      eliminarTodoBtn.style.display = 'none';
    }
    
    if (filtrados.length === 0) {
      sinRecortes.style.display = 'block';
      sinRecortes.textContent = i18n[lang].sinRecortes;
      return;
    }
    sinRecortes.style.display = 'none';
    
    filtrados.forEach((recorte, idx) => {
      const li = document.createElement('li');
      li.className = 'recorte';
      li.innerHTML = `
        <div class="texto"></div>
        <div class="nota">${recorte.nota ? '📝 ' + recorte.nota : ''}</div>
        <div class="meta">
          <div class="meta-info">
            <a href="${recorte.url}" target="_blank" title="${i18n[lang].irPagina}"><img src="icons/website.svg" alt="Web" class="icon-website"></a>
            <span class="fecha">${nuevaFecha(recorte.fecha)}</span>
            ${recorte.etiqueta ? `<span class="badge-etiqueta">${recorte.etiqueta}</span>` : ''}
          </div>
          <div class="meta-actions">
            <button class="btn-pin" title="${recorte.pinned ? 'Despinnear' : 'Pinnear'}" data-idx="${recortes.indexOf(recorte)}"><img src="icons/${recorte.pinned ? 'pin-on.svg' : 'pin-off.svg'}" alt="Pin" class="icon-pin"></button>
            <button class="btn-copiar" title="${i18n[lang].copiar}" data-idx="${recortes.indexOf(recorte)}"><img src="icons/copy.svg" alt="Copiar" class="icon-action"></button>
            <button class="btn-compartir" title="Compartir" data-idx="${recortes.indexOf(recorte)}"><img src="icons/share.svg" alt="Compartir" class="icon-action"></button>
            <button class="eliminar" title="${i18n[lang].eliminar}" data-idx="${recortes.indexOf(recorte)}"><img src="icons/delete.svg" alt="Eliminar" class="icon-action"></button>
          </div>
        </div>
      `;
      // Expandir/colapsar texto
      const textoDiv = li.querySelector('.texto');
      textoDiv.innerHTML = recorte.texto; // Insertar texto con formato HTML
      
      // Manejar enlaces para que se abran fuera de la extensión
      const enlaces = textoDiv.querySelectorAll('a');
      enlaces.forEach(enlace => {
        enlace.setAttribute('target', '_blank');
        enlace.setAttribute('rel', 'noopener noreferrer');
      });
      
      textoDiv.addEventListener('click', (e) => {
        // Solo expandir si no se hizo clic en un enlace
        if (e.target.tagName !== 'A') {
          textoDiv.classList.toggle('expandido');
        }
      });
      // Pinnear recorte
      const pinBtn = li.querySelector('.btn-pin');
      pinBtn.addEventListener('click', () => {
        const originalIdx = parseInt(pinBtn.getAttribute('data-idx'));
        // Si se va a pinnear, animar el movimiento hacia arriba
        if (!recorte.pinned) {
          li.classList.add('pin-anim');
          setTimeout(() => {
            alternarPinRecorte(originalIdx);
            li.classList.remove('pin-anim');
          }, 680);
        } else {
          // Si se va a despinnear, animar el movimiento hacia abajo
          li.classList.add('unpin-anim');
          setTimeout(() => {
            alternarPinRecorte(originalIdx);
            li.classList.remove('unpin-anim');
          }, 680);
        }
      });
      // Copiar recorte
      const copiarBtn = li.querySelector('.btn-copiar');
      copiarBtn.addEventListener('click', () => {
        copiarRecorte(recorte, copiarBtn);
      });
      // Compartir recorte
      const compartirBtn = li.querySelector('.btn-compartir');
      compartirBtn.addEventListener('click', () => {
        compartirRecorte(recorte);
      });
      // Eliminar recorte
      const eliminarBtn = li.querySelector('.eliminar');
      eliminarBtn.addEventListener('click', () => {
        const originalIdx = parseInt(eliminarBtn.getAttribute('data-idx'));
        mostrarConfirmacionEliminar(originalIdx);
      });
      lista.appendChild(li);
    });
    // No llamar traducirUI() aquí para evitar que sobrescriba las fechas
    // traducirUI();
  }

  // --- Filtrar búsqueda ---
  buscador.addEventListener('input', e => {
    filtro = e.target.value;
    mostrarRecortes();
  });

  // --- Filtrar por etiqueta ---
  filtroEtiqueta.addEventListener('change', e => {
    etiquetaSeleccionada = e.target.value;
    mostrarRecortes();
  });

  // --- Actualizar dropdown de etiquetas ---
  function actualizarDropdownEtiquetas() {
    // Normalizar y filtrar etiquetas únicas
    const etiquetas = Array.from(new Set(
      recortes
        .map(r => (r.etiqueta || '').trim().toLowerCase())
        .filter(Boolean)
    ));
    filtroEtiqueta.innerHTML = '<option value="">Etiquetas</option>' + etiquetas.map(et => `<option value="${et}">${et}</option>`).join('');
  }

  // --- Eliminar recorte ---
  function eliminarRecorte(idx) {
    recortes.splice(idx, 1);
    chrome.storage.local.set({recortes}, cargarRecortesYTotal);
  }

  // --- Copiar recorte al portapapeles ---
  function copiarRecorte(recorte, btn) {
    // Solo copiar el texto del recorte con su formato HTML
    const textoConFormato = recorte.texto;
    
    // Debug: ver qué se está copiando
    console.log('Texto original:', recorte.texto);
    console.log('Contiene <br>:', recorte.texto.includes('<br>'));
    
    // Crear texto plano con saltos de línea preservados
    const textoPlano = recorte.texto
      .replace(/<br\s*\/?>/gi, '\n') // Convertir <br> a saltos de línea
      .replace(/<div[^>]*>/gi, '\n') // Convertir <div> a saltos de línea
      .replace(/<\/div>/gi, '')
      .replace(/<p[^>]*>/gi, '\n')
      .replace(/<\/p>/gi, '')
      .replace(/<[^>]*>/g, '') // Remover todos los demás tags HTML
      .replace(/\n\s*\n/g, '\n') // Limpiar saltos de línea múltiples
      .replace(/^\n+/, '') // Remover saltos de línea al inicio
      .replace(/\n+$/, '') // Remover saltos de línea al final
      .trim();
    
    console.log('Texto plano procesado:', textoPlano);
    console.log('Contiene \\n:', textoPlano.includes('\n'));
    
    // Intentar copiar HTML, con fallback a texto plano
    if (navigator.clipboard && navigator.clipboard.write) {
      const clipboardItem = new ClipboardItem({
        'text/html': new Blob([textoConFormato], { type: 'text/html' }),
        'text/plain': new Blob([textoPlano], { type: 'text/plain' })
      });
      
      navigator.clipboard.write([clipboardItem]).then(() => {
        const img = btn.querySelector('img.icon-action');
        if (img) {
          const originalSrc = img.src;
          img.src = 'icons/copy-success.svg';
          setTimeout(() => {
            img.src = 'icons/copy.svg';
          }, 2000);
        }
      }).catch(() => {
        // Fallback a texto plano si falla el HTML
        navigator.clipboard.writeText(textoPlano).then(() => {
          const img = btn.querySelector('img.icon-action');
          if (img) {
            const originalSrc = img.src;
            img.src = 'icons/copy-success.svg';
            setTimeout(() => {
              img.src = 'icons/copy.svg';
            }, 2000);
          }
        });
      });
    } else {
      // Fallback para navegadores más antiguos
      navigator.clipboard.writeText(textoPlano).then(() => {
        const img = btn.querySelector('img.icon-action');
        if (img) {
          const originalSrc = img.src;
          img.src = 'icons/copy-success.svg';
          setTimeout(() => {
            img.src = 'icons/copy.svg';
          }, 2000);
        }
      });
    }
  }

  // --- Exportar a PDF ---
  exportarPdfBtn.addEventListener('click', () => {
    if (!recortes.length) return;
    
    // Crear ventana nueva con el contenido de los recortes
    let html = `<html><head><title>${i18n[lang].recortesGuardados}</title><style>
      @media print {
        body { margin: 0; padding: 20px; }
        .page-break { page-break-before: always; }
      }
      
      body { 
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
        margin: 0; 
        padding: 40px; 
        color: #1f2937; 
        background: #ffffff;
        line-height: 1.6;
      }
      
      .header {
        text-align: center;
        margin-bottom: 40px;
        padding-bottom: 20px;
        border-bottom: 2px solid #e5e7eb;
      }
      
      h1 { 
        color: #1f2937; 
        font-size: 2.5em;
        font-weight: 700;
        margin: 0 0 10px 0;
        letter-spacing: -0.025em;
      }
      
      .subtitle {
        color: #6b7280;
        font-size: 1.1em;
        font-weight: 400;
        margin: 0;
      }
      
      .recorte { 
        margin-bottom: 32px; 
        padding: 24px;
        border: 1px solid #e5e7eb;
        border-radius: 12px;
        background: #fafafa;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }
      
      .recorte h2 { 
        color: #2563eb; 
        font-size: 1.4em;
        font-weight: 600;
        margin: 0 0 16px 0;
        padding-bottom: 8px;
        border-bottom: 1px solid #e5e7eb;
      }
      
      .field {
        margin-bottom: 12px;
        display: flex;
        align-items: flex-start;
      }
      
      .field-label {
        font-weight: 600;
        color: #374151;
        min-width: 80px;
        margin-right: 12px;
        font-size: 0.9em;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
      
      .field-content {
        flex: 1;
        color: #1f2937;
        word-wrap: break-word;
      }
      
      .field-content a {
        color: #2563eb;
        text-decoration: none;
      }
      
      .field-content a:hover {
        text-decoration: underline;
      }
      
      .badge-etiqueta { 
        background: #dbeafe; 
        color: #1e40af; 
        border-radius: 6px; 
        font-size: 0.85em; 
        padding: 4px 10px; 
        margin-left: 8px;
        font-weight: 500;
        display: inline-block;
      }
      
      .metadata {
        margin-top: 16px;
        padding-top: 12px;
        border-top: 1px solid #e5e7eb;
        font-size: 0.85em;
        color: #6b7280;
      }
      
      .metadata .field {
        margin-bottom: 6px;
      }
      
      .metadata .field-label {
        min-width: 60px;
        font-size: 0.8em;
      }
    </style></head><body>`;
    
    // Header con título y fecha de exportación
    const fechaExportacion = new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString();
    
    // Texto del subtítulo según el idioma
    const subtitleText = {
      es: `${recortes.length} ${recortes.length === 1 ? 'recorte' : 'recortes'} • Exportado el ${fechaExportacion}`,
      en: `${recortes.length} ${recortes.length === 1 ? 'snippet' : 'snippets'} • Exported on ${fechaExportacion}`,
      it: `${recortes.length} ${recortes.length === 1 ? 'ritaglio' : 'ritagli'} • Esportato il ${fechaExportacion}`,
      fr: `${recortes.length} ${recortes.length === 1 ? 'extrait' : 'extraits'} • Exporté le ${fechaExportacion}`,
      de: `${recortes.length} ${recortes.length === 1 ? 'Ausschnitt' : 'Ausschnitte'} • Exportiert am ${fechaExportacion}`
    };
    
    html += `
      <div class="header">
        <h1>${i18n[lang].recortesGuardados}</h1>
        <p class="subtitle">${subtitleText[lang] || subtitleText.en}</p>
      </div>
    `;
    
    // Contenido de los recortes
    recortes.forEach((r, i) => {
      html += `<div class='recorte'>`;
      html += `<h2>${i18n[lang].recorte(i+1)}</h2>`;
      
      // Título primero (si existe)
      if (r.nota) {
        html += `<div class='field'><span class='field-label'>${i18n[lang].nota}:</span><span class='field-content'>${r.nota}</span></div>`;
      }
      
      // Luego el texto
      html += `<div class='field'><span class='field-label'>${i18n[lang].texto}:</span><span class='field-content'>${r.texto}</span></div>`;
      
      // URL
      html += `<div class='field'><span class='field-label'>${i18n[lang].url}:</span><span class='field-content'><a href='${r.url}'>${r.url}</a></span></div>`;
      
      // Metadata (etiqueta y fecha)
      html += `<div class='metadata'>`;
      if (r.etiqueta) {
        html += `<div class='field'><span class='field-label'>${i18n[lang].etiqueta}:</span><span class='field-content'><span class='badge-etiqueta'>${r.etiqueta}</span></span></div>`;
      }
      html += `<div class='field'><span class='field-label'>${i18n[lang].fecha}:</span><span class='field-content'>${nuevaFecha(r.fecha)}</span></div>`;
      html += `</div>`;
      
      html += `</div>`;
    });
    
    html += '</body></html>';
    
    const win = window.open('', '_blank');
    win.document.write(html);
    win.document.close();
    win.focus();
    win.print();
  });

  // --- Botón de donación ---
  donacionBtnFinal.addEventListener('click', () => {
    window.open('https://coff.ee/freeextensions', '_blank');
  });



  // --- Botón eliminar todo ---
  eliminarTodoBtn.addEventListener('click', () => {
    mostrarConfirmacionEliminarTodo();
  });

  // --- Formatear fecha ---
  function nuevaFecha(fechaISO) {
    const d = new Date(fechaISO);
    return d.toLocaleString();
  }

  cargarRecortesYTotal();

  // --- Alternar pin de recorte ---
  function alternarPinRecorte(idx) {
    chrome.storage.local.get({recortes: []}, data => {
      const recortes = data.recortes;
      if (!recortes[idx]) return;
      recortes[idx].pinned = !recortes[idx].pinned;
      // Mover el recorte pinneado al inicio, o despinneado a su lugar original
      if (recortes[idx].pinned) {
        const [item] = recortes.splice(idx, 1);
        recortes.unshift(item);
      } else {
        // Si se despinnea, simplemente reordenar: pinneados primero, luego el resto
        recortes.sort((a, b) => (b.pinned === true) - (a.pinned === true));
      }
      chrome.storage.local.set({recortes}, () => {
        // Refrescar la UI sin recargar la página
        cargarRecortesYTotal();
      });
    });
  }

  // --- Compartir recorte ---
  function compartirRecorte(recorte) {
    // Solo compartir el texto del snippet, sin etiquetas ni URL
    let texto = recorte.texto;
    if (recorte.nota) texto += `\n\n📝 ${recorte.nota}`;
    
    const urlWhatsapp = `https://wa.me/?text=${encodeURIComponent(texto)}`;
    const urlGmail = `https://mail.google.com/mail/?view=cm&fs=1&body=${encodeURIComponent(texto)}`;
    const urlTelegram = `https://t.me/share/url?url=${encodeURIComponent(recorte.url)}&text=${encodeURIComponent(texto)}`;
    const urlX = `https://twitter.com/intent/tweet?text=${encodeURIComponent(recorte.texto.substring(0, 280))}`;
    
    const menu = document.createElement('div');
    menu.className = 'menu-compartir';
    menu.innerHTML = `
      <button class="opcion-whatsapp" title="Compartir por WhatsApp"><img src="icons/whatsapp-icon.svg" alt="WhatsApp" style="width:24px;height:24px;vertical-align:middle;"></button>
      <button class="opcion-gmail" title="Compartir por Gmail"><img src="icons/Gmail_icon_(2020).svg" alt="Gmail" style="width:24px;height:24px;vertical-align:middle;"></button>
      <button class="opcion-telegram" title="Compartir por Telegram"><img src="icons/Telegram_logo.svg" alt="Telegram" style="width:24px;height:24px;vertical-align:middle;"></button>
      <button class="opcion-x" title="Compartir en X"><img src="icons/X_logo_2023.svg" alt="X" style="width:24px;height:24px;vertical-align:middle;"></button>
    `;
    document.body.appendChild(menu);
    menu.style.position = 'fixed';
    menu.style.top = '50%';
    menu.style.left = '50%';
    menu.style.transform = 'translate(-50%, -50%)';
    menu.style.zIndex = 9999;
    menu.querySelector('.opcion-whatsapp').onclick = () => {
      window.open(urlWhatsapp, '_blank');
      menu.remove();
      document.removeEventListener('mousedown', handleClickOutside);
    };
    menu.querySelector('.opcion-gmail').onclick = () => {
      window.open(urlGmail, '_blank');
      menu.remove();
      document.removeEventListener('mousedown', handleClickOutside);
    };
    menu.querySelector('.opcion-telegram').onclick = () => {
      window.open(urlTelegram, '_blank');
      menu.remove();
      document.removeEventListener('mousedown', handleClickOutside);
    };
    menu.querySelector('.opcion-x').onclick = () => {
      window.open(urlX, '_blank');
      menu.remove();
      document.removeEventListener('mousedown', handleClickOutside);
    };
    // Cerrar menú al hacer clic fuera
    function handleClickOutside(e) {
      if (!menu.contains(e.target)) {
        menu.remove();
        document.removeEventListener('mousedown', handleClickOutside);
      }
    }
    setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 0);
  }

  // --- Mostrar confirmación de eliminación ---
  function mostrarConfirmacionEliminar(idx) {
    // Si ya hay un popup, no crear otro
    if (document.querySelector('.popup-confirmar-eliminar')) return;
    const overlay = document.createElement('div');
    overlay.className = 'popup-confirmar-eliminar-overlay';
    overlay.innerHTML = `
      <div class="popup-confirmar-eliminar">
        <p>${i18n[lang].confirmarEliminar}</p>
        <div class="popup-confirmar-eliminar-acciones">
          <button class="btn-confirmar">${i18n[lang].confirmar}</button>
          <button class="btn-cancelar">${i18n[lang].cancelar}</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    overlay.querySelector('.btn-confirmar').onclick = () => {
      eliminarRecorte(idx);
      overlay.remove();
    };
    overlay.querySelector('.btn-cancelar').onclick = () => {
      overlay.remove();
    };
    // Cerrar con ESC
    function handleKey(e) {
      if (e.key === 'Escape') {
        overlay.remove();
        document.removeEventListener('keydown', handleKey);
      }
    }
    document.addEventListener('keydown', handleKey);
  }

  // --- Mostrar confirmación de eliminar todo ---
  function mostrarConfirmacionEliminarTodo() {
    // Si ya hay un popup, no crear otro
    if (document.querySelector('.popup-confirmar-eliminar')) return;
    const overlay = document.createElement('div');
    overlay.className = 'popup-confirmar-eliminar-overlay';
    overlay.innerHTML = `
      <div class="popup-confirmar-eliminar">
        <p>${i18n[lang].confirmarEliminarTodo}</p>
        <div class="popup-confirmar-eliminar-acciones">
          <button class="btn-confirmar">${i18n[lang].confirmar}</button>
          <button class="btn-cancelar">${i18n[lang].cancelar}</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    overlay.querySelector('.btn-confirmar').onclick = () => {
      eliminarTodosLosRecortes();
      overlay.remove();
    };
    overlay.querySelector('.btn-cancelar').onclick = () => {
      overlay.remove();
    };
    // Cerrar con ESC
    function handleKey(e) {
      if (e.key === 'Escape') {
        overlay.remove();
        document.removeEventListener('keydown', handleKey);
      }
    }
    document.addEventListener('keydown', handleKey);
  }

  // --- Eliminar todos los recortes ---
  function eliminarTodosLosRecortes() {
    recortes = [];
    chrome.storage.local.set({recortes: [], totalSaved: 0}, () => {
      cargarRecortesYTotal();
    });
  }


});