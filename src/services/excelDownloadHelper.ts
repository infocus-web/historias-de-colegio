import * as XLSX from 'xlsx';

/**
 * Descarga de manera segura un Blob en el navegador sin revocar inmediatamente la URL,
 * previniendo que Chrome, Edge, Safari o navegadores dentro de iframes cancelen la descarga.
 */
export function descargarBlobSeguro(blob: Blob, nombreArchivo: string): boolean {
  try {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = nombreArchivo;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);

    // Disparar click de manera confiable
    try {
      a.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
    } catch {
      a.click();
    }

    // Retardo de 60 segundos antes de remover el nodo y revocar la URL
    setTimeout(() => {
      try {
        if (document.body.contains(a)) {
          document.body.removeChild(a);
        }
        URL.revokeObjectURL(url);
      } catch {
        // Ignorar si ya fue removido
      }
    }, 60000);

    return true;
  } catch (err) {
    console.error('Error en descargarBlobSeguro:', err);
    return false;
  }
}

/**
 * Genera un Blob XLSX nativo con el MIME-type exacto de Microsoft Excel
 */
export function generarExcelBlob(wb: XLSX.WorkBook): Blob {
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  return new Blob([wbout], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });
}

/**
 * Genera una Data URI en base64 para descarga directa en entornos con bloqueo de blob:
 */
export function generarExcelDataUri(wb: XLSX.WorkBook): string {
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'base64' });
  return `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${wbout}`;
}

/**
 * Descarga de manera robusta un libro de Excel (.XLSX) con soporte para iframes y navegadores modernos.
 */
export function descargarLibroExcel(wb: XLSX.WorkBook, nombreArchivo: string): boolean {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return false;
  }

  const nombreFinal = nombreArchivo.endsWith('.xlsx') ? nombreArchivo : `${nombreArchivo}.xlsx`;

  // 1. Descarga primaria: Blob nativo con MIME type exacto de OpenXML
  try {
    const blob = generarExcelBlob(wb);
    const ok = descargarBlobSeguro(blob, nombreFinal);
    if (ok) return true;
  } catch (errBlob) {
    console.warn('Error al descargar mediante Blob, intentando Data URI:', errBlob);
  }

  // 2. Respaldo secundario: Data URI en Base64
  try {
    const dataUri = generarExcelDataUri(wb);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = dataUri;
    a.download = nombreFinal;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      if (document.body.contains(a)) document.body.removeChild(a);
    }, 3000);
    return true;
  } catch (errUri) {
    console.error('Error al descargar mediante Data URI:', errUri);
  }

  // 3. Respaldo terciario: SheetJS writeFile
  try {
    XLSX.writeFile(wb, nombreFinal);
    return true;
  } catch (errWrite) {
    console.error('Error al descargar mediante XLSX.writeFile:', errWrite);
    return false;
  }
}

/**
 * Copia una tabla de registros al portapapeles con formato Tab-Separated (TSV).
 * Al abrir Microsoft Excel o Google Sheets y presionar Ctrl+V (o Cmd+V),
 * todos los datos se pegan organizados en columnas y filas con sus encabezados.
 */
export async function copiarTablaAlPortapapeles(filas: Record<string, unknown>[]): Promise<boolean> {
  if (!filas || filas.length === 0) return false;
  try {
    const headers = Object.keys(filas[0]);
    const lineas = [
      headers.join('\t'),
      ...filas.map(row =>
        headers.map(h => String(row[h] ?? '').replace(/[\t\r\n]+/g, ' ')).join('\t')
      )
    ];
    const tsvTexto = lineas.join('\r\n');

    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(tsvTexto);
      return true;
    } else {
      // Fallback con textarea temporal
      const textarea = document.createElement('textarea');
      textarea.value = tsvTexto;
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.select();
      const exito = document.execCommand('copy');
      document.body.removeChild(textarea);
      return exito;
    }
  } catch (err) {
    console.error('Error al copiar al portapapeles:', err);
    return false;
  }
}

/**
 * Exporta un listado de registros a formato CSV delimitado por punto y coma (;)
 * con marca BOM UTF-8 para apertura directa en Microsoft Excel en español de Windows y Mac.
 */
export function descargarCSV(filas: Record<string, unknown>[], nombreArchivo: string): boolean {
  if (!filas || filas.length === 0) return false;
  try {
    const headers = Object.keys(filas[0]);
    const lineas = [
      headers.map(h => `"${h}"`).join(';'),
      ...filas.map(row =>
        headers
          .map(h => `"${String(row[h] ?? '').replace(/"/g, '""')}"`)
          .join(';')
      )
    ];
    const csvContent = '\uFEFF' + lineas.join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const nombreFinal = nombreArchivo.endsWith('.csv') ? nombreArchivo : `${nombreArchivo}.csv`;
    return descargarBlobSeguro(blob, nombreFinal);
  } catch (err) {
    console.error('Error al exportar CSV:', err);
    return false;
  }
}
