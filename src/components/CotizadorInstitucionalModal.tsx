import { useState, type FormEvent } from 'react';
import { X, School, Calendar, Send, CheckCircle2, Phone, Mail, MapPin } from 'lucide-react';

interface CotizadorInstitucionalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CotizadorInstitucionalModal({
  isOpen,
  onClose,
}: CotizadorInstitucionalModalProps) {
  const [nombreColegio, setNombreColegio] = useState('');
  const [contactoNombre, setContactoNombre] = useState('');
  const [cargo, setCargo] = useState('Director/a');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [localidad, setLocalidad] = useState('');
  const [alumnos, setAlumnos] = useState('300 - 500');
  const [mensaje, setMensaje] = useState('');
  const [enviado, setEnviado] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setEnviado(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-left">
        {/* Header */}
        <div className="px-6 py-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center">
              <School className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-['Outfit']">
                Propuesta Fotográfica para tu Colegio
              </h3>
              <p className="text-xs text-slate-400">
                0 Costo para la institución · 0 Carga administrativa
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          {enviado ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-2xl font-bold text-slate-900 font-['Outfit']">
                ¡Solicitud recibida correctamente!
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                Nos pondremos en contacto con <strong>{contactoNombre}</strong> al teléfono{' '}
                <strong>{telefono}</strong> para coordinar una reunión o enviarte la carpeta institucional con muestras reales.
              </p>
              <button
                onClick={() => {
                  setEnviado(false);
                  onClose();
                }}
                className="px-6 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl"
              >
                Cerrar
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Nombre del Colegio / Instituto
                  </label>
                  <input
                    required
                    type="text"
                    value={nombreColegio}
                    onChange={(e) => setNombreColegio(e.target.value)}
                    placeholder="Ej: Instituto Belgrano"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Localidad / Barrio
                  </label>
                  <input
                    required
                    type="text"
                    value={localidad}
                    onChange={(e) => setLocalidad(e.target.value)}
                    placeholder="Ej: San Isidro / Palermo / Adrogué"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Nombre del Contacto
                  </label>
                  <input
                    required
                    type="text"
                    value={contactoNombre}
                    onChange={(e) => setContactoNombre(e.target.value)}
                    placeholder="Ej: Lic. Claudia Morales"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Cargo en la institución
                  </label>
                  <select
                    value={cargo}
                    onChange={(e) => setCargo(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-400"
                  >
                    <option>Director/a</option>
                    <option>Vicedirector/a</option>
                    <option>Secretaría</option>
                    <option>Representante Legal</option>
                    <option>Cooperadora de Padres</option>
                    <option>Coordinador/a de Nivel</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Alumnos aprox.
                  </label>
                  <select
                    value={alumnos}
                    onChange={(e) => setAlumnos(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-400"
                  >
                    <option>100 - 250 alumnos</option>
                    <option>300 - 500 alumnos</option>
                    <option>500 - 800 alumnos</option>
                    <option>Más de 800 alumnos</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Teléfono / WhatsApp de contacto
                  </label>
                  <input
                    required
                    type="tel"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    placeholder="11 4455-6677"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Email institucional o personal
                  </label>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="contacto@colegio.edu.ar"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Comentarios o fechas de interés para la toma de fotos:
                </label>
                <textarea
                  rows={3}
                  value={mensaje}
                  onChange={(e) => setMensaje(e.target.value)}
                  placeholder="Contanos si tienen fechas tentativas, qué niveles desean fotografiar o consultas particulares..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-400 resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl shadow-md shadow-amber-400/20 flex items-center gap-2 cursor-pointer transition-all active:scale-98"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Enviar Solicitud Institucional</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
