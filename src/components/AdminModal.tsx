import React, { useState } from 'react';
import { 
  X, Lock, Camera, Upload, CheckCircle2, DollarSign, Package, 
  School, RefreshCw, Eye, AlertCircle, ArrowRight
} from 'lucide-react';
import { COLEGIOS_EJEMPLO, FOTOS_MUESTRA, KITS_DISPONIBLES } from '../data/colegiosData';
import { Colegio, Foto } from '../types';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminModal({ isOpen, onClose }: AdminModalProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminPin, setAdminPin] = useState('');
  const [pinError, setPinError] = useState('');

  // Admin tabs
  const [activeTab, setActiveTab] = useState<'pedidos' | 'subir' | 'colegios'>('pedidos');

  // Simulated orders
  const [pedidos, setPedidos] = useState([
    {
      id: 'FOC-2026-8812',
      fecha: '02/09/2026 10:30',
      colegio: 'Colegio San Martín de Tours',
      alumno: 'Valentina Rossi (3° A)',
      tutor: 'Mariana Gómez (11 5489-3210)',
      kit: 'Kit Impreso + Digital',
      total: 30000,
      metodoPago: 'mercadopago',
      estadoPago: 'aprobado',
      estadoEntrega: 'en_laboratorio'
    },
    {
      id: 'FOC-2026-8809',
      fecha: '02/09/2026 09:15',
      colegio: 'Instituto Belgrano Day School',
      alumno: 'Mateo Benítez (1° B)',
      tutor: 'Diego Benítez (11 4455-9988)',
      kit: 'Solo Digital HD',
      total: 15000,
      metodoPago: 'transferencia',
      estadoPago: 'pendiente',
      estadoEntrega: 'recibido'
    },
    {
      id: 'FOC-2026-8795',
      fecha: '01/09/2026 18:40',
      colegio: 'Colegio Santa María de San Isidro',
      alumno: 'Sofía Álvarez (5° Verde)',
      tutor: 'Luciana Álvarez (11 6722-1100)',
      kit: 'Kit Impreso + Digital',
      total: 30000,
      metodoPago: 'mercadopago',
      estadoPago: 'aprobado',
      estadoEntrega: 'listo_descarga'
    }
  ]);

  // Upload photo state
  const [targetColegioId, setTargetColegioId] = useState(COLEGIOS_EJEMPLO[0].id);
  const [targetCategoria, setTargetCategoria] = useState<'individual' | 'grupal' | 'docente'>('individual');
  const [targetGrado, setTargetGrado] = useState('3° grado');
  const [targetDivision, setTargetDivision] = useState('A');
  const [targetTitulo, setTargetTitulo] = useState('Retrato Individual - Toma Nueva');
  const [previewRawUrl, setPreviewRawUrl] = useState<string | null>(null);
  const [watermarkedUrl, setWatermarkedUrl] = useState<string | null>(null);
  const [isProcessingWatermark, setIsProcessingWatermark] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // New school state
  const [colegiosList, setColegiosList] = useState<Colegio[]>(COLEGIOS_EJEMPLO);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevaLocalidad, setNuevaLocalidad] = useState('');
  const [nuevaZona, setNuevaZona] = useState<'CABA' | 'Zona Norte' | 'Zona Sur' | 'Zona Oeste'>('CABA');
  const [nuevoCodigo, setNuevoCodigo] = useState('');

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPin === 'admin' || adminPin === '1234' || adminPin.toLowerCase() === 'infocus') {
      setIsAuthenticated(true);
      setPinError('');
    } else {
      setPinError('PIN incorrecto. Probá con "infocus", "admin" o "1234".');
    }
  };

  // Watermark generator via HTML5 Canvas
  const processImageWatermark = (rawUrl: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(rawUrl);
          return;
        }

        ctx.drawImage(img, 0, 0);

        ctx.save();
        const text = 'INFOCUS SCHOOLS · MUESTRA';
        const fontSize = Math.max(18, Math.round(canvas.width * 0.045));
        ctx.font = `bold ${fontSize}px sans-serif`;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.75)';
        ctx.shadowBlur = 8;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((-25 * Math.PI) / 180);

        const stepX = canvas.width * 0.5;
        const stepY = canvas.height * 0.25;
        for (let y = -canvas.height; y < canvas.height; y += stepY) {
          for (let x = -canvas.width; x < canvas.width; x += stepX) {
            ctx.fillText(text, x, y);
          }
        }
        ctx.restore();

        resolve(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.src = rawUrl;
    });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingWatermark(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const raw = event.target?.result as string;
      setPreviewRawUrl(raw);
      const watermarked = await processImageWatermark(raw);
      setWatermarkedUrl(watermarked);
      setIsProcessingWatermark(false);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!watermarkedUrl) return;

    setUploadSuccess(true);
    setTimeout(() => {
      setUploadSuccess(false);
      setPreviewRawUrl(null);
      setWatermarkedUrl(null);
    }, 3000);
  };

  const handleCrearColegio = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoNombre || !nuevoCodigo) return;

    const nuevo: Colegio = {
      id: `col-${Date.now()}`,
      slug: nuevoNombre.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      nombre: nuevoNombre,
      localidad: nuevaLocalidad || 'Buenos Aires',
      zona: nuevaZona,
      eventoActual: 'Jornada Fotográfica Anual 2026',
      codigoAcceso: nuevoCodigo.toUpperCase().trim(),
      grados: ['1° grado', '2° grado', '3° grado', '4° grado', '5° grado', '6° grado', '7° grado'],
      divisiones: ['A', 'B'],
      turnos: ['Mañana', 'Tarde']
    };

    setColegiosList([nuevo, ...colegiosList]);
    setNuevoNombre('');
    setNuevaLocalidad('');
    setNuevoCodigo('');
    alert('Colegio agregado con éxito.');
  };

  const totalRecaudado = pedidos.reduce((acc, p) => p.estadoPago === 'aprobado' ? acc + p.total : acc, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl w-full max-w-5xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl border border-slate-700">
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold font-['Outfit']">Panel de Control para Fotógrafos</h2>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  Interno
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Gestión de pedidos familiares, subida con marca de agua y colegios
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Auth Gate */}
        {!isAuthenticated ? (
          <div className="p-8 sm:p-12 max-w-md mx-auto my-auto text-center space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center mx-auto">
              <Lock className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 font-['Outfit']">Acceso Restringido</h3>
              <p className="text-xs text-slate-500 mt-1">
                Ingresá tu PIN de fotógrafo para acceder a la consola administrativa.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-3">
              <input
                type="password"
                value={adminPin}
                onChange={e => {
                  setAdminPin(e.target.value);
                  setPinError('');
                }}
                placeholder="PIN (Probá: infocus ó 1234)"
                className="w-full text-center px-4 py-3 rounded-xl border border-slate-300 text-sm font-bold tracking-widest focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
              {pinError && <p className="text-xs text-rose-600 font-semibold">{pinError}</p>}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm shadow transition-all"
              >
                Ingresar al Panel
              </button>
            </form>

            <div className="text-[11px] text-slate-400">
              PIN de demostración: <strong className="text-slate-600">infocus</strong> o <strong className="text-slate-600">admin</strong>
            </div>
          </div>
        ) : (
          /* Authenticated Admin Dashboard */
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
            
            {/* Top metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-500">Recaudación Confirmada</span>
                <div className="text-2xl font-black text-slate-900 font-['Outfit']">
                  ${totalRecaudado.toLocaleString('es-AR')} <span className="text-xs font-normal text-slate-500">ARS</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-500">Pedidos Totales</span>
                <div className="text-2xl font-black text-slate-900 font-['Outfit']">
                  {pedidos.length} pedidos
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-500">Colegios Activos</span>
                <div className="text-2xl font-black text-slate-900 font-['Outfit']">
                  {colegiosList.length} instituciones
                </div>
              </div>
            </div>

            {/* Navigation tabs */}
            <div className="flex border-b border-slate-200 gap-4">
              {[
                { id: 'pedidos', label: 'Pedidos de Familias', icon: Package },
                { id: 'subir', label: 'Subir Fotos con Marca de Agua', icon: Camera },
                { id: 'colegios', label: 'Colegios y Códigos', icon: School },
              ].map(t => {
                const Icon = t.icon;
                const active = activeTab === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id as any)}
                    className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
                      active ? 'border-amber-500 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>

            {/* TAB 1: PEDIDOS */}
            {activeTab === 'pedidos' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900">Listado de Pedidos Recientes</h3>
                  <span className="text-xs text-slate-500">Actualizado en tiempo real</span>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-slate-200">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-4">N° Pedido</th>
                        <th className="py-3 px-4">Colegio & Alumno</th>
                        <th className="py-3 px-4">Kit</th>
                        <th className="py-3 px-4">Total</th>
                        <th className="py-3 px-4">Pago</th>
                        <th className="py-3 px-4">Acción</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {pedidos.map(p => (
                        <tr key={p.id} className="hover:bg-slate-50">
                          <td className="py-3 px-4 font-mono font-bold text-slate-900">
                            {p.id}
                            <span className="block text-[10px] font-normal text-slate-400">{p.fecha}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-bold text-slate-900">{p.alumno}</span>
                            <span className="block text-[11px] text-slate-500">{p.colegio}</span>
                          </td>
                          <td className="py-3 px-4 font-medium text-slate-800">
                            {p.kit}
                          </td>
                          <td className="py-3 px-4 font-bold text-slate-900">
                            ${p.total.toLocaleString('es-AR')}
                            <span className="block text-[10px] text-slate-400 uppercase">{p.metodoPago}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              p.estadoPago === 'aprobado'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}>
                              {p.estadoPago === 'aprobado' ? '✓ Aprobado' : '⏳ Pendiente'}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            {p.estadoPago === 'pendiente' ? (
                              <button
                                onClick={() => {
                                  setPedidos(pedidos.map(item => item.id === p.id ? { ...item, estadoPago: 'aprobado' } : item));
                                }}
                                className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px]"
                              >
                                Aprobar Transferencia
                              </button>
                            ) : (
                              <span className="text-[11px] text-slate-400">Sin acciones</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 2: SUBIR FOTOS */}
            {activeTab === 'subir' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <form onSubmit={handleUploadSubmit} className="space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-200">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    Asignar y Proteger Foto Escolar
                  </h3>

                  {uploadSuccess && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>¡Foto publicada con marca de agua exitosamente!</span>
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Colegio</label>
                    <select
                      value={targetColegioId}
                      onChange={e => setTargetColegioId(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                    >
                      {colegiosList.map(c => (
                        <option key={c.id} value={c.id}>{c.nombre}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Categoría</label>
                      <select
                        value={targetCategoria}
                        onChange={e => setTargetCategoria(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                      >
                        <option value="individual">Individual</option>
                        <option value="grupal">Grupal</option>
                        <option value="docente">Con Docente</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Grado</label>
                      <input
                        type="text"
                        value={targetGrado}
                        onChange={e => setTargetGrado(e.target.value)}
                        placeholder="3° grado"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Título / Descripción</label>
                    <input
                      type="text"
                      value={targetTitulo}
                      onChange={e => setTargetTitulo(e.target.value)}
                      placeholder="Retrato individual toma A"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                    />
                  </div>

                  <div className="space-y-1 pt-1">
                    <label className="text-xs font-bold text-slate-700">Archivo de Foto</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-amber-100 file:text-amber-900"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={!watermarkedUrl || isProcessingWatermark}
                    className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs disabled:opacity-40 transition-all flex items-center justify-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Publicar en Galería Escolar</span>
                  </button>
                </form>

                {/* Live canvas preview */}
                <div className="bg-slate-100 rounded-2xl p-6 border border-slate-200 flex flex-col items-center justify-center text-center">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 self-start mb-3">
                    Resultado con Marca de Agua
                  </h4>

                  {isProcessingWatermark ? (
                    <div className="py-16 space-y-2">
                      <RefreshCw className="w-8 h-8 text-amber-500 animate-spin mx-auto" />
                      <p className="text-xs text-slate-500 font-medium">Estampando marca de agua en Canvas...</p>
                    </div>
                  ) : watermarkedUrl ? (
                    <div className="space-y-2 w-full">
                      <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-slate-300 bg-white">
                        <img src={watermarkedUrl} alt="Watermark preview" className="w-full h-full object-contain" />
                      </div>
                      <span className="text-[11px] text-emerald-600 font-bold block">✓ Marca de agua protegida</span>
                    </div>
                  ) : (
                    <div className="py-16 text-slate-400 space-y-2">
                      <Camera className="w-10 h-10 mx-auto stroke-[1.5]" />
                      <p className="text-xs">Cargá una foto para generar la muestra con marca de agua</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 3: COLEGIOS */}
            {activeTab === 'colegios' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <form onSubmit={handleCrearColegio} className="space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-200">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    Dar de Alta Nuevo Colegio
                  </h3>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Nombre de la Institución *</label>
                    <input
                      type="text"
                      required
                      value={nuevoNombre}
                      onChange={e => setNuevoNombre(e.target.value)}
                      placeholder="Ej: Colegio San Jorge"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Localidad / Barrio</label>
                    <input
                      type="text"
                      value={nuevaLocalidad}
                      onChange={e => setNuevaLocalidad(e.target.value)}
                      placeholder="Ej: Quilmes / Zona Sur"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Código de Acceso Familias *</label>
                    <input
                      type="text"
                      required
                      value={nuevoCodigo}
                      onChange={e => setNuevoCodigo(e.target.value)}
                      placeholder="Ej: SANJORGE26"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-mono font-bold uppercase"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow"
                  >
                    Guardar Colegio
                  </button>
                </form>

                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    Colegios Activos ({colegiosList.length})
                  </h3>
                  <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto bg-white rounded-2xl border border-slate-200">
                    {colegiosList.map(c => (
                      <div key={c.id} className="p-3.5 flex items-center justify-between">
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">{c.nombre}</h4>
                          <span className="text-[11px] text-slate-500">{c.localidad} ({c.zona})</span>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-slate-100 font-mono text-xs font-bold text-slate-800">
                          {c.codigoAcceso}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
