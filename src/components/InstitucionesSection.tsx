import { useState } from 'react';
import {
  GraduationCap,
  Sparkles,
  Gift,
  Clock,
  CheckCircle2,
  FileCheck,
  ShieldCheck,
  CalendarCheck,
  ArrowRight,
  School,
  SmilePlus,
} from 'lucide-react';

interface InstitucionesSectionProps {
  onOpenSolicitud: () => void;
}

export default function InstitucionesSection({ onOpenSolicitud }: InstitucionesSectionProps) {
  const [alumnos, setAlumnos] = useState(350);
  const [nivel, setNivel] = useState<'todos' | 'primaria' | 'inicial' | 'secundaria'>('todos');
  const [turnos, setTurnos] = useState<'uno' | 'doble'>('doble');

  // Interactive calculation
  const docentesEstimados = Math.round(alumnos / 25);
  const diasJornada = alumnos > 600 ? '2 a 3 mañanas' : alumnos > 300 ? '2 jornadas' : '1 jornada ágil';
  // 20% Cooperadora estimated funds (avg $4.800 per student family purchase at ~70% conversion)
  const familiasEstimadas = Math.round(alumnos * 0.7);
  const fondoCooperadoraEstimado = familiasEstimadas * 4800;

  return (
    <section id="instituciones" className="py-16 lg:py-24 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-200 text-slate-800 text-xs font-semibold uppercase tracking-wider mb-3">
            <School className="w-3.5 h-3.5 text-amber-600" />
            <span>Para Directivos y Equipos Escolares</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-['Outfit']">
            La fotografía escolar que <span className="text-amber-600">no le da trabajo</span> al colegio
          </h2>
          <p className="text-base sm:text-lg text-slate-600 mt-3">
            Diseñado especialmente para eliminar el estrés administrativo de maestras, preceptores y secretarias.
            El colegio solo nos abre la puerta y disfruta de los resultados.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-300 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">0 Cobranzas en el Colegio</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Ni un solo peso ni sobre circula por la escuela. Las familias pagan directamente por Mercado Pago o transferencia bancaria en la plataforma.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-300 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-4">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Rutina Escolar Cuidada</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Montamos el estudio en el SUM o biblioteca. Cada curso asiste en un turno coordinado de 10 a 15 minutos. Las clases continúan con total normalidad.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-300 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center mb-4">
              <Gift className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">20% para Cooperadora</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              El 20% de cada venta queda para la cooperadora del colegio ($6.000 por Kit Impreso y $3.000 por Kit Digital), además de fotos de regalo para cada docente.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-300 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center mb-4">
              <FileCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Fotos para Legajos</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Entregamos a secretaría el archivo digital en alta calidad de todos los alumnos ordenado por curso para actualizar los sistemas de gestión escolar.
            </p>
          </div>
        </div>

        {/* Interactive Estimator / Simulator for Headmasters */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-amber-400 text-slate-950 font-bold">
                  <GraduationCap className="w-4 h-4" />
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 font-['Outfit']">
                  Simulador de Planificación para tu Escuela
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Ajustá la matrícula de tu institución para ver la dinámica operativa estimada y beneficios.
              </p>
            </div>
            <span className="text-xs font-bold px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full border border-emerald-200">
              Servicio 100% Gratuito para el Colegio
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
            {/* Controls */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Cantidad aproximada de alumnos:
                  </label>
                  <span className="text-base font-extrabold text-amber-600 font-['Outfit']">
                    {alumnos} alumnos
                  </span>
                </div>
                <input
                  type="range"
                  min={100}
                  max={1200}
                  step={50}
                  value={alumnos}
                  onChange={(e) => setAlumnos(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                  <span>100 alumnos</span>
                  <span>500 alumnos</span>
                  <span>1.200+ alumnos</span>
                </div>
              </div>

              {/* Levels selector */}
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                  Nivel de la institución:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-semibold">
                  {[
                    { id: 'todos', label: 'Todos los niveles' },
                    { id: 'inicial', label: 'Jardín / Inicial' },
                    { id: 'primaria', label: 'Primaria' },
                    { id: 'secundaria', label: 'Secundaria' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setNivel(item.id as any)}
                      className={`py-2 px-3 rounded-lg border text-center transition-all cursor-pointer ${
                        nivel === item.id
                          ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Turnos */}
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                  Modalidad de turnos:
                </label>
                <div className="flex gap-3 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setTurnos('uno')}
                    className={`py-2 px-4 rounded-lg border transition-all cursor-pointer ${
                      turnos === 'uno'
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    Un solo turno (Mañana o Tarde)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTurnos('doble')}
                    className={`py-2 px-4 rounded-lg border transition-all cursor-pointer ${
                      turnos === 'doble'
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    Doble turno / Jornada completa
                  </button>
                </div>
              </div>
            </div>

            {/* Results Output Box */}
            <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 rounded-2xl flex flex-col justify-between shadow-lg">
              <div>
                <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3">
                  Propuesta Operativa Estimada
                </div>

                <div className="space-y-3.5 text-xs">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-white">Duración de la jornada: </span>
                      <span className="text-slate-300">{diasJornada} en turnos de 15 min por curso.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-white">Fotos para docentes: </span>
                      <span className="text-slate-300">~{docentesEstimados} fotos grupales de regalo.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-white">Legajo institucional: </span>
                      <span className="text-slate-300">100% de los retratos digitalizados para el colegio.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-white">Fondo para Cooperadora (20%): </span>
                      <span className="text-amber-400 font-bold">~${fondoCooperadoraEstimado.toLocaleString('es-AR')} ARS </span>
                      <span className="text-slate-300">(sin gestión del colegio).</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-white">Costo para la institución: </span>
                      <span className="text-emerald-300 font-bold">$0 (Cero pesos).</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-700">
                <button
                  id="btn-solicitar-reunion-simulador"
                  onClick={onOpenSolicitud}
                  className="w-full py-3 px-4 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md shadow-amber-400/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CalendarCheck className="w-4 h-4" />
                  <span>Pedir propuesta y agendar fecha</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <p className="text-[10px] text-center text-slate-400 mt-2">
                  Sin compromiso · Respondemos en menos de 2 horas hábiles
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
