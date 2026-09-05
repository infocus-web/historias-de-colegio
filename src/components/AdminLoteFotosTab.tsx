import React, { useState, useMemo } from 'react';
import { 
  Camera, Upload, CheckCircle2, HardDrive, 
  Trash2, RefreshCw, Key, ShieldCheck, Check
} from 'lucide-react';
import { COLEGIOS_EJEMPLO, FOTOS_MUESTRA } from '../data/colegiosData';
import { SECCIONES_INICIAL_2026 } from '../data/alumnosData';
import { CODIGOS_CURSOS_INICIALES } from '../data/codigosCursos';
import { 
  getSupabaseConfig, 
  saveSupabaseConfig, 
  isSupabaseConnected, 
  uploadFotoWeb, 
  uploadFotoHD 
} from '../services/supabaseClient';

interface FotoLoteItem {
  id: string;
  file?: File;
  previewUrl: string;
  watermarkedUrl: string;
  tipo: 'individual' | 'grupal' | 'docente';
  nombreOriginal: string;
  estado: 'procesada' | 'subiendo' | 'subida' | 'error';
}

export default function AdminLoteFotosTab() {
  const [cursoSeleccionado, setCursoSeleccionado] = useState<string>('SALA3TM');
  const [colegioSeleccionado, setColegioSeleccionado] = useState<string>(COLEGIOS_EJEMPLO[0].id);
  const [tipoFotoLote, setTipoFotoLote] = useState<'individual' | 'grupal' | 'docente'>('individual');
  const [fotosLote, setFotosLote] = useState<FotoLoteItem[]>(() => {
    return FOTOS_MUESTRA.slice(0, 6).map((f, idx) => ({
      id: `pre-foto-${idx}`,
      previewUrl: f.url,
      watermarkedUrl: f.thumbnail,
      tipo: f.categoria as any,
      nombreOriginal: `IMG_2026_CURSO_${idx + 1}.JPG`,
      estado: 'subida'
    }));
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Supabase keys management
  const supabaseConfig = getSupabaseConfig();
  const [anonKeyInput, setAnonKeyInput] = useState(supabaseConfig.anonKey);
  const [urlInput, setUrlInput] = useState(supabaseConfig.url);
  const [showConfigSupabase, setShowConfigSupabase] = useState(false);
  const [isConectado, setIsConectado] = useState(isSupabaseConnected());

  const seccionActual = useMemo(() => {
    return SECCIONES_INICIAL_2026.find(s => (CODIGOS_CURSOS_INICIALES[s.id] || s.id) === cursoSeleccionado) || SECCIONES_INICIAL_2026[0];
  }, [cursoSeleccionado]);

  const handleGuardarConfigSupabase = (e: React.FormEvent) => {
    e.preventDefault();
    saveSupabaseConfig(urlInput, anonKeyInput);
    setIsConectado(isSupabaseConnected());
    setStatusMessage('Configuración de Supabase Pro guardada exitosamente.');
    setShowConfigSupabase(false);
    setTimeout(() => setStatusMessage(null), 3000);
  };

  // Watermarking generator function
  const applyWatermarkToCanvas = (img: HTMLImageElement): string => {
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return img.src;

    ctx.drawImage(img, 0, 0);

    ctx.save();
    const text = 'MUESTRA INFOCUS SCHOOLS · FOTOGRAFÍA ESCOLAR';
    const fontSize = Math.max(16, Math.round(canvas.width * 0.04));
    ctx.font = `bold ${fontSize}px sans-serif`;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    ctx.shadowBlur = 6;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((-25 * Math.PI) / 180);

    const stepX = canvas.width * 0.45;
    const stepY = canvas.height * 0.22;
    for (let y = -canvas.height; y < canvas.height; y += stepY) {
      for (let x = -canvas.width; x < canvas.width; x += stepX) {
        ctx.fillText(text, x, y);
      }
    }
    ctx.restore();

    return canvas.toDataURL('image/jpeg', 0.85);
  };

  const handleFilesSelected = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsProcessing(true);

    const nuevosItems: FotoLoteItem[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const rawUrl = URL.createObjectURL(file);

      // Create watermark
      const watermarked = await new Promise<string>((resolve) => {
        const img = new Image();
        img.onload = () => {
          const wm = applyWatermarkToCanvas(img);
          resolve(wm);
        };
        img.onerror = () => resolve(rawUrl);
        img.src = rawUrl;
      });

      nuevosItems.push({
        id: `foto-${Date.now()}-${i}`,
        file,
        previewUrl: rawUrl,
        watermarkedUrl: watermarked,
        tipo: tipoFotoLote,
        nombreOriginal: file.name,
        estado: 'procesada'
      });
    }

    setFotosLote(prev => [...nuevosItems, ...prev]);
    setIsProcessing(false);
    setStatusMessage(`¡${files.length} fotos procesadas con marca de agua y asignadas al curso ${cursoSeleccionado}!`);
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const handleEliminarFoto = (id: string) => {
    setFotosLote(prev => prev.filter(f => f.id !== id));
  };

  const handleSubirASupabase = async () => {
    setIsProcessing(true);
    let subidas = 0;

    for (const foto of fotosLote) {
      if (foto.file && foto.estado !== 'subida') {
        const pathHD = `2026/${cursoSeleccionado}/originales/${foto.nombreOriginal}`;
        const pathWeb = `2026/${cursoSeleccionado}/muestras/${foto.nombreOriginal}`;

        // Upload HD to private bucket
        await uploadFotoHD(foto.file, pathHD);
        // Upload web preview
        await uploadFotoWeb(foto.file, pathWeb);

        foto.estado = 'subida';
        subidas++;
      }
    }

    setIsProcessing(false);
    setStatusMessage(`¡Fotos sincronizadas exitosamente en el almacenamiento Supabase Pro (100 GB)!`);
    setTimeout(() => setStatusMessage(null), 5000);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Toast Feedback */}
      {statusMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-950 rounded-2xl text-xs font-bold flex items-center justify-between gap-3 shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{statusMessage}</span>
          </div>
          <button 
            onClick={() => setStatusMessage(null)}
            className="text-emerald-700 hover:text-emerald-900 text-xs px-2 py-1 rounded bg-emerald-100 cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      )}

      {/* Supabase Pro 100 GB Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-400 text-slate-950 flex items-center justify-center font-bold shadow-md shrink-0">
            <HardDrive className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-black font-['Outfit']">Almacenamiento Supabase Pro (100 GB)</h4>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                isConectado 
                  ? 'bg-emerald-400/20 text-emerald-300 border-emerald-400/30'
                  : 'bg-amber-400/20 text-amber-300 border-amber-400/30'
              }`}>
                {isConectado ? 'PRO 100GB CONECTADO' : 'PRO 100GB CONFIGURABLE'}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Proyecto migrado: <code className="text-emerald-300 font-mono text-[11px]">ntkqypxvrljuihbxdrtx.supabase.co</code>
            </p>
            <div className="flex items-center gap-4 text-[11px] text-slate-400 mt-1">
              <span>🔒 <strong>fotos-hd</strong>: Originales en alta para laboratorio</span>
              <span>🌐 <strong>fotos-web</strong>: Muestras con marca de agua para padres</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setShowConfigSupabase(!showConfigSupabase)}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Key className="w-3.5 h-3.5 text-amber-400" />
            <span>{showConfigSupabase ? 'Ocultar Credenciales' : 'Configurar Anon Key'}</span>
          </button>
        </div>
      </div>

      {/* Supabase credentials drawer */}
      {showConfigSupabase && (
        <form onSubmit={handleGuardarConfigSupabase} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Credenciales de Conexión de Supabase Storage
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-700">Project URL</label>
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://ntkqypxvrljuihbxdrtx.supabase.co"
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 font-mono text-xs"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-700">Supabase Anon Key</label>
              <input
                type="text"
                value={anonKeyInput}
                onChange={(e) => setAnonKeyInput(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 font-mono text-xs"
              />
            </div>
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all shadow-xs cursor-pointer"
          >
            Guardar Configuración en el Navegador
          </button>
        </form>
      )}

      {/* Course & Batch Selection Controls */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <Camera className="w-4 h-4 text-amber-600" />
          <span>Carga Masiva de Fotos por Curso / Sesión</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Colegio</label>
            <select
              value={colegioSeleccionado}
              onChange={(e) => setColegioSeleccionado(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 font-medium"
            >
              {COLEGIOS_EJEMPLO.map(c => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Curso / Sección</label>
            <select
              value={cursoSeleccionado}
              onChange={(e) => setCursoSeleccionado(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 font-bold"
            >
              {SECCIONES_INICIAL_2026.map(sec => (
                <option key={sec.id} value={CODIGOS_CURSOS_INICIALES[sec.id] || sec.id}>
                  {sec.nombreCompleto} ({sec.totalAlumnos} alumnos)
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Categoría de la Toma</label>
            <select
              value={tipoFotoLote}
              onChange={(e) => setTipoFotoLote(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 font-medium"
            >
              <option value="individual">Retratos Individuales (15x21)</option>
              <option value="grupal">Foto Grupal del Curso (20x30)</option>
              <option value="docente">Foto con Docente / Seño (15x21)</option>
            </select>
          </div>
        </div>

        {/* Drag and Drop Zone */}
        <div className="relative border-2 border-dashed border-amber-300 hover:border-amber-400 bg-amber-50/50 hover:bg-amber-50/80 rounded-2xl p-8 text-center transition-all">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => handleFilesSelected(e.target.files)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="space-y-2 pointer-events-none">
            <div className="w-12 h-12 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center mx-auto shadow-md">
              <Upload className="w-6 h-6" />
            </div>
            <p className="text-sm font-extrabold text-slate-900">
              Arrastrá las fotos del curso aquí o hacé clic para seleccionar
            </p>
            <p className="text-xs text-slate-500">
              Podés subir 10, 30 o 50 fotos de una sola vez. El sistema les estampará automáticamente la marca de agua y las organizará para {seccionActual.nombreCompleto}.
            </p>
          </div>
        </div>
      </div>

      {/* Gallery of Uploaded Photos for this Course */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-slate-900">
              Fotos Disponibles para el Curso ({fotosLote.length})
            </h4>
            <span className="text-[11px] text-slate-500">
              Estas fotos son las que verán los padres al ingresar el código {cursoSeleccionado}
            </span>
          </div>

          <button
            onClick={handleSubirASupabase}
            disabled={isProcessing || fotosLote.length === 0}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Sincronizando con Supabase...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Sincronizar Lote con Supabase Pro</span>
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {fotosLote.map((foto) => (
            <div 
              key={foto.id}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs group relative"
            >
              <div className="relative aspect-4/3 bg-black overflow-hidden">
                <img 
                  src={foto.watermarkedUrl} 
                  alt={foto.nombreOriginal}
                  className="w-full h-full object-cover" 
                />
                <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-950/80 text-amber-300 uppercase">
                  {foto.tipo}
                </span>

                <button
                  type="button"
                  onClick={() => handleEliminarFoto(foto.id)}
                  className="absolute top-1.5 right-1.5 p-1 rounded bg-rose-600/90 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  title="Eliminar foto del lote"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>

              <div className="p-2 text-[10px]">
                <p className="font-semibold text-slate-800 truncate" title={foto.nombreOriginal}>
                  {foto.nombreOriginal}
                </p>
                <div className="flex items-center justify-between text-slate-400 mt-0.5">
                  <span>Marca aplicada</span>
                  <span className="text-emerald-600 font-bold">✓ Lista</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
