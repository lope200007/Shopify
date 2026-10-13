import React from "react";
import { useCurrentFrame } from "remotion";
import { C } from "../marca";

// Aleatorio con semilla: el mismo dibujo en cada fotograma y en cada render.
export const azar = (semilla: number) => {
  let s = semilla >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
};

export const CieloNoche: React.FC<{ arriba?: string; abajo?: string; estrellas?: number; alto?: number }> = ({
  arriba = C.nocheArriba,
  abajo = C.nocheAbajo,
  estrellas = 90,
  alto = 1080,
}) => {
  const frame = useCurrentFrame();
  const r = azar(11);
  const lista = Array.from({ length: estrellas }, () => ({
    x: r() * 1920,
    y: r() * alto * 0.75,
    t: 1.5 + r() * 3.5,
    f: r() * 6.28,
    v: 0.6 + r() * 1.8,
  }));
  return (
    <g>
      <defs>
        <linearGradient id="cielo-noche" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={arriba} />
          <stop offset="100%" stopColor={abajo} />
        </linearGradient>
      </defs>
      <rect x={-400} y={-600} width={2720} height={alto + 1200} fill="url(#cielo-noche)" />
      {lista.map((e, i) => {
        const brillo = 0.45 + 0.55 * Math.max(0, Math.sin(frame * 0.05 * e.v + e.f));
        return i % 9 === 0 ? (
          <g key={i} transform={`translate(${e.x} ${e.y}) scale(${0.6 + brillo * 0.6})`} opacity={brillo}>
            <path d="M 0 -9 L 2 -2 L 9 0 L 2 2 L 0 9 L -2 2 L -9 0 L -2 -2 Z" fill="#FFF6C9" />
          </g>
        ) : (
          <circle key={i} cx={e.x} cy={e.y} r={e.t * 0.6} fill="#FFFFFF" opacity={0.35 + brillo * 0.5} />
        );
      })}
    </g>
  );
};

const Arbol: React.FC<{ x: number; y: number; s: number; tono: string; tonoClaro: string; tronco?: string }> = ({
  x,
  y,
  s,
  tono,
  tonoClaro,
  tronco = "#5B3A29",
}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -18 0 L -12 -150 Q 0 -160 12 -150 L 18 0 Z" fill={tronco} stroke={C.contorno} strokeWidth={5} strokeLinejoin="round" />
    <circle cx={-58} cy={-170} r={62} fill={tono} stroke={C.contorno} strokeWidth={5} />
    <circle cx={58} cy={-176} r={58} fill={tono} stroke={C.contorno} strokeWidth={5} />
    <circle cx={0} cy={-238} r={78} fill={tono} stroke={C.contorno} strokeWidth={5} />
    <circle cx={-6} cy={-196} r={70} fill={tono} />
    <path d="M -40 -270 Q -10 -300 30 -284" stroke={tonoClaro} strokeWidth={14} strokeLinecap="round" fill="none" opacity={0.6} />
    <path d="M -96 -186 Q -86 -214 -62 -222" stroke={tonoClaro} strokeWidth={10} strokeLinecap="round" fill="none" opacity={0.5} />
  </g>
);

const Seta: React.FC<{ x: number; y: number; s: number; brilla?: boolean }> = ({ x, y, s, brilla = true }) => {
  const frame = useCurrentFrame();
  const b = 0.6 + 0.4 * Math.sin(frame * 0.07 + x);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M -12 0 Q -14 -30 -8 -40 L 8 -40 Q 14 -30 12 0 Z" fill="#FFF1DC" stroke={C.contorno} strokeWidth={4} />
      <path d="M -40 -36 Q -38 -78 0 -80 Q 38 -78 40 -36 Q 0 -26 -40 -36 Z" fill="#E85D75" stroke={C.contorno} strokeWidth={4} />
      {[
        [-20, -56, 7],
        [8, -66, 6],
        [24, -46, 5],
      ].map(([cx, cy, r], i) => (
        <g key={i}>
          {brilla ? <circle cx={cx} cy={cy} r={r * 2.6} fill="#9BF6FF" opacity={0.25 * b} /> : null}
          <circle cx={cx} cy={cy} r={r} fill={brilla ? "#CFFBFF" : "#FFFFFF"} />
        </g>
      ))}
    </g>
  );
};

const Mata: React.FC<{ x: number; y: number; s: number; tono: string }> = ({ x, y, s, tono }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <circle cx={-34} cy={-26} r={34} fill={tono} stroke={C.contorno} strokeWidth={5} />
    <circle cx={30} cy={-28} r={36} fill={tono} stroke={C.contorno} strokeWidth={5} />
    <circle cx={0} cy={-46} r={42} fill={tono} stroke={C.contorno} strokeWidth={5} />
    <rect x={-60} y={-30} width={120} height={30} fill={tono} />
  </g>
);

