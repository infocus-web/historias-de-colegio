import React, { useState } from 'react';
import { 
  X, FileSpreadsheet, Download, Copy, Check, ExternalLink, 
  Table, Info, FileText, CheckCircle2 
} from 'lucide-react';
import { 
  descargarLibroExcel, 
  descargarCSV, 
  copiarTablaAlPortapapeles,
  generarExcelBlob,
  generarExcelDataUri
} from '../services/excelDownloadHelper';
import * as XLSX from 'xlsx';

interface ModalPlanillaExcelLabProps {
  isOpen: boolean;
  onClose: () => void;
  datosPlanilla: Record<string, unknown>[];
  nombreColegio: string;
  cursoFiltro: string;
}

export default function ModalPlanillaExcelLab({
  isOpen,
  onClose,
  datosPlanilla,
  nombreColegio,
  cursoFiltro
}: ModalPlanillaExcelLabProps) {
  const [copiado, setCopiado] = useState(false);
  const [descargaExitosaMsg, setDescargaExitosaMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const nombreArchivoBase = `PLANILLA_LABORATORIO_${nombreColegio.replace(/\s+/g, '_')}_${cursoFiltro}`;
  const nombreArchivoXlsx = `${nombreArchivoBase}.xlsx`;
  const nombreArchivoCsv = `${nombreArchivoBase}.csv`;

  // Pre-generar un libro XLSX de SheetJS
  const construirWorkbook = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(datosPlanilla);
    ws['!cols'] = [
      { wch: 5 },   // N°
      { wch: 18 },  // ID Pedido
      { wch: 16 },  // Fecha
      { wch: 30 },  // Código Cliente (Archivo Minilab)
      { wch: 22 },  // Curso / Sala
      { wch: 12 },  // Turno
      { wch: 26 },  // Alumno
      { wch: 10 },  // N° Lista
      { wch: 22 },  // Tutor Responsable
      { wch: 16 },  // Teléfono
      { wch: 26 },  // Email
      { wch: 24 },  // Kit Contratado
      { wch: 15 },  // Cantidad Fotos
      { wch: 45 },  // Archivos a Imprimir
      { wch: 14 },  // Estado Pago
      { wch: 15 },  // Importe Total
      { wch: 26 },  // Ubicación 15x21
      { wch: 26 }   // Ubicación 20x30
    ];
    XLSX.utils.book_append_sheet(wb, ws, 'Planilla de Control');
    return wb;
  };

  const handleDescargarXLSX = () => {
    const wb = construirWorkbook();
    const ok = descargarLibroExcel(wb, nombreArchivoXlsx);
    if (ok) {
      setDescargaExitosaMsg('¡Archivo Excel (.XLSX) descargado!');
      setTimeout(() => setDescargaExitosaMsg(null), 3500);
    }
  };

  const handleDescargarCSV = () => {
    const ok = descargarCSV(datosPlanilla, nombreArchivoCsv);
    if (ok) {
      setDescargaExitosaMsg('¡Archivo CSV para Excel descargado!');
      setTimeout(() => setDescargaExitosaMsg(null), 3500);
    }
  };

  const handleCopiarTabla = async () => {
    const ok = await copiarTablaAlPortapapeles(datosPlanilla);
    if (ok) {
      setCopiado(true);
      setTimeout(() => setCopiado(false), 3500);
    }
  };

  const handleAbrirEnNuevaPestana = () => {
    window.open(window.location.href, '_blank', 'noopener,noreferrer');
  };

  // Generar data URI directo para el link <a> nativo
  let dataUriDirecta = '';
  try {
    const wb = construirWorkbook();
    dataUriDirecta = generarExcelDataUri(wb);
  } catch {
    // ignore
  }

  const columnas = datosPlanilla.length > 0 ? Object.keys(datosPlanilla[0]) : [];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-slate-100 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 bg-slate-800/80 border-b border-slate-700 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white font-['Outfit'] flex items-center gap-2">
                <span>Planilla de Control para Laboratorio & Minilab</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {datosPlanilla.length} {datosPlanilla.length === 1 ? 'pedido' : 'pedidos'}
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Exportación compatible con Microsoft Excel, Google Sheets y sistemas de revelado.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback Messages */}
        {descargaExitosaMsg && (
          <div className="px-6 py-2.5 bg-emerald-500/20 border-b border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{descargaExitosaMsg}</span>
          </div>
        )}

        {copiado && (
          <div className="px-6 py-2.5 bg-amber-500/20 border-b border-amber-500/30 text-amber-300 text-xs flex items-center gap-2 font-medium">
            <Check className="w-4 h-4 text-amber-400 shrink-0" />
            <span>¡Tabla completa copiada al portapapeles! Abrí Microsoft Excel y presioná <strong>Ctrl + V</strong> (o Cmd + V) para pegar todas las columnas.</span>
          </div>
        )}

        {/* Action Toolbar */}
        <div className="p-4 bg-slate-950/60 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            
            {/* Opción 1: Enlace nativo <a> con Data URI (funciona incluso si el iframe bloquea Blob) */}
            {dataUriDirecta ? (
              <a
                href={dataUriDirecta}
                download={nombreArchivoXlsx}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-emerald-600/20 flex items-center gap-2 cursor-pointer active:scale-95"
                title="Descargar archivo nativo .XLSX"
              >
                <Download className="w-4 h-4" />
                <span>Descargar Excel (.XLSX)</span>
              </a>
            ) : (
              <button
                onClick={handleDescargarXLSX}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-emerald-600/20 flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>Descargar Excel (.XLSX)</span>
              </button>
            )}

            {/* Opción 2: Descargar CSV */}
            <button
              onClick={handleDescargarCSV}
              className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs rounded-xl border border-slate-700 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
              title="Descarga en formato CSV delimitado por ';' con codificación UTF-8 compatible con Excel"
            >
              <FileText className="w-4 h-4 text-sky-400" />
              <span>Descargar CSV (Excel)</span>
            </button>

            {/* Opción 3: Copiar tabla al portapapeles */}
            <button
              onClick={handleCopiarTabla}
              className="px-3.5 py-2.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-xs rounded-xl border border-amber-500/40 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
              title="Copia todas las filas para pegar directamente en Excel con Ctrl+V"
            >
              <Copy className="w-4 h-4 text-amber-400" />
              <span>Copiar para pegar en Excel (Ctrl + V)</span>
            </button>
          </div>

          {/* Opción 4: Abrir en pestaña nueva si el iframe bloquea descargas */}
          <button
            onClick={handleAbrirEnNuevaPestana}
            className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Abre la aplicación en una pestaña nueva limpia sin restricciones de iframe"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Abrir en pestaña nueva</span>
          </button>
        </div>

        {/* Info notice */}
        <div className="px-5 py-2.5 bg-slate-800/40 border-b border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
          <Info className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>
            Si tu navegador o el visor dentro del entorno bloquea la descarga automática de archivos, hacé clic en <strong>"Copiar para pegar en Excel"</strong> y luego presioná <strong>Ctrl+V</strong> en una planilla vacía de Excel o Google Sheets.
          </span>
        </div>

        {/* Interactive Data Table Preview */}
        <div className="flex-1 overflow-auto p-4 bg-slate-950/40">
          <div className="border border-slate-800 rounded-xl overflow-hidden shadow-inner">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-800/90 text-slate-300 uppercase text-[10px] tracking-wider font-extrabold sticky top-0 z-10 border-b border-slate-700">
                  <th className="py-2.5 px-3 whitespace-nowrap">N°</th>
                  <th className="py-2.5 px-3 whitespace-nowrap">Código Minilab</th>
                  <th className="py-2.5 px-3 whitespace-nowrap">Alumno</th>
                  <th className="py-2.5 px-3 whitespace-nowrap">Curso / Sala</th>
                  <th className="py-2.5 px-3 whitespace-nowrap">Kit</th>
                  <th className="py-2.5 px-3 whitespace-nowrap">Archivos Lab</th>
                  <th className="py-2.5 px-3 whitespace-nowrap">Pago</th>
                  <th className="py-2.5 px-3 whitespace-nowrap">Importe</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                {datosPlanilla.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-2 px-3 text-slate-400">{String(row['N°'] || idx + 1)}</td>
                    <td className="py-2 px-3 text-amber-300 font-bold font-mono">
                      {String(row['Código Cliente (Archivo Minilab)'] || '')}
                    </td>
                    <td className="py-2 px-3 text-slate-200 font-sans font-semibold">
                      {String(row['Alumno'] || '')}
                    </td>
                    <td className="py-2 px-3 text-slate-300 font-sans">
                      {String(row['Curso / Sala'] || '')}
                    </td>
                    <td className="py-2 px-3 text-slate-300 font-sans">
                      {String(row['Kit Contratado'] || '')}
                    </td>
                    <td className="py-2 px-3 text-sky-300">
                      {String(row['Archivos a Imprimir'] || '')}
                    </td>
                    <td className="py-2 px-3">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-sans font-bold ${
                        row['Estado Pago'] === 'APROBADO' 
                          ? 'bg-emerald-500/20 text-emerald-300' 
                          : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {String(row['Estado Pago'] || '')}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-emerald-400 font-sans font-bold">
                      {String(row['Importe Total'] || '')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Total a revelar: <strong className="text-white">{datosPlanilla.length} pedidos</strong>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
}
