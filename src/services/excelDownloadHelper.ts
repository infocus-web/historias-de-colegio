import * as XLSX from 'xlsx';

/**
 * Descarga de manera segura un Blob en el navegador sin revocar inmediatamente la URL,
 * previniendo que Chrome, Edge, Safari o navegadores dentro de iframes cancelen la descarga.
 */
export function descargarBlobSeguro(blob: Blob, nombreArchivo: string): void {
  try {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = nombreArchivo;
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();

    // Retardo de 60 segundos antes de revocar para permitir que el gestor de descargas
    // del navegador complete el stream del archivo
    setTimeout(() => {
      try {
        if (document.body.contains(a)) {
          document.body.removeChild(a);
        }
        URL.revokeObjectURL(url);
      } catch {
        // Ignorar si el elemento ya fue removido
      }
    }, 60000);
  } catch (err) {
    console.error('Error descargando blob:', err);
  }
}

/**
 * Descarga de manera robusta un libro de Excel (.XLSX) con soporte para iframes y navegadores modernos.
 */
export function descargarLibroExcel(wb: XLSX.WorkBook, nombreArchivo: string): boolean {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return false;
  }

  const nombreFinal = nombreArchivo.endsWith('.xlsx') ? nombreArchivo : `${nombreArchivo}.xlsx`;

  // 1. Intentar con writeFile nativo de SheetJS
  try {
    XLSX.writeFile(wb, nombreFinal);
    return true;
  } catch (errWrite) {
    console.warn('XLSX.writeFile falló o está bloqueado por el entorno, intentando descarga con Blob binario:', errWrite);
  }

  // 2. Fallback robusto con Blob binario XLSX
  try {
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    descargarBlobSeguro(blob, nombreFinal);
    return true;
  } catch (errBlob) {
    console.error('Error generando blob de Excel:', errBlob);
    return false;
  }
}
