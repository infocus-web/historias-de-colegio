import { useState, useMemo } from 'react';
import * as XLSX from 'xlsx';
import { 
  Printer, Download, Mail, CheckCircle2, FolderDown, FileCode, 
  Layers, Search, RefreshCw, FileText, Check, Sparkles, AlertCircle, FileSpreadsheet
} from 'lucide-react';
import { 
  PedidoEscolarCompleto, 
  descargarLoteLaboratorioZip, 
  guardarPedidosEnStorage 
} from '../services/pedidosLabService';
import { SECCIONES_INICIAL_2026 } from '../data/alumnosData';
import { CODIGOS_CURSOS_INICIALES } from '../data/codigosCursos';

interface AdminLaboratorioTabProps {
  pedidos: PedidoEscolarCompleto[];
  onActualizarPedidos: (pedidos: PedidoEscolarCompleto[]) => void;
  colegioNombre?: string;
}

export default function AdminLaboratorioTab({
  pedidos,
  onActualizarPedidos,
  colegioNombre = 'Colegio San Martín de Tours (Nivel Inicial)'
}: AdminLaboratorioTabProps) {
  const [cursoFiltro, setCursoFiltro] = useState<string>('todos');
  const [organizarEnSubcarpetas, setOrganizarEnSubcarpetas] = useState<boolean>(true);
  const [busquedaAlumno, setBusquedaAlumno] = useState<string>('');
  const [isDescargandoZip, setIsDescargandoZip] = useState<boolean>(false);
  const [zipFeedbackMsg, setZipFeedbackMsg] = useState<string | null>(null);
  const [emailFeedbackMsg, setEmailFeedbackMsg] = useState<string | null>(null);

  // Selected photo to preview backprint
  const [fotoPreviewDorso, setFotoPreviewDorso] = useState<{
    nombreArchivo: string;
    alumnoNombre: string;
    codigoCurso: string;
    tamano: string;
    tipo: string;
  }>({
    nombreArchivo: 'SALA3TM_01_ABBA_FAZIO_AGUSTIN_INDIVIDUAL_15x21.jpg',
    alumnoNombre: 'Abba Fazio, Agustín',
    codigoCurso: 'SALA3TM',
    tamano: '15x21 cm',
    tipo: 'Retrato Individual'
  });

  const pedidosAprobados = useMemo(() => {
    return pedidos.filter(p => p.estadoPago === 'aprobado');
  }, [pedidos]);

  const pedidosFiltrados = useMemo(() => {
    return pedidosAprobados.filter(p => {
      const matchCurso = cursoFiltro === 'todos' || p.cursoCodigo === cursoFiltro;
      const q = busquedaAlumno.toLowerCase().trim();
      const matchBusqueda = !q || 
        p.alumnoNombre.toLowerCase().includes(q) || 
        p.codigoAlumno.toLowerCase().includes(q) ||
        p.tutorEmail.toLowerCase().includes(q);
      return matchCurso && matchBusqueda;
    });
  }, [pedidosAprobados, cursoFiltro, busquedaAlumno]);

  // Statistics calculation
  const totalCopias15x21 = useMemo(() => {
    return pedidosFiltrados.reduce((acc, p) => {
      return acc + p.archivosParaLaboratorio.filter(a => a.tamanoImpresion === '15x21').length;
    }, 0);
  }, [pedidosFiltrados]);

  const totalCopias20x30 = useMemo(() => {
    return pedidosFiltrados.reduce((acc, p) => {
      return acc + p.archivosParaLaboratorio.filter(a => a.tamanoImpresion === '20x30').length;
    }, 0);
  }, [pedidosFiltrados]);

  // Handle ZIP batch download
  const handleDescargarLoteCompleto = async () => {
    if (pedidosFiltrados.length === 0) return;
    setIsDescargandoZip(true);
    setZipFeedbackMsg(null);

    try {
      const zipBlob = await descargarLoteLaboratorioZip(pedidos, {
        nombreColegio: colegioNombre,
        filtroCurso: cursoFiltro,
        organizarEnSubcarpetasPorAlumno: organizarEnSubcarpetas
      });

      // Trigger download
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      const nombreArchivoZip = `LABORATORIO_${cursoFiltro === 'todos' ? 'TODOS_LOS_CURSOS' : cursoFiltro}_${Date.now()}.zip`;
      a.download = nombreArchivoZip;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setZipFeedbackMsg(`¡Lote descargado exitosamente: ${nombreArchivoZip}! Todos los archivos están renombrados con el código de alumno.`);
      setTimeout(() => setZipFeedbackMsg(null), 6000);
    } catch (err) {
      console.error('Error generando lote ZIP:', err);
      setZipFeedbackMsg('Hubo un inconveniente al empaquetar el ZIP. Por favor reintentá.');
    } finally {
      setIsDescargandoZip(false);
    }
  };

  // Handle single student ZIP download
  const handleDescargarZipAlumno = async (pedido: PedidoEscolarCompleto) => {
    setIsDescargandoZip(true);
    try {
      const zipBlob = await descargarLoteLaboratorioZip([pedido], {
        nombreColegio: colegioNombre,
        filtroCurso: pedido.cursoCodigo,
        organizarEnSubcarpetasPorAlumno: false
      });
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${pedido.codigoAlumno}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setZipFeedbackMsg(`¡Fotos de ${pedido.alumnoNombre} descargadas con nombres para laboratorio!`);
      setTimeout(() => setZipFeedbackMsg(null), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsDescargandoZip(false);
    }
  };

  // Re-send HD photos link by email
  const handleExportarExcelLaboratorio = () => {
    const wb = XLSX.utils.book_new();
    const data = pedidosFiltrados.map((p, idx) => ({
      'N°': idx + 1,
      'ID Pedido': p.id,
      'Fecha': p.fecha,
      'Curso / Sala': p.seccionNombre,
      'Alumno': `${p.alumnoApellido}, ${p.alumnoNombre}`,
      'Tutor Responsable': p.tutorNombre,
      'Teléfono': p.tutorTelefono,
      'Email': p.tutorEmail,
      'Kit Contratado': p.kitNombre,
      'Cantidad Fotos': p.fotosSeleccionadas.length,
      'Estado Pago': p.estadoPago.toUpperCase(),
      'Importe Total': `$${p.total.toLocaleString('es-AR')}`,
      'Subcarpeta Lab': `${p.seccionId.toUpperCase()}/${String(idx + 1).padStart(2, '0')}_${p.alumnoApellido.replace(/\s+/g, '_').toUpperCase()}_${p.alumnoNombre.replace(/\s+/g, '_').toUpperCase()}`
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    ws['!cols'] = [
      { wch: 5 },
      { wch: 18 },
      { wch: 18 },
      { wch: 25 },
      { wch: 28 },
      { wch: 25 },
      { wch: 16 },
      { wch: 26 },
      { wch: 22 },
      { wch: 15 },
      { wch: 14 },
      { wch: 15 },
      { wch: 45 }
    ];
    XLSX.utils.book_append_sheet(wb, ws, 'Planilla de Control');
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CONTROL_REVELADO_${colegioNombre.replace(/\s+/g, '_')}_${cursoFiltro}.xlsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setZipFeedbackMsg('¡Planilla de control para laboratorio exportada a Excel (.XLSX)!');
    setTimeout(() => setZipFeedbackMsg(null), 3500);
  };

  const handleReenviarEmailHD = (pedido: PedidoEscolarCompleto) => {
    const ahora = new Date();
    const fechaHora = `${ahora.toLocaleDateString('es-AR')} ${ahora.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}`;
    
    const pedidosActualizados = pedidos.map(p => {
      if (p.id === pedido.id) {
        return {
          ...p,
          emailEnviado: true,
          fechaEnvioEmail: fechaHora
        };
      }
      return p;
    });

    onActualizarPedidos(pedidosActualizados);
    guardarPedidosEnStorage(pedidosActualizados);

    setEmailFeedbackMsg(`Enlace de descarga en Ultra HD reenviado con éxito a ${pedido.tutorEmail} (${pedido.alumnoNombre})`);
    setTimeout(() => setEmailFeedbackMsg(null), 5000);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Feedback Toast */}
      {zipFeedbackMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-950 rounded-2xl text-xs font-bold flex items-center justify-between gap-3 shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{zipFeedbackMsg}</span>
          </div>
          <button 
            onClick={() => setZipFeedbackMsg(null)}
            className="text-emerald-700 hover:text-emerald-900 text-xs px-2 py-1 rounded bg-emerald-100 cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      )}

      {emailFeedbackMsg && (
        <div className="p-4 bg-sky-50 border border-sky-300 text-sky-950 rounded-2xl text-xs font-bold flex items-center justify-between gap-3 shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <Mail className="w-5 h-5 text-sky-600 shrink-0" />
            <span>{emailFeedbackMsg}</span>
          </div>
          <button 
            onClick={() => setEmailFeedbackMsg(null)}
            className="text-sky-700 hover:text-sky-900 text-xs px-2 py-1 rounded bg-sky-100 cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      )}

      {/* Top Explanation Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-md space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-md shrink-0">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold font-['Outfit'] flex items-center gap-2">
                <span>Preparación Automatizada para Laboratorio & Minilab</span>
                <span className="text-[10px] uppercase tracking-wider font-bold bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-400/30">
                  Noritsu · Fuji · Klick
                </span>
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Al descargar el lote, el sistema organiza las carpetas por alumno y renombra cada archivo con su código escolar para que el minilab estampe el nombre en el dorso de la foto.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <button
              onClick={handleExportarExcelLaboratorio}
              disabled={pedidosFiltrados.length === 0}
              className="px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-extrabold text-xs rounded-xl transition-all shadow-md shadow-emerald-600/20 flex items-center gap-2 cursor-pointer active:scale-98"
              title="Descarga la planilla de control de pedidos para el laboratorio en formato Excel (.XLSX)"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-200" />
              <span>Planilla Excel (.XLSX)</span>
            </button>

            <button
              onClick={handleDescargarLoteCompleto}
              disabled={isDescargandoZip || pedidosFiltrados.length === 0}
              className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-slate-950 font-extrabold text-xs rounded-xl transition-all shadow-md shadow-amber-400/20 flex items-center gap-2 cursor-pointer active:scale-98"
            >
              {isDescargandoZip ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Generando ZIP del Lote...</span>
                </>
              ) : (
                <>
                  <FolderDown className="w-4 h-4 text-slate-950" />
                  <span>Descargar Lote para Laboratorio (.ZIP)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Packing & Options bar */}
        <div className="pt-3 border-t border-slate-700/80 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <label className="text-slate-300 font-semibold flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={organizarEnSubcarpetas}
                onChange={(e) => setOrganizarEnSubcarpetas(e.target.checked)}
                className="w-4 h-4 rounded text-amber-400 focus:ring-amber-400"
              />
              <span>Crear subcarpeta individual por cada alumno (ej: <code className="text-amber-300 bg-slate-950 px-1 py-0.5 rounded">SALA3TM/01_ABBA_FAZIO_AGUSTIN/</code>)</span>
            </label>
          </div>

          <span className="text-[11px] text-slate-400">
            Incluye planilla <code className="text-slate-200">00_PLANILLA_CONTROL_ENSOBRADO.txt</code> para mesa de empaque.
          </span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pedidos para Imprenta</span>
          <div className="text-xl font-extrabold text-slate-900 mt-1 font-['Outfit']">
            {pedidosFiltrados.length} <span className="text-xs font-normal text-slate-500">alumnos</span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ampliaciones 15x21 cm</span>
          <div className="text-xl font-extrabold text-indigo-600 mt-1 font-['Outfit']">
            {totalCopias15x21} <span className="text-xs font-normal text-slate-500">copias</span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Grupales 20x30 cm</span>
          <div className="text-xl font-extrabold text-emerald-600 mt-1 font-['Outfit']">
            {totalCopias20x30} <span className="text-xs font-normal text-slate-500">copias</span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Entregas HD por Email</span>
          <div className="text-xl font-extrabold text-amber-600 mt-1 font-['Outfit']">
            {pedidosFiltrados.filter(p => p.emailEnviado).length} / {pedidosFiltrados.length}
          </div>
        </div>
      </div>

      {/* Interactive Backprint Simulator (Visual Dorso del Papel Químico) */}
      <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-600" />
            <span className="text-xs font-bold text-amber-950 uppercase tracking-wider">
              Simulador del Dorso de Impresión Química (Backprint del Minilab)
            </span>
          </div>
          <span className="text-[11px] text-amber-800 font-medium">
            Hacé clic en cualquier foto abajo para inspeccionar cómo sale del laboratorio
          </span>
        </div>

        {/* Paper Back Graphic Card */}
        <div className="relative max-w-2xl mx-auto rounded-xl bg-gradient-to-b from-stone-100 to-stone-200 p-6 border-2 border-dashed border-stone-300 shadow-inner font-mono text-stone-700 select-none overflow-hidden">
          {/* Faint manufacturer paper pattern watermark */}
          <div className="absolute inset-0 opacity-15 pointer-events-none flex flex-wrap gap-8 items-center justify-center -rotate-12 text-[11px] font-bold tracking-widest text-stone-900">
            <span>FUJICOLOR CRYSTAL ARCHIVE</span>
            <span>KODAK ROYAL PAPER</span>
            <span>FUJICOLOR CRYSTAL ARCHIVE</span>
            <span>KODAK ROYAL PAPER</span>
          </div>

          {/* Minilab Inkjet dot matrix backprint stamping simulation */}
          <div className="relative z-10 space-y-2 bg-white/70 backdrop-blur-xs p-4 rounded-lg border border-stone-300">
            <div className="flex items-center justify-between text-[11px] text-stone-500 pb-1 border-b border-stone-200">
              <span>REVERSO DEL PAPEL FOTOGRÁFICO 260g</span>
              <span className="font-semibold text-emerald-700">NORITSU QSS-3701HD · LÍNEA 1</span>
            </div>

            <div className="py-2 px-3 bg-stone-900 text-emerald-400 rounded font-mono text-xs sm:text-sm font-black tracking-widest break-all shadow-inner border border-stone-800">
              &gt; {fotoPreviewDorso.nombreArchivo} &lt;
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-stone-600 pt-1">
              <span><strong>Alumno:</strong> {fotoPreviewDorso.alumnoNombre}</span>
              <span><strong>Toma:</strong> {fotoPreviewDorso.tipo} ({fotoPreviewDorso.tamano})</span>
              <span><strong>Curso:</strong> {fotoPreviewDorso.codigoCurso}</span>
            </div>
          </div>
        </div>

        <p className="text-[11px] text-amber-900 text-center">
          💡 <strong>Beneficio clave para el fotógrafo:</strong> Al salir las copias de la canasta del minilab, el operador o tú solo tienen que leer la inscripción del reverso para saber exactamente a qué alumno pertenece la foto y guardarla en su sobre conmemorativo sin confusiones.
        </p>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between pt-2">
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1">
          <button
            onClick={() => setCursoFiltro('todos')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              cursoFiltro === 'todos'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Todos los Cursos ({pedidosAprobados.length})
          </button>

          {SECCIONES_INICIAL_2026.slice(0, 5).map(sec => {
            const code = CODIGOS_CURSOS_INICIALES[sec.id] || sec.id;
            const count = pedidosAprobados.filter(p => p.cursoCodigo === code).length;
            return (
              <button
                key={sec.id}
                onClick={() => setCursoFiltro(code)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                  cursoFiltro === code
                    ? 'bg-amber-400 text-slate-950 shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {sec.nombreCompleto} ({count})
              </button>
            );
          })}
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-64 shrink-0">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={busquedaAlumno}
            onChange={(e) => setBusquedaAlumno(e.target.value)}
            placeholder="Buscar por alumno o código..."
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-400"
          />
        </div>
      </div>

      {/* Orders & Lab Files Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200 text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-3 w-12 text-center">N°</th>
                <th className="py-3 px-4">Alumno & Código Escolar</th>
                <th className="py-3 px-4">Curso & Turno</th>
                <th className="py-3 px-4">Archivos Asignados para Minilab</th>
                <th className="py-3 px-4">Entrega HD por Email</th>
                <th className="py-3 px-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pedidosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-400 space-y-2">
                    <AlertCircle className="w-6 h-6 mx-auto text-slate-300" />
                    <p className="text-xs">No se encontraron pedidos con los filtros aplicados.</p>
                  </td>
                </tr>
              ) : (
                pedidosFiltrados.map((pedido) => {
                  return (
                    <tr key={pedido.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-3 text-center font-mono font-bold text-slate-400">
                        #{String(pedido.alumnoNumeroLista).padStart(2, '0')}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 text-sm">
                          {pedido.alumnoNombre}
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="font-mono text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">
                            {pedido.codigoAlumno}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-800">{pedido.grado} "{pedido.division}"</span>
                        <span className="block text-[11px] text-slate-500">Turno {pedido.turno}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{pedido.cursoCodigo}</span>
                      </td>

                      {/* Photo files renamed for minilab */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1 max-w-md">
                          {pedido.archivosParaLaboratorio.map((archivo) => {
                            const isSelectedInPreview = fotoPreviewDorso.nombreArchivo === archivo.nombreArchivoLab;
                            return (
                              <button
                                key={archivo.id}
                                onClick={() => setFotoPreviewDorso({
                                  nombreArchivo: archivo.nombreArchivoLab,
                                  alumnoNombre: pedido.alumnoNombre,
                                  codigoCurso: pedido.cursoCodigo,
                                  tamano: archivo.tamanoImpresion,
                                  tipo: archivo.tipo === 'individual' ? 'Retrato Individual' : archivo.tipo === 'grupal' ? 'Foto Grupal' : 'Foto Docente'
                                })}
                                className={`w-full text-left p-1.5 rounded-lg border text-[11px] font-mono flex items-center justify-between gap-2 transition-all cursor-pointer ${
                                  isSelectedInPreview
                                    ? 'bg-amber-100 border-amber-400 text-amber-950 font-bold shadow-xs'
                                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                                }`}
                                title="Ver en simulador de dorso"
                              >
                                <div className="flex items-center gap-1.5 truncate">
                                  <FileCode className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                  <span className="truncate">{archivo.nombreArchivoLab}</span>
                                </div>
                                <span className="text-[10px] uppercase font-bold text-slate-500 shrink-0 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                                  {archivo.tamanoImpresion}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </td>

                      {/* Parent Email and HD delivery status */}
                      <td className="py-3.5 px-4">
                        <div className="text-xs font-semibold text-slate-800 truncate max-w-[180px]" title={pedido.tutorEmail}>
                          {pedido.tutorEmail}
                        </div>
                        <span className="text-[11px] text-slate-500 block">{pedido.tutorNombre}</span>

                        <div className="mt-1 flex items-center gap-1">
                          {pedido.emailEnviado ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                              <Check className="w-3 h-3 text-emerald-600" />
                              HD Enviado ({pedido.fechaEnvioEmail ? pedido.fechaEnvioEmail.split(' ')[0] : 'OK'})
                            </span>
                          ) : (
                            <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                              Pendiente envío
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleDescargarZipAlumno(pedido)}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer"
                            title="Descargar ZIP renombrado de este alumno"
                          >
                            <Download className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleReenviarEmailHD(pedido)}
                            className="p-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 rounded-lg transition-colors cursor-pointer"
                            title={`Reenviar enlace Ultra HD por email a ${pedido.tutorEmail}`}
                          >
                            <Mail className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
