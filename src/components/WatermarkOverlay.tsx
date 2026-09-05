import React from 'react';

interface WatermarkOverlayProps {
  visible?: boolean;
  text?: string;
  density?: 'normal' | 'dense';
  opacity?: number;
}

export default function WatermarkOverlay({
  visible = true,
  text = 'MUESTRAINFOCUS SCHOOLS ·',
  density = 'dense',
  opacity = 0.58,
}: WatermarkOverlayProps) {
  if (!visible) return null;

  // Generates repeated diagonal watermark rows matching the exact InFocus Schools official sample
  const rowCount = density === 'dense' ? 14 : 9;
  const repeatPerLine = 8;

  return (
    <div
      className="absolute inset-0 pointer-events-none select-none overflow-hidden z-20 flex items-center justify-center"
      aria-hidden="true"
    >
      <div
        className="w-[260%] h-[260%] flex flex-col justify-between -rotate-30 select-none"
        style={{ opacity }}
      >
        {Array.from({ length: rowCount }).map((_, rIdx) => (
          <div
            key={rIdx}
            className="flex justify-around items-center whitespace-nowrap font-black uppercase text-white tracking-widest text-[12px] sm:text-[14px]"
            style={{
              textShadow:
                '0 1px 2px rgba(0, 0, 0, 0.9), 0 0 2px rgba(0, 0, 0, 0.7), 0 2px 4px rgba(0,0,0,0.5)',
              transform: rIdx % 2 === 0 ? 'translateX(-40px)' : 'translateX(40px)',
            }}
          >
            {Array.from({ length: repeatPerLine }).map((_, cIdx) => (
              <span key={cIdx} className="mx-3 inline-block">
                {text}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