export const MontonHojas: React.FC<{ x: number; y: number; s?: number; sacudida?: number }> = ({ x, y, s = 1, sacudida = 0 }) => {
  const r = azar(5);
  const hojas = Array.from({ length: 34 }, () => ({
    x: (r() - 0.5) * 220,
    y: -r() * 70 * (1 - Math.abs(r() - 0.5)),
    a: r() * 360,
    c: ["#E9883A", "#D9534F", "#F2C14E", "#B5651D"][Math.floor(r() * 4)],
  }));
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={0} cy={-6} rx={130} ry={34} fill="#B5651D" stroke={C.contorno} strokeWidth={5} />
      {hojas.map((h, i) => (
        <g key={i} transform={`translate(${h.x + Math.sin(i + sacudida) * sacudida * 6} ${h.y - 18 - Math.abs(Math.cos(i * 1.7)) * sacudida * 30}) rotate(${h.a + sacudida * 40})`}>
          <path d="M -14 0 Q 0 -10 14 0 Q 0 10 -14 0 Z" fill={h.c} stroke={C.contorno} strokeWidth={2.5} />
        </g>
      ))}
    </g>
  );
};

export const LucesFlotantes: React.FC<{ n?: number; semilla?: number; ancho?: number; alto?: number; y0?: number }> = ({
  n = 14,
  semilla = 3,
  ancho = 1920,
  alto = 500,
  y0 = 420,
}) => {
  const frame = useCurrentFrame();
  const r = azar(semilla);
  const ls = Array.from({ length: n }, () => ({ x: r() * ancho, y: y0 + r() * alto, v: 0.3 + r(), f: r() * 6.28 }));
  return (
    <g>
      {ls.map((l, i) => {
        const x = l.x + Math.sin(frame * 0.02 * l.v + l.f) * 40;
        const y = l.y + Math.cos(frame * 0.017 * l.v + l.f) * 25;
        const b = 0.3 + 0.7 * Math.max(0, Math.sin(frame * 0.06 * l.v + l.f));
        return (
          <g key={i} opacity={b}>
            <circle cx={x} cy={y} r={14} fill="#FFE97A" opacity={0.25} />
            <circle cx={x} cy={y} r={4} fill="#FFF7C2" />
          </g>
        );
      })}
    </g>
  );
};

/**
 * El claro del bosque de noche. `camX` desplaza la cámara (paralaje:
 * lo lejano se mueve menos). `suelo` es la altura del suelo (y).
 */
export const BosqueNoche: React.FC<{ camX?: number; suelo?: number; hojas?: boolean; sacudidaHojas?: number }> = ({
  camX = 0,
  suelo = 900,
  hojas = false,
  sacudidaHojas = 0,
}) => (
  <g>
    {/* colinas lejanas */}
    <g transform={`translate(${-camX * 0.2} 0)`}>
      <path d={`M -300 ${suelo - 120} Q 200 ${suelo - 330} 640 ${suelo - 150} Q 1000 ${suelo - 360} 1400 ${suelo - 170} Q 1800 ${suelo - 320} 2300 ${suelo - 140} L 2300 1200 L -300 1200 Z`} fill="#2A2466" />
    </g>
    {/* árboles del fondo */}
    <g transform={`translate(${-camX * 0.45} 0)`} opacity={0.95}>
      <Arbol x={-60} y={suelo - 40} s={1.15} tono="#24506A" tonoClaro="#2F6B86" tronco="#2B2140" />
      <Arbol x={420} y={suelo - 70} s={0.85} tono="#24506A" tonoClaro="#2F6B86" tronco="#2B2140" />
      <Arbol x={1560} y={suelo - 60} s={0.95} tono="#24506A" tonoClaro="#2F6B86" tronco="#2B2140" />
      <Arbol x={2050} y={suelo - 40} s={1.2} tono="#24506A" tonoClaro="#2F6B86" tronco="#2B2140" />
    </g>
    {/* suelo */}
    <path d={`M -400 ${suelo - 30} Q 400 ${suelo - 70} 960 ${suelo - 40} Q 1500 ${suelo - 10} 2400 ${suelo - 50} L 2400 1400 L -400 1400 Z`} fill={C.verdeBosque} stroke={C.contorno} strokeWidth={5} />
    <path d={`M -400 ${suelo + 40} Q 600 ${suelo + 10} 1100 ${suelo + 50} Q 1600 ${suelo + 80} 2400 ${suelo + 30} L 2400 1400 L -400 1400 Z`} fill={C.verdeOscuro} opacity={0.5} />
    {/* árboles de primer plano y adornos */}
    <g transform={`translate(${-camX} 0)`}>
      <Arbol x={150} y={suelo + 10} s={1.45} tono={C.verdeClaro} tonoClaro="#8EE0A6" />
      <Arbol x={1830} y={suelo + 20} s={1.55} tono={C.verdeClaro} tonoClaro="#8EE0A6" />
      <Mata x={520} y={suelo - 10} s={1} tono="#3F9E6B" />
      <Mata x={1420} y={suelo} s={1.15} tono="#3F9E6B" />
      <Seta x={380} y={suelo + 8} s={1.1} />
      <Seta x={430} y={suelo + 14} s={0.7} />
      <Seta x={1560} y={suelo + 16} s={0.9} />
      {[260, 700, 980, 1250, 1700].map((gx, i) => (
        <path key={i} d={`M ${gx} ${suelo + 30} l -8 -26 l 8 14 l 6 -30 l 4 30 l 10 -20 l -6 32 Z`} fill="#6FD08C" stroke={C.contorno} strokeWidth={3} strokeLinejoin="round" />
      ))}
      {hojas ? <MontonHojas x={1180} y={suelo + 40} s={1.2} sacudida={sacudidaHojas} /> : null}
    </g>
  </g>
);
