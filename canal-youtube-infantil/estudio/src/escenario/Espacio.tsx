import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { C, FUENTE_TITULO } from "../marca";

export const Tierra: React.FC<{ x: number; y: number; r: number; giro?: number; id: string }> = ({ x, y, r, giro = 0, id }) => (
  <g transform={`translate(${x} ${y})`}>
    <defs>
      <clipPath id={`${id}-clip`}>
        <circle r={r} />
      </clipPath>
      <radialGradient id={`${id}-mar`} cx="35%" cy="30%">
        <stop offset="0%" stopColor="#7FD3FF" />
        <stop offset="100%" stopColor="#2C7BE5" />
      </radialGradient>
    </defs>
    <circle r={r} fill={`url(#${id}-mar)`} />
    <g clipPath={`url(#${id}-clip)`}>
      <g transform={`translate(${((giro % 1) * 4 - 2) * r} 0)`}>
        {[-4, -2, 0, 2].map((k) => (
          <g key={k} transform={`translate(${k * r} 0)`}>
            <path d={`M ${-0.6 * r} ${-0.5 * r} q ${0.3 * r} ${-0.3 * r} ${0.6 * r} ${-0.1 * r} q ${0.2 * r} ${0.3 * r} ${-0.1 * r} ${0.5 * r} q ${-0.3 * r} ${0.2 * r} ${-0.5 * r} ${-0.1 * r} Z`} fill="#58C46B" />
            <path d={`M ${0.2 * r} ${0.1 * r} q ${0.4 * r} ${-0.1 * r} ${0.5 * r} ${0.3 * r} q ${-0.1 * r} ${0.4 * r} ${-0.4 * r} ${0.3 * r} q ${-0.3 * r} ${-0.2 * r} ${-0.1 * r} ${-0.6 * r} Z`} fill="#58C46B" />
          </g>
        ))}
      </g>
      <ellipse cx={-0.2 * r} cy={-0.62 * r} rx={0.5 * r} ry={0.08 * r} fill="#FFFFFF" opacity={0.75} />
      <ellipse cx={0.3 * r} cy={0.55 * r} rx={0.45 * r} ry={0.07 * r} fill="#FFFFFF" opacity={0.7} />
    </g>
    <circle r={r} fill="none" stroke={C.contorno} strokeWidth={Math.max(2, r * 0.07)} />
  </g>
);

export const LunaGris: React.FC<{ x: number; y: number; r: number }> = ({ x, y, r }) => (
  <g transform={`translate(${x} ${y})`}>
    <circle r={r * 2.5} fill="#FFF4C2" opacity={0.25} />
    <circle r={r} fill="#E9E4D4" stroke={C.contorno} strokeWidth={Math.max(1.5, r * 0.12)} />
    <circle cx={-0.3 * r} cy={-0.2 * r} r={0.22 * r} fill="#C9C1AA" />
    <circle cx={0.3 * r} cy={0.25 * r} r={0.18 * r} fill="#C9C1AA" />
  </g>
);

