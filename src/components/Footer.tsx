import { Camera, Heart, ShieldCheck, PhoneCall, Mail, MapPin, Lock } from 'lucide-react';

interface FooterProps {
  onOpenFamilias: () => void;
  onOpenInstituciones: () => void;
  onScrollTo: (id: string) => void;
  onOpenAdmin?: () => void;
}

export default function Footer({ onOpenFamilias, onOpenInstituciones, onScrollTo, onOpenAdmin }: FooterProps) {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800 text-left">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5 text-white">
              <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
                <Camera className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="text-xl font-bold tracking-tight font-['Outfit']">
                FOCO<span className="text-amber-400">ESCOLAR</span>
              </span>
            </div>

            <p className="text-slate-400 leading-relaxed max-w-sm">
              Plataforma y servicio integral de fotografía escolar para colegios y familias de la República Argentina.
              Sin cobro de dinero en la institución, con selección 100% online y los más altos estándares de calidad fotográfica.
            </p>

            <div className="flex items-center gap-2 text-slate-300 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Transacciones seguras procesadas con Mercado Pago</span>
            </div>
          </div>

          {/* Institutional Links */}
          <div className="space-y-3">
            <p className="text-xs font-bold text-white uppercase tracking-wider">
              Instituciones
            </p>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onScrollTo('instituciones')}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  Servicio para Colegios
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenInstituciones}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  Pedir Propuesta Escolar
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollTo('instituciones')}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  Simulador de Jornada
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollTo('faq')}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  Preguntas de Directivos
                </button>
              </li>
            </ul>
          </div>

          {/* Families Links */}
          <div className="space-y-3">
            <p className="text-xs font-bold text-white uppercase tracking-wider">
              Familias
            </p>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onOpenFamilias()}
                  className="hover:text-amber-400 transition-colors cursor-pointer font-semibold text-amber-400"
                >
                  Acceso a Fotos (Mi Foco)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollTo('muestrario')}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  Kits y Productos
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollTo('proceso')}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  Cómo Comprar Online
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollTo('faq')}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  Preguntas Frecuentes
                </button>
              </li>
            </ul>
          </div>

          {/* Zones & Contact */}
          <div className="space-y-3">
            <p className="text-xs font-bold text-white uppercase tracking-wider">
              Contacto
            </p>
            <div className="space-y-2 text-slate-400">
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Buenos Aires, Argentina</span>
              </p>
              <p className="flex items-center gap-2">
                <PhoneCall className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>WhatsApp: +54 9 11 0000-0000</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span>info@focoescolar.com</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500">
          <p>© {new Date().getFullYear()} Foco Escolar. Todos los derechos reservados.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Defensa de las y los Consumidores</span>
            <span>·</span>
            <span>Términos y Privacidad Escolar</span>
            {onOpenAdmin && (
              <>
                <span>·</span>
                <button
                  onClick={onOpenAdmin}
                  className="text-slate-400 hover:text-amber-400 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Lock className="w-3 h-3" />
                  <span>Acceso Fotógrafo</span>
                </button>
              </>
            )}
            <span>·</span>
            <span className="flex items-center gap-1 text-slate-400">
              Hecho con <Heart className="w-3 h-3 text-red-500 fill-red-500" /> en Argentina
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
