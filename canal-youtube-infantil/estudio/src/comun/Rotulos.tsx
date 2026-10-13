import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FUENTE_TEXTO, FUENTE_TITULO } from "../marca";

/** Rótulo grande que aparece con un pequeño rebote. Pocas palabras: muchos niños aún no leen. */
export const Rotulo: React.FC<{
  texto: string;
  x: number;
  y: number;
  desde: number;
  hasta?: number;
  tam?: number;
  color?: string;
  fondo?: string;
  rot?: number;
}> = ({ texto, x, y, desde, hasta = 99999, tam = 76, color = C.texto, fondo = "#FFFFFF", rot = -3 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < desde || frame > hasta + 10) return null;
  const entra = spring({ frame: frame - desde, fps, config: { damping: 11, stiffness: 160 } });
  const sale = interpolate(frame, [hasta, hasta + 10], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const s = entra * sale;
  const ancho = texto.length * tam * 0.58 + tam * 0.9;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <rect x={-ancho / 2} y={-tam * 0.85} width={ancho} height={tam * 1.35} rx={tam * 0.5} fill={fondo} stroke={C.contorno} strokeWidth={6} />
      <text y={tam * 0.28} textAnchor="middle" fontFamily={FUENTE_TITULO} fontWeight={800} fontSize={tam} fill={color}>
        {texto}
      </text>
    </g>
  );
};

/** Transición de iris (círculo que se cierra/abre), la clásica de los dibujos. */
export const Iris: React.FC<{ duracion: number; centro?: [number, number]; entrada?: number; salida?: number }> = ({
  duracion,
  centro = [960, 540],
  entrada = 14,
  salida = 14,
}) => {
  const frame = useCurrentFrame();
  const max = 1200;
  const r = Math.min(
    interpolate(frame, [0, entrada], [0, max], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    interpolate(frame, [duracion - salida, duracion], [max, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
  );
  if (r >= max) return null;
  return (
    <g>
      <defs>
        <mask id="iris-mascara">
          <rect x={0} y={0} width={1920} height={1080} fill="#FFFFFF" />
          <circle cx={centro[0]} cy={centro[1]} r={r} fill="#000000" />
        </mask>
      </defs>
      <rect x={0} y={0} width={1920} height={1080} fill="#140F3D" mask="url(#iris-mascara)" />
    </g>
  );
};

/** Logotipo del canal: el nombre en dos alturas. */
export const Logo: React.FC<{ x: number; y: number; escala?: number }> = ({ x, y, escala = 1 }) => {
  return (
    <g transform={`translate(${x} ${y}) scale(${escala})`}>
      <text
        textAnchor="middle"
        fontFamily={FUENTE_TITULO}
        fontWeight={800}
        fontSize={150}
        fill={C.luzAmarilla}
        stroke={C.contorno}
        strokeWidth={14}
        paintOrder="stroke"
        strokeLinejoin="round"
      >
        Farolín
      </text>
      <text
        y={128}
        textAnchor="middle"
        fontFamily={FUENTE_TITULO}
        fontWeight={800}
        fontSize={96}
        fill="#FFFFFF"
        stroke={C.contorno}
        strokeWidth={12}
        paintOrder="stroke"
        strokeLinejoin="round"
      >
        y Galleta
      </text>
    </g>
  );
};

/** Burbuja redonda que enseña lo que ve un personaje (como una lupa). */
export const Burbuja: React.FC<{ x: number; y: number; r: number; visible: number; titulo?: string; children: React.ReactNode }> = ({
  x,
  y,
  r,
  visible,
  titulo,
  children,
}) => {
  if (visible <= 0.01) return null;
  return (
    <g transform={`translate(${x} ${y}) scale(${visible})`}>
      <defs>
        <clipPath id="burbuja-clip">
          <circle r={r} />
        </clipPath>
      </defs>
      <circle r={r + 14} fill="#FFFFFF" stroke={C.contorno} strokeWidth={6} />
      <g clipPath="url(#burbuja-clip)">
        <rect x={-r} y={-r} width={2 * r} height={2 * r} fill="#140F3D" />
        {children}
      </g>
      <circle r={r} fill="none" stroke={C.contorno} strokeWidth={5} />
      {titulo ? (
        <g transform={`translate(0 ${r + 46})`}>
          <rect x={-titulo.length * 15 - 24} y={-34} width={titulo.length * 30 + 48} height={56} rx={28} fill={C.luzAmarilla} stroke={C.contorno} strokeWidth={5} />
          <text y={6} textAnchor="middle" fontFamily={FUENTE_TEXTO} fontWeight={700} fontSize={36} fill={C.texto}>
            {titulo}
          </text>
        </g>
      ) : null}
    </g>
  );
};
