import { useState } from 'react';
import { Sparkles, Check, Image as ImageIcon, Frame, Bookmark, CreditCard, ChevronRight, Box } from 'lucide-react';
import { KITS_DISPONIBLES } from '../data/colegiosData';

interface MuestrarioSectionProps {
  onSelectKit: (kitId: string) => void;
}

export default function MuestrarioSection({ onSelectKit }: MuestrarioSectionProps) {
  const [activeTab, setActiveTab] = useState<'individual' | 'grupal' | 'fotocubo' | 'docente' | 'impresos'>('individual');

  const tabs = [
    { id: 'individual', label: 'Retratos Individuales', icon: ImageIcon },
    { id: 'grupal', label: 'Foto Grupal de Grado', icon: ImageIcon },
    { id: 'fotocubo', label: 'Fotocubo & Egresados', icon: Box },
    { id: 'docente', label: 'Con la Seño / Docente', icon: Bookmark },
    { id: 'impresos', label: 'Kits Físicos & Stickers', icon: Frame },
  ];

  const contentByTab = {
    individual: {
      titulo: 'Retratos espontáneos con luz natural',
      descripcion:
        'Buscamos la sonrisa natural de cada alumno. Sin flashes molestos ni poses congeladas. Hacemos varias tomas para que la familia elija su favorita.',
      imagen: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=85',
      specs: [
        'Múltiples tomas para elegir en la galería online',
        'Impresión en papel fotográfico satinado 15x21 cm de 260 gramos',
        'Colores vivos y corrección de color profesional',
        'Descarga del archivo en resolución Ultra HD sin compresión',
      ],
    },
    grupal: {
      titulo: 'Foto grupal con diseño institucional',
      descripcion:
        'El recuerdo imborrable de todo el grupo de compañeros. Ordenados por estatura, con nombre del colegio, grado, división y año lectivo.',
      imagen: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1200&q=85',
      specs: [
        'Formato apaisado 15x21 cm de alta visibilidad',
        'Diseño gráfico conmemorativo con tipografía y logo del colegio',
        'Cada maestro y directivo recibe su copia de obsequio',
        'Archivo de alta resolución para archivar o reimprimir',
      ],
    },
    fotocubo: {
      titulo: 'Fotocubo de madera: el souvenir estrella de egresaditos',
      descripcion:
        'Cubo giratorio con 6 caras impresas en papel fotográfico premium. El souvenir más pedido para sala de 5 (jardín), 7° grado y 5°/6° año de secundaria.',
      imagen: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=1200&q=85',
      specs: [
        'Cubo de madera maciza o acrílico pulido 10x10 cm',
        'Foto grupal con diseño de promo, retrato individual y nombres de compañeros',
        'Escudo institucional y año de promoción conmemorativo',
        'Listo para regalar en caja protectora conmemorativa',
      ],
    },
    docente: {
      titulo: 'La foto que atesoran maestras y familias',
      descripcion:
        'Un momento de ternura y complicidad con las maestras de grado o profesores que acompañan a los chicos durante todo el año.',
      imagen: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=85',
      specs: [
        'Formato 13x18 cm conmemorativo',
        'Tomas en el aula, pizarrón o biblioteca',
        'Incluida en todos los kits clásicos y premium',
        'Disponible también para hermanos o primos del mismo colegio',
      ],
    },
    impresos: {
      titulo: 'Presentación premium y materiales duraderos',
      descripcion:
        'Cuidamos cada detalle: portarretratos institucionales rígidos, planchas de stickers troqueladas y fotos carnet oficiales para libretas.',
      imagen: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=1200&q=85',
      specs: [
        'Portarretrato plegable institucional con logo',
        'Plancha con 4 u 8 stickers adhesivos plastificados con su nombre',
        '4 fotos carnet 4x4 cm para trámites escolares',
        'Sobre cerrado individual con nombre y curso para entrega en mano',
      ],
    },
  };

  const current = contentByTab[activeTab];

  return (
    <section id="muestrario" className="py-16 lg:py-24 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold text-amber-700 uppercase tracking-widest px-3 py-1 bg-amber-100 rounded-full border border-amber-200/80 inline-block mb-3">
            Calidad de Producto
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-['Outfit']">
            Recuerdos fotográficos pensados para durar toda la vida
          </h2>
          <p className="text-base sm:text-lg text-slate-600 mt-3">
            Combinamos tecnología digital para la selección y laboratorios fotográficos profesionales de alta gama para las copias impresas.
          </p>
        </div>

        {/* Product Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-md shadow-slate-900/10'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-amber-400' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Showcase Box */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-xl max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 relative aspect-4/3 rounded-2xl overflow-hidden shadow-md border border-slate-200 bg-slate-100 group">
              <img
                src={current.imagen}
                alt={current.titulo}
                className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 bg-slate-900/85 backdrop-blur-xs text-white text-[11px] font-semibold px-3 py-1 rounded-full shadow-xs">
                Muestra Fotográfica Original
              </div>
            </div>

            <div className="lg:col-span-6 space-y-5 text-left">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 font-['Outfit']">
                  {current.titulo}
                </h3>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                  {current.descripcion}
                </p>
              </div>

              <div className="space-y-2.5 pt-2">
                {current.specs.map((spec, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-slate-700 font-medium">
                    <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span>{spec}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">
                  Disponible en todos los colegios asociados
                </span>
                <button
                  onClick={() => onSelectKit('kit-clasico')}
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Ver Kits y Precios</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Kits Comparison Grid */}
        <div id="familias" className="mt-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest px-3 py-1 bg-emerald-50 rounded-full border border-emerald-200 inline-block mb-3">
              Para Familias · Elección Voluntaria
            </span>
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight font-['Outfit']">
              Kits escolares con precios claros en pesos argentinos
            </h3>
            <p className="text-sm text-slate-600 mt-2">
              Sin sorpresas ni letra chica. Cada familia elige libremente el paquete que mejor se adapte a sus ganas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {KITS_DISPONIBLES.map((kit) => (
              <div
                key={kit.id}
                className={`relative bg-white rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 ${
                  kit.popular
                    ? 'border-2 border-amber-400 shadow-xl shadow-amber-400/10 scale-102 sm:-translate-y-1'
                    : 'border border-slate-200 shadow-md hover:border-slate-300'
                }`}
              >
                {kit.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-950 text-[11px] font-extrabold px-3.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                    El más elegido por las familias
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xl font-bold text-slate-900 font-['Outfit']">
                      {kit.nombre}
                    </h4>
                    {kit.popular ? (
                      <span className="p-2 rounded-xl bg-amber-100 text-amber-900">
                        <Sparkles className="w-5 h-5" />
                      </span>
                    ) : (
                      <span className="p-2 rounded-xl bg-slate-100 text-slate-700">
                        <ImageIcon className="w-5 h-5" />
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-500 mb-5 min-h-[32px]">{kit.tagline}</p>

                  <div className="mb-6 pb-6 border-b border-slate-100">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-['Outfit']">
                        ${kit.precio.toLocaleString('es-AR')}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">ARS</span>
                    </div>
                    {kit.precioOriginal && (
                      <p className="text-xs text-slate-400 line-through mt-0.5">
                        Precio habitual: ${kit.precioOriginal.toLocaleString('es-AR')}
                      </p>
                    )}
                  </div>

                  <ul className="space-y-3 mb-8">
                    {kit.incluye.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 font-medium">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => onSelectKit(kit.id)}
                  className={`w-full py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    kit.popular
                      ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md shadow-amber-400/20 active:scale-98'
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  <span>Elegir este Kit en la Galería</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
