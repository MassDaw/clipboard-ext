// content.js
// Recibe mensaje del background, solicita nota y envía recorte

// Escuchar mensajes del background
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "solicitarNota") {
    // Mostrar prompt para nota opcional
    const nota = prompt("Agrega una nota para este recorte (opcional):", "");
    // Mostrar prompt para etiqueta opcional
    const etiqueta = prompt("Agrega una etiqueta para este recorte (opcional, ej: trabajo, ideas):", "");
    // Enviar recorte al background
    chrome.runtime.sendMessage({
      action: "guardarRecorte",
      texto: message.texto,
      url: message.url,
      nota: nota,
      etiqueta: etiqueta
    });
  }
}); 