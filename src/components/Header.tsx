import { useState } from 'react';
import { Camera, Search, Menu, X, PhoneCall, Sparkles, GraduationCap, Lock } from 'lucide-react';

interface HeaderProps {
  onOpenFamilias: (colegioId?: string) => void;
  onOpenInstituciones: () => void;
  onScrollTo: (id: string) => void;
  onOpenAdmin?: () => void;
}

export default function Header({ onOpenFamilias, onOpenInstituciones, onScrollTo, onOpenAdmin }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (id: string) => {
    onScrollTo(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top micro-bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 hidden sm:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Temporada Escolar 2026 activa en CABA, Zona Norte, Zona Sur y Oeste</span>
          </div>
          <div className="flex items-center gap-4 text-slate-300">
            <span className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer" onClick={() => onScrollTo('cobertura')}>
              <span className="text-amber-400 font-medium">0 Sobres · 0 Efectivo en la escuela</span>
            </span>
            <span className="text-slate-600">|</span>
            {onOpenAdmin && (
              <>
                <button
                  onClick={onOpenAdmin}
                  className="flex items-center gap-1 text-slate-300 hover:text-amber-400 transition-colors cursor-pointer"
                >
                  <Lock className="w-3 h-3" />
                  <span>Panel Fotógrafo</span>
                </button>
                <span className="text-slate-600">|</span>
              </>
            )}
            <a
              href="https://wa.me/5491100000000?text=Hola%20Foco%20Escolar,%20quisiera%20hacer%20una%20consulta"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Atención WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Brand Logo */}
          <div
            id="brand-logo"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 flex items-center justify-center shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <Camera className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold tracking-tight text-slate-900 font-['Outfit']">
                  FOCO<span className="text-amber-600">ESCOLAR</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                  Arg
                </span>
              </div>
              <p className="text-[11px] text-slate-500 -mt-0.5 font-medium tracking-wide">
                Fotografía escolar 100% digital
              </p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              id="nav-colegios"
              onClick={() => handleNavClick('instituciones')}
              className="hover:text-slate-900 transition-colors cursor-pointer py-1"
            >
              Para Colegios
            </button>
            <button
              id="nav-familias"
              onClick={() => handleNavClick('familias')}
              className="hover:text-slate-900 transition-colors cursor-pointer py-1"
            >
              Para Familias
            </button>
            <button
              id="nav-proceso"
              onClick={() => handleNavClick('proceso')}
              className="hover:text-slate-900 transition-colors cursor-pointer py-1"
            >
              Cómo Funciona
            </button>
            <button
              id="nav-muestrario"
              onClick={() => handleNavClick('muestrario')}
              className="hover:text-slate-900 transition-colors cursor-pointer py-1"
            >
              Kits y Productos
            </button>
            <button
              id="nav-faq"
              onClick={() => handleNavClick('faq')}
              className="hover:text-slate-900 transition-colors cursor-pointer py-1"
            >
              Preguntas
            </button>
            <button
              id="nav-contacto"
              onClick={() => handleNavClick('contacto')}
              className="hover:text-slate-900 transition-colors cursor-pointer py-1"
            >
              Contacto
            </button>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              id="btn-pedir-propuesta"
              onClick={onOpenInstituciones}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <GraduationCap className="w-4 h-4 text-slate-600" />
              <span>Propuesta para Colegios</span>
            </button>

            <button
              id="btn-acceso-familias-header"
              onClick={() => onOpenFamilias()}
              className="px-4 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm shadow-amber-400/30 transition-all flex items-center gap-2 cursor-pointer active:scale-98"
            >
              <Search className="w-4 h-4" />
              <span>Acceso Familias</span>
            </button>
          </div>

          {/* Mobile hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              id="btn-acceso-familias-mobile"
              onClick={() => onOpenFamilias()}
              className="px-3 py-1.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-xs flex items-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Fotos</span>
            </button>
            <button
              id="btn-toggle-menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-2">
            <button
              onClick={() => handleNavClick('instituciones')}
              className="text-left px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-md"
            >
              Para Colegios
            </button>
            <button
              onClick={() => handleNavClick('familias')}
              className="text-left px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-md"
            >
              Para Familias
            </button>
            <button
              onClick={() => handleNavClick('proceso')}
              className="text-left px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-md"
            >
              Cómo Funciona
            </button>
            <button
              onClick={() => handleNavClick('muestrario')}
              className="text-left px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-md"
            >
              Kits y Productos
            </button>
            <button
              onClick={() => handleNavClick('faq')}
              className="text-left px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-md"
            >
              Preguntas Frecuentes
            </button>
            <button
              onClick={() => handleNavClick('contacto')}
              className="text-left px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-md"
            >
              Contacto
            </button>
          </nav>
          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenFamilias();
              }}
              className="w-full py-2.5 px-4 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm rounded-lg text-center flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>Acceso Familias (Ver fotos)</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenInstituciones();
              }}
              className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm rounded-lg text-center flex items-center justify-center gap-2"
            >
              <GraduationCap className="w-4 h-4 text-slate-600" />
              <span>Solicitar Propuesta Institucional</span>
            </button>
            {onOpenAdmin && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className="w-full py-2 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-lg text-center flex items-center justify-center gap-2"
              >
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>Acceso Fotógrafo (Admin)</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
