import { Calendar, Camera, Laptop, CreditCard, PackageCheck, ArrowRight } from 'lucide-react';

interface ProcesoSectionProps {
  onOpenFamilias: (colegioId?: string) => void;
  onOpenInstituciones: () => void;
}

export default function ProcesoSection({ onOpenFamilias, onOpenInstituciones }: ProcesoSectionProps) {
  const pasos = [
    {
      paso: '01',
      icono: Calendar,
      titulo: 'Coordinamos la fecha',
      subtitulo: 'Sin complicaciones',
      descripcion:
        'Fijamos el día con el equipo directivo y les facilitamos un comunicado digital listo para enviar por WhatsApp o cuaderno a las familias.',
      destacado: 'Fecha y circular listas en 24 hs',
    },
    {
      paso: '02',
      icono: Camera,
      titulo: 'Jornada fotográfica',
      subtitulo: 'Luz natural y calidez',
      descripcion:
        'Montamos un estudio ágil en el SUM o biblioteca. Tomamos múltiples retratos espontáneos por alumno, la foto grupal de grado y con la docente.',
      destacado: '10 a 15 min por curso',
    },
    {
      paso: '03',
      icono: Laptop,
      titulo: 'Galería online privada',
      subtitulo: 'En 72 horas hábiles',
      descripcion:
        'Cada familia ingresa con el nombre de su colegio o código privado para ver las fotos con marca de agua en alta resolución desde el celular.',
      destacado: 'Segura y protegida',
    },
    {
      paso: '04',
      icono: CreditCard,
      titulo: 'Elección y pago digital',
      subtitulo: '100% autogestionado',
      descripcion:
        'Los papás eligen la toma favorita de su hijo/a, seleccionan su kit preferido y abonan por Mercado Pago o transferencia bancaria.',
      destacado: '0 dinero en la escuela',
    },
    {
      paso: '05',
      icono: PackageCheck,
      titulo: 'Descarga HD y entrega',
      subtitulo: 'Rápido y prolijo',
      descripcion:
        'Descarga digital inmediata al confirmar el pago. Los pedidos impresos se entregan al colegio en sobres cerrados y rotulados por grado y división.',
      destacado: 'Envío automático por WhatsApp',
    },
  ];

  return (
    <section id="proceso" className="py-16 lg:py-24 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-amber-700 uppercase tracking-widest px-3 py-1 bg-amber-50 rounded-full border border-amber-200/60 inline-block mb-3">
            El Proceso InFocus Schools
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-['Outfit']">
            Paso a paso, un sistema pensado para la tranquilidad de todos
          </h2>
          <p className="text-base sm:text-lg text-slate-600 mt-3">
            Desde el primer contacto hasta la entrega de los recuerdos en papel fotográfico de alta calidad.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 relative">
          {pasos.map((p, idx) => {
            const Icon = p.icono;
            return (
              <div
                key={p.paso}
                className="relative bg-slate-50/80 rounded-2xl p-5 border border-slate-200/80 hover:border-amber-300 transition-all hover:shadow-md flex flex-col justify-between group"
              >
                {/* Step badge */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black text-slate-300 font-['Outfit'] group-hover:text-amber-500 transition-colors">
                      {p.paso}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-center text-slate-800 group-hover:bg-amber-400 group-hover:text-slate-950 group-hover:border-amber-400 transition-all">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900">{p.titulo}</h3>
                  <p className="text-[11px] font-semibold text-amber-700 mb-2">{p.subtitulo}</p>
                  <p className="text-xs text-slate-600 leading-relaxed">{p.descripcion}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/60">
                  <span className="text-[10px] font-bold text-slate-700 bg-white px-2 py-1 rounded-md border border-slate-200 inline-block">
                    {p.destacado}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action bar */}
        <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="text-left">
            <h4 className="text-lg font-bold font-['Outfit'] text-white">
              ¿Querés probar la experiencia desde el punto de vista de una familia?
            </h4>
            <p className="text-xs text-slate-300 mt-0.5">
              Accedé a la galería interactiva de demostración con fotos de muestra y probá la selección.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onOpenFamilias('col-5')}
              className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md shadow-amber-400/20 flex items-center gap-2 cursor-pointer"
            >
              <span>Ver Galería Demo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenInstituciones}
              className="px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-semibold text-xs rounded-xl transition-colors cursor-pointer"
            >
              <span>Soy Directivo</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
