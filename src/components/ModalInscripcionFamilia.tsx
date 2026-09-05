import React, { useState } from 'react';
import {
  X,
  UserPlus,
  LogIn,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Phone,
  Mail,
  User,
  GraduationCap,
  Clock,
  School,
  AlertCircle
} from 'lucide-react';
import {
  InscripcionFamilia,
  guardarInscripcion,
  buscarFamiliaPorContacto,
  guardarFamiliaActiva,
  obtenerInscripciones
} from '../services/inscripcionesService';
import { COLEGIOS_EJEMPLO } from '../data/colegiosData';

interface ModalInscripcionFamiliaProps {
  isOpen: boolean;
  onClose: () => void;
  onInscripcionExitosa: (familia: InscripcionFamilia) => void;
}

export default function ModalInscripcionFamilia({
  isOpen,
  onClose,
  onInscripcionExitosa
}: ModalInscripcionFamiliaProps) {
  const [tab, setTab] = useState<'registro' | 'login'>('registro');

  // Form states for New Inscription
  const [padreNombre, setPadreNombre] = useState('');
  const [telefonoWhatsApp, setTelefonoWhatsApp] = useState('');
  const [email, setEmail] = useState('');
  const [alumnoNombre, setAlumnoNombre] = useState('');
  const [alumnoApellido, setAlumnoApellido] = useState('');
  const [turno, setTurno] = useState('Tarde');
  const [grado, setGrado] = useState('Sala 5 años');
  const [division, setDivision] = useState('Celeste');
  const [colegioId, setColegioId] = useState('col-inicial-2026');

  // Login states
  const [loginQuery, setLoginQuery] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Form errors
  const [formError, setFormError] = useState<string | null>(null);

  if (!isOpen) return null;

  const colegioSeleccionado = COLEGIOS_EJEMPLO.find((c) => c.id === colegioId) || COLEGIOS_EJEMPLO[0];

  const handleRegistroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validations
    if (!padreNombre.trim()) {
      setFormError('Por favor ingresá el nombre y apellido del padre, madre o tutor.');
      return;
    }
    if (!telefonoWhatsApp.trim() || telefonoWhatsApp.trim().length < 8) {
      setFormError('Por favor ingresá un número de teléfono de WhatsApp válido.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setFormError('Por favor ingresá un correo electrónico válido.');
      return;
    }
    if (!alumnoNombre.trim()) {
      setFormError('Por favor ingresá el nombre del alumno/a.');
      return;
    }
    if (!alumnoApellido.trim()) {
      setFormError('Por favor ingresá el apellido del alumno/a.');
      return;
    }

    const nuevaFamilia = guardarInscripcion({
      padreNombre: padreNombre.trim(),
      telefonoWhatsApp: telefonoWhatsApp.trim(),
      email: email.trim(),
      alumnoNombre: alumnoNombre.trim(),
      alumnoApellido: alumnoApellido.trim(),
      turno,
      grado,
      division,
      colegioId: colegioSeleccionado.id,
      colegioNombre: colegioSeleccionado.nombre
    });

    onInscripcionExitosa(nuevaFamilia);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    if (!loginQuery.trim()) {
      setLoginError('Ingresá tu teléfono o correo para buscar tu usuario.');
      return;
    }

    const encontrada = buscarFamiliaPorContacto(loginQuery);
    if (encontrada) {
      guardarFamiliaActiva(encontrada);
      onInscripcionExitosa(encontrada);
    } else {
      setLoginError('No encontramos una inscripción con ese teléfono o correo. Verificá los datos o completá la pestaña "Inscribirme".');
    }
  };

  // Recent registrations on this device
  const inscripcionesGuardadas = obtenerInscripciones().slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white border border-slate-200 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-slate-900 animate-in fade-in zoom-in-95 duration-150 text-left"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-md shadow-amber-500/20 shrink-0">
              <UserPlus className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold font-['Outfit'] tracking-tight">
                  Inscripción de Familias
                </h2>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  Ciclo 2026
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Paso inicial para acceder a las fotos del curso de tu hijo/a
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="bg-slate-100 p-2 border-b border-slate-200 flex gap-2">
          <button
            type="button"
            onClick={() => {
              setTab('registro');
              setFormError(null);
            }}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              tab === 'registro'
                ? 'bg-white text-slate-950 shadow-sm border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserPlus className="w-4 h-4 text-amber-600" />
            <span>Inscribirme (Crear usuario)</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setTab('login');
              setLoginError(null);
            }}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              tab === 'login'
                ? 'bg-white text-slate-950 shadow-sm border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LogIn className="w-4 h-4 text-sky-600" />
            <span>Ya me inscribí (Ingresar)</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {tab === 'registro' ? (
            <form onSubmit={handleRegistroSubmit} className="space-y-6">
              {/* Error Alert */}
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Group 1: Tutor / Padre / Madre */}
              <div className="bg-amber-50/50 border border-amber-200/70 rounded-2xl p-4 sm:p-5 space-y-3.5">
                <div className="flex items-center gap-2 text-xs font-extrabold text-amber-950 uppercase tracking-wider">
                  <User className="w-4 h-4 text-amber-600" />
                  <span>1. Datos del Padre, Madre o Tutor</span>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Nombre y apellido del padre / madre <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={padreNombre}
                      onChange={(e) => setPadreNombre(e.target.value)}
                      placeholder="Ej: Mariana Gómez"
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-400 font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Número de WhatsApp <span className="text-red-500">*</span></span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={telefonoWhatsApp}
                        onChange={(e) => setTelefonoWhatsApp(e.target.value)}
                        placeholder="Ej: 11 5489-3210"
                        className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-400 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5 text-sky-600" />
                        <span>Correo electrónico <span className="text-red-500">*</span></span>
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Ej: mariana.gomez@gmail.com"
                        className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-400 font-medium"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Group 2: Alumno */}
              <div className="bg-sky-50/40 border border-sky-200/70 rounded-2xl p-4 sm:p-5 space-y-3.5">
                <div className="flex items-center gap-2 text-xs font-extrabold text-sky-950 uppercase tracking-wider">
                  <GraduationCap className="w-4 h-4 text-sky-600" />
                  <span>2. Datos del Alumno/a</span>
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Nombre del alumno/a <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={alumnoNombre}
                        onChange={(e) => setAlumnoNombre(e.target.value)}
                        placeholder="Ej: Benjamín"
                        className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-400 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Apellido del alumno/a <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={alumnoApellido}
                        onChange={(e) => setAlumnoApellido(e.target.value)}
                        placeholder="Ej: Gómez"
                        className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-400 font-medium"
                      />
                    </div>
                  </div>

                  {/* Colegio */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                      <School className="w-3.5 h-3.5 text-slate-500" />
                      <span>Colegio o Institución</span>
                    </label>
                    <select
                      value={colegioId}
                      onChange={(e) => setColegioId(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-400 font-medium text-slate-800"
                    >
                      {COLEGIOS_EJEMPLO.map((col) => (
                        <option key={col.id} value={col.id}>
                          {col.nombre} ({col.localidad})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Turno, Grado, División */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        <span>Turno <span className="text-red-500">*</span></span>
                      </label>
                      <select
                        value={turno}
                        onChange={(e) => setTurno(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-400 font-medium text-slate-800"
                      >
                        <option value="Tarde">Tarde</option>
                        <option value="Mañana">Mañana</option>
                        <option value="Jornada Completa">Jornada Completa</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Grado / Sala <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={grado}
                        onChange={(e) => setGrado(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-400 font-medium text-slate-800"
                      >
                        <option value="Sala 3 años">Sala 3 años</option>
                        <option value="Sala 4 años">Sala 4 años</option>
                        <option value="Sala 5 años">Sala 5 años</option>
                        <option value="1° Grado">1° Grado</option>
                        <option value="2° Grado">2° Grado</option>
                        <option value="3° Grado">3° Grado</option>
                        <option value="4° Grado">4° Grado</option>
                        <option value="5° Grado">5° Grado</option>
                        <option value="6° Grado">6° Grado</option>
                        <option value="7° Grado">7° Grado</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        División / Color <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={division}
                        onChange={(e) => setDivision(e.target.value)}
                        placeholder="Ej: Celeste, A, B..."
                        className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-400 font-medium"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Security Privacy Notice */}
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 text-[11px] leading-relaxed">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Privacidad y Seguridad:</strong> Tus datos se almacenan de forma segura y confidencial. Cada familia accede únicamente al espacio y pedidos de sus propios hijos.
                </span>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                id="btn-confirmar-inscripcion"
                className="w-full py-3.5 px-6 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 hover:from-amber-300 hover:to-amber-200 text-slate-950 font-extrabold text-sm rounded-2xl shadow-lg shadow-amber-400/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <span>Completar Inscripción y Ver Fotos</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* Tab: Ya me inscribí (Login) */
            <div className="space-y-6">
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                {loginError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                    <span>{loginError}</span>
                  </div>
                )}

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
                  <label className="block text-xs font-bold text-slate-700">
                    Ingresá tu WhatsApp o Correo registrado
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={loginQuery}
                      onChange={(e) => setLoginQuery(e.target.value)}
                      placeholder="Ej: 11 5489-3210 o mariana.gomez@gmail.com"
                      className="w-full px-4 py-3 text-sm bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-400 font-medium"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Si ya completaste la inscripción de tu hijo/a previamente, podés ingresar directamente ingresando tu número o correo.
                  </p>

                  <button
                    type="submit"
                    className="w-full py-3 px-6 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Ingresar a mis fotos</span>
                  </button>
                </div>
              </form>

              {/* Previously registered accounts on this browser */}
              {inscripcionesGuardadas.length > 0 && (
                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Familias registradas en este dispositivo:
                  </h4>
                  <div className="space-y-2">
                    {inscripcionesGuardadas.map((fam) => (
                      <div
                        key={fam.id}
                        onClick={() => {
                          guardarFamiliaActiva(fam);
                          onInscripcionExitosa(fam);
                        }}
                        className="p-3.5 bg-white hover:bg-amber-50/60 border border-slate-200 hover:border-amber-300 rounded-xl transition-all flex items-center justify-between gap-3 cursor-pointer group shadow-xs"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 font-bold flex items-center justify-center text-xs group-hover:bg-amber-400 transition-colors">
                            {fam.alumnoNombre[0]}
                          </div>
                          <div>
                            <p className="text-xs font-extrabold text-slate-900">
                              {fam.alumnoNombre} {fam.alumnoApellido}
                            </p>
                            <p className="text-[11px] text-slate-500">
                              {fam.grado} ({fam.division}) · Turno {fam.turno} · Tutor: {fam.padreNombre}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 text-xs font-bold text-amber-700 group-hover:translate-x-0.5 transition-transform">
                          <span>Entrar</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-center text-[11px] text-slate-500">
          ¿Tenés dudas o necesitás asistencia? Contactanos por{' '}
          <a
            href="https://wa.me/5491128625916?text=Hola%20infocus,%20necesito%20ayuda%20con%20la%20inscripción"
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-600 font-bold hover:underline"
          >
            WhatsApp al 11 2862-5916
          </a>
        </div>
      </div>
    </div>
  );
}