/** Fila de 30 Tierras entre la Tierra y la Luna, apareciendo una a una. */
export const FilaTierras: React.FC<{ inicio: number; duracion: number; y?: number }> = ({ inicio, duracion, y = 560 }) => {
  const frame = useCurrentFrame();
  const r = 26;
  const x0 = 90;
  const total = 30;
  const visibles = Math.floor(
    interpolate(frame, [inicio, inicio + duracion], [0, total], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
  );
  // 30 diámetros de Tierra entre las dos superficies (NASA: «cabrían 30 Tierras»)
  const lunaX = x0 + r + 2 * r * total + r * 0.27;
  return (
    <g>
      <Tierra x={x0} y={y} r={r} id="tierra-origen" />
      <text x={x0} y={y + 70} textAnchor="middle" fontFamily={FUENTE_TITULO} fontWeight={800} fontSize={34} fill="#FFFFFF">
        Tierra
      </text>
      {Array.from({ length: total }, (_, i) => {
        const aparece = i < visibles;
        const local = frame - (inicio + (i / total) * duracion);
        const s = aparece ? interpolate(local, [0, 5, 9], [0.2, 1.15, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
        return (
          <g key={i} transform={`translate(${x0 + 2 * r * (i + 1)} ${y}) scale(${s})`} opacity={aparece ? 0.9 : 0}>
            <Tierra x={0} y={0} r={r * 0.92} id={`tf-${i}`} />
          </g>
        );
      })}
      <LunaGris x={lunaX} y={y} r={r * 0.27} />
      <circle cx={lunaX} cy={y} r={22 + 6 * Math.sin(frame * 0.25)} fill="none" stroke="#FFF4C2" strokeWidth={4} opacity={0.8} />
      <text x={lunaX} y={y + 70} textAnchor="middle" fontFamily={FUENTE_TITULO} fontWeight={800} fontSize={34} fill="#FFF4C2">
        Luna
      </text>
      {/* contador */}
      <g transform={`translate(960 ${y - 190})`} opacity={visibles > 0 ? 1 : 0}>
        <circle r={86} fill="#FFFFFF" stroke={C.contorno} strokeWidth={6} />
        <text y={34} textAnchor="middle" fontFamily={FUENTE_TITULO} fontWeight={800} fontSize={100} fill={C.texto}>
          {visibles}
        </text>
      </g>
    </g>
  );
};

export const Sol: React.FC<{ x: number; y: number; r: number; cara?: boolean }> = ({ x, y, r, cara = true }) => {
  const frame = useCurrentFrame();
  return (
    <g transform={`translate(${x} ${y})`}>
      <defs>
        <radialGradient id={`sol-halo-${Math.round(x)}-${Math.round(y)}`}>
          <stop offset="0%" stopColor="#FFE680" stopOpacity={0.55} />
          <stop offset="100%" stopColor="#FFE680" stopOpacity={0} />
        </radialGradient>
      </defs>
      <circle r={r * 2.2} fill={`url(#sol-halo-${Math.round(x)}-${Math.round(y)})`} />
      <g transform={`rotate(${frame * 0.4})`}>
        {Array.from({ length: 12 }, (_, i) => (
          <path key={i} d={`M ${-r * 0.16} ${-r * 1.08} L 0 ${-r * 1.48} L ${r * 0.16} ${-r * 1.08} Z`} fill="#FFB627" stroke={C.contorno} strokeWidth={4} transform={`rotate(${i * 30})`} strokeLinejoin="round" />
        ))}
      </g>
      <circle r={r} fill="#FFD23F" stroke={C.contorno} strokeWidth={6} />
      {cara ? (
        <g>
          <circle cx={-r * 0.32} cy={-r * 0.12} r={r * 0.1} fill={C.contorno} />
          <circle cx={r * 0.32} cy={-r * 0.12} r={r * 0.1} fill={C.contorno} />
          <path d={`M ${-r * 0.35} ${r * 0.22} Q 0 ${r * 0.52} ${r * 0.35} ${r * 0.22}`} stroke={C.contorno} strokeWidth={6} fill="none" strokeLinecap="round" />
          <ellipse cx={-r * 0.55} cy={r * 0.15} rx={r * 0.13} ry={r * 0.08} fill="#FF8FA3" opacity={0.6} />
          <ellipse cx={r * 0.55} cy={r * 0.15} rx={r * 0.13} ry={r * 0.08} fill="#FF8FA3" opacity={0.6} />
        </g>
      ) : null}
    </g>
  );
};

/** Un astronauta genérico saltando en la luna con una piedra. */
export const Astronauta: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) => {
  const frame = useCurrentFrame();
  const bote = Math.abs(Math.sin(frame * 0.06)) * 60;
  return (
    <g transform={`translate(${x} ${y - bote}) scale(${s})`}>
      {/* mochila */}
      <rect x={-46} y={-150} width={92} height={110} rx={18} fill="#D9DEE8" stroke={C.contorno} strokeWidth={5} />
      {/* cuerpo */}
      <rect x={-56} y={-130} width={112} height={120} rx={46} fill="#FFFFFF" stroke={C.contorno} strokeWidth={5} />
      <rect x={-22} y={-96} width={44} height={30} rx={6} fill="#E63946" opacity={0.85} />
      {/* piernas */}
      <rect x={-46} y={-30} width={38} height={60} rx={16} fill="#FFFFFF" stroke={C.contorno} strokeWidth={5} />
      <rect x={8} y={-30} width={38} height={60} rx={16} fill="#FFFFFF" stroke={C.contorno} strokeWidth={5} />
      {/* brazos */}
      <rect x={-86} y={-128} width={36} height={70} rx={16} fill="#FFFFFF" stroke={C.contorno} strokeWidth={5} transform="rotate(20 -68 -128)" />
      <rect x={50} y={-128} width={36} height={70} rx={16} fill="#FFFFFF" stroke={C.contorno} strokeWidth={5} transform="rotate(-140 68 -128)" />
      {/* piedra en la mano levantada */}
      <path d="M 96 -222 l 26 -10 l 18 14 l -6 24 l -28 6 l -14 -16 Z" fill="#9E9686" stroke={C.contorno} strokeWidth={4} strokeLinejoin="round" />
      {/* casco */}
      <circle cx={0} cy={-176} r={58} fill="#FFFFFF" stroke={C.contorno} strokeWidth={5} />
      <ellipse cx={0} cy={-174} rx={42} ry={34} fill="#2C3E73" />
      <ellipse cx={-14} cy={-186} rx={14} ry={9} fill="#FFFFFF" opacity={0.6} />
    </g>
  );
};

export const SueloLunar: React.FC<{ y: number }> = ({ y }) => (
  <g>
    <path d={`M -100 ${y} Q 400 ${y - 40} 900 ${y} Q 1400 ${y + 30} 2100 ${y - 20} L 2100 1200 L -100 1200 Z`} fill="#BEB8A8" stroke={C.contorno} strokeWidth={6} />
    {[
      [300, y + 80, 70],
      [820, y + 140, 50],
      [1300, y + 90, 90],
      [1700, y + 160, 40],
    ].map(([cx, cy, r], i) => (
      <ellipse key={i} cx={cx} cy={cy} rx={r} ry={r * 0.3} fill="#A39D8C" stroke={C.contorno} strokeWidth={4} />
    ))}
  </g>
);
