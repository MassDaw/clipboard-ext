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
  // Diccionario de traducciones
  const i18n = {
    es: {
      titulo: 'Recortes',
      total: recs => `Has guardado ${recs} recortes`,
      buscar: 'Buscar…',
      sinRecortes: 'No hay recortes guardados.',
      todasEtiquetas: 'Todas las etiquetas',
      exportarPdf: 'Exportar a PDF 🖨️',
      copiar: 'Copiar recorte',
      copiado: 'Copiado',
      eliminar: 'Eliminar',
      irPagina: 'Ir a la página',
      texto: 'Texto',
      nota: 'Nota',
      url: 'URL',
      etiqueta: 'Etiqueta',
      fecha: 'Fecha',
      recorte: i => `Recorte ${i}`,
      recortesGuardados: 'Recortes guardados',
      donacion: '¿Esta extensión te ha sido útil? ¡Invítame un café! ☕',
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
      nota: 'Note',
      url: 'URL',
      etiqueta: 'Tag',
      fecha: 'Date',
      recorte: i => `Clipping ${i}`,
      recortesGuardados: 'Saved clippings',
      donacion: 'Has this extension been useful? Buy me a coffee! ☕',
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
      nota: 'Nota',
      url: 'URL',
      etiqueta: 'Etichetta',
      fecha: 'Data',
      recorte: i => `Ritaglio ${i}`,
      recortesGuardados: 'Ritagli salvati',
      donacion: 'Questa estensione ti è stata utile? Offrimi un caffè! ☕',
    },
    fr: {
      titulo: 'Extraits',
      total: recs => `Vous avez enregistré ${recs} extraits`,
      buscar: 'Rechercher…',
      sinRecortes: 'Aucun extrait enregistré.',
      todasEtiquetas: 'Toutes les étiquettes',
      exportarPdf: 'Exporter en PDF 🖨️',
      copiar: 'Copier l’extrait',
      copiado: 'Copié',
      eliminar: 'Supprimer',
      irPagina: 'Aller à la page',
      texto: 'Texte',
      nota: 'Note',
      url: 'URL',
      etiqueta: 'Étiquette',
      fecha: 'Date',
      recorte: i => `Extrait ${i}`,
      recortesGuardados: 'Extraits enregistrés',
      donacion: 'Cette extension vous a été utile ? Offrez-moi un café ! ☕',
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
      nota: 'Notiz',
      url: 'URL',
      etiqueta: 'Tag',
      fecha: 'Datum',
      recorte: i => `Ausschnitt ${i}`,
      recortesGuardados: 'Gespeicherte Ausschnitte',
      donacion: 'War diese Erweiterung nützlich? Spendier mir einen Kaffee! ☕',
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
    // Títulos y botones de recortes
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
      const fecha = li.querySelector('.fecha');
      if (fecha && recortes[idx]) fecha.textContent = nuevaFecha(recortes[idx].fecha);
    });
  }

  let recortes = [];
  let filtro = '';
  let etiquetaSeleccionada = '';

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
        <div class="texto">${recorte.texto}</div>
        <div class="nota">${recorte.nota ? '📝 ' + recorte.nota : ''}</div>
        <div class="meta">
          <a href="${recorte.url}" target="_blank" title="${i18n[lang].irPagina}">🌐</a>
          <span class="fecha">${nuevaFecha(recorte.fecha)}</span>
          ${recorte.etiqueta ? `<span class="badge-etiqueta">${recorte.etiqueta}</span>` : ''}
          <button class="btn-copiar" title="${i18n[lang].copiar}" data-idx="${idx}">📋</button>
          <button class="eliminar" title="${i18n[lang].eliminar}" data-idx="${idx}">🗑️</button>
        </div>
      `;
      // Expandir/colapsar texto
      const textoDiv = li.querySelector('.texto');
      textoDiv.addEventListener('click', () => {
        textoDiv.classList.toggle('expandido');
      });
      // Copiar recorte
      const copiarBtn = li.querySelector('.btn-copiar');
      copiarBtn.addEventListener('click', () => {
        copiarRecorte(recorte, copiarBtn);
      });
      // Eliminar recorte
      const eliminarBtn = li.querySelector('.eliminar');
      eliminarBtn.addEventListener('click', () => {
        eliminarRecorte(idx);
      });
      lista.appendChild(li);
    });
    traducirUI();
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
    const etiquetas = Array.from(new Set(recortes.map(r => r.etiqueta).filter(Boolean)));
    filtroEtiqueta.innerHTML = '<option value="">Todas las etiquetas</option>' + etiquetas.map(et => `<option value="${et}">${et}</option>`).join('');
  }

  // --- Eliminar recorte ---
  function eliminarRecorte(idx) {
    recortes.splice(idx, 1);
    chrome.storage.local.set({recortes}, cargarRecortesYTotal);
  }

  // --- Copiar recorte al portapapeles ---
  function copiarRecorte(recorte, btn) {
    let texto = `${i18n[lang].texto}: ${recorte.texto}\n`;
    if (recorte.nota) texto += `${i18n[lang].nota}: ${recorte.nota}\n`;
    texto += `${i18n[lang].url}: ${recorte.url}\n`;
    if (recorte.etiqueta) texto += `${i18n[lang].etiqueta}: ${recorte.etiqueta}\n`;
    navigator.clipboard.writeText(texto).then(() => {
      const msg = document.createElement('span');
      msg.className = 'copiado-msg';
      msg.textContent = i18n[lang].copiado;
      btn.parentNode.appendChild(msg);
      setTimeout(() => msg.remove(), 1200);
    });
  }

  // --- Exportar a PDF ---
  exportarPdfBtn.addEventListener('click', () => {
    if (!recortes.length) return;
    // Crear ventana nueva con el contenido de los recortes
    let html = `<html><head><title>${i18n[lang].recortesGuardados}</title><style>
      body { font-family: system-ui, sans-serif; margin: 30px; color: #222; }
      h1 { color: #2563eb; }
      .recorte { margin-bottom: 18px; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px; }
      .badge-etiqueta { background: #f1f5f9; color: #2563eb; border-radius: 4px; font-size: 0.95em; padding: 2px 8px; margin-left: 4px; }
    </style></head><body>`;
    html += `<h1>${i18n[lang].recortesGuardados}</h1>`;
    recortes.forEach((r, i) => {
      html += `<div class='recorte'><h2>${i18n[lang].recorte(i+1)}</h2>`;
      html += `<div><b>${i18n[lang].texto}:</b> ${r.texto}</div>`;
      if (r.nota) html += `<div><b>${i18n[lang].nota}:</b> ${r.nota}</div>`;
      html += `<div><b>${i18n[lang].url}:</b> <a href='${r.url}'>${r.url}</a></div>`;
      if (r.etiqueta) html += `<span class='badge-etiqueta'>${i18n[lang].etiqueta}: ${r.etiqueta}</span>`;
      html += `<div><b>${i18n[lang].fecha}:</b> ${nuevaFecha(r.fecha)}</div></div>`;
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

  // --- Formatear fecha ---
  function nuevaFecha(fechaISO) {
    const d = new Date(fechaISO);
    return d.toLocaleString();
  }

  cargarRecortesYTotal();
}); 
