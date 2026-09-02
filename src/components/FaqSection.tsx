import { useState } from 'react';
import { HelpCircle, ChevronDown, Users, School } from 'lucide-react';
import { PREGUNTAS_FRECUENTES } from '../data/colegiosData';

export default function FaqSection() {
  const [tab, setTab] = useState<'familias' | 'colegios'>('familias');
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggle = (i: number) => {
    setOpenIdx(openIdx === i ? null : i);
  };

  const list = tab === 'familias' ? PREGUNTAS_FRECUENTES.familias : PREGUNTAS_FRECUENTES.colegios;

  return (
    <section id="faq" className="py-16 lg:py-24 bg-white border-b border-slate-200/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-widest px-3 py-1 bg-slate-100 rounded-full border border-slate-200 inline-block mb-3">
            Dudas y Consultas Frecuentes
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-['Outfit']">
            Todo lo que necesitás saber
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2">
            Respuestas claras y directas tanto para padres como para directores escolares.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center gap-3 mb-8">
          <button
            onClick={() => {
              setTab('familias');
              setOpenIdx(0);
            }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              tab === 'familias'
                ? 'bg-amber-400 text-slate-950 shadow-sm shadow-amber-400/30'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Preguntas de Familias</span>
          </button>

          <button
            onClick={() => {
              setTab('colegios');
              setOpenIdx(0);
            }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              tab === 'colegios'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <School className="w-4 h-4" />
            <span>Preguntas de Colegios</span>
          </button>
        </div>

        {/* Accordion list */}
        <div className="space-y-3 text-left">
          {list.map((item, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className={`rounded-2xl border transition-all ${
                  isOpen
                    ? 'border-amber-400/80 bg-amber-50/20 shadow-xs'
                    : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between text-left cursor-pointer"
                >
                  <span className="text-sm sm:text-base font-bold text-slate-900 pr-4">
                    {item.pregunta}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-500 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-amber-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-5 sm:px-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100/80 pt-3">
                    {item.respuesta}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
