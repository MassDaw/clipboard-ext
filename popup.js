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
    chrome.storage.local.get({recortes: [], totalSaved: 0}, (data) => {
      recortes = data.recortes;
      mostrarRecortes();
      totalRecortesDiv.textContent = `Has guardado ${data.totalSaved} recortes`;
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
          <a href="${recorte.url}" target="_blank" title="Ir a la página">🌐</a>
          <span class="fecha">${nuevaFecha(recorte.fecha)}</span>
          ${recorte.etiqueta ? `<span class="badge-etiqueta">${recorte.etiqueta}</span>` : ''}
          <button class="btn-copiar" title="Copiar recorte" data-idx="${idx}">📋</button>
          <button class="eliminar" title="Eliminar" data-idx="${idx}">🗑️</button>
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
    let texto = `Texto: ${recorte.texto}\n`;
    if (recorte.nota) texto += `Nota: ${recorte.nota}\n`;
    texto += `URL: ${recorte.url}\n`;
    if (recorte.etiqueta) texto += `Etiqueta: ${recorte.etiqueta}\n`;
    navigator.clipboard.writeText(texto).then(() => {
      const msg = document.createElement('span');
      msg.className = 'copiado-msg';
      msg.textContent = 'Copiado';
      btn.parentNode.appendChild(msg);
      setTimeout(() => msg.remove(), 1200);
    });
  }

  // --- Exportar a PDF ---
  exportarPdfBtn.addEventListener('click', () => {
    if (!recortes.length) return;
    // Crear ventana nueva con el contenido de los recortes
    let html = `<html><head><title>Recortes guardados</title><style>
      body { font-family: system-ui, sans-serif; margin: 30px; color: #222; }
      h1 { color: #2563eb; }
      .recorte { margin-bottom: 18px; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px; }
      .badge-etiqueta { background: #f1f5f9; color: #2563eb; border-radius: 4px; font-size: 0.95em; padding: 2px 8px; margin-left: 4px; }
    </style></head><body>`;
    html += '<h1>Recortes guardados</h1>';
    recortes.forEach((r, i) => {
      html += `<div class='recorte'><h2>Recorte ${i+1}</h2>`;
      html += `<div><b>Texto:</b> ${r.texto}</div>`;
      if (r.nota) html += `<div><b>Nota:</b> ${r.nota}</div>`;
      html += `<div><b>URL:</b> <a href='${r.url}'>${r.url}</a></div>`;
      if (r.etiqueta) html += `<span class='badge-etiqueta'>${r.etiqueta}</span>`;
      html += `<div><b>Fecha:</b> ${nuevaFecha(r.fecha)}</div></div>`;
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