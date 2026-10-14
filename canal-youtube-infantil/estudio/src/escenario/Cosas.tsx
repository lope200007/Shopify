import React from "react";
import { useCurrentFrame } from "remotion";
import { C, FUENTE_TEXTO, FUENTE_TITULO } from "../marca";
import { HuellaDino } from "./Huellas";

// Objetos para comparar y explicar: autobús, plátano, dientes, ámbar…

/** Autobús visto de lado, mirando a la derecha. Origen: suelo, extremo izquierdo. */
export const Autobus: React.FC<{ x: number; y: number; largo?: number; color?: string; opacidad?: number }> = ({
  x,
  y,
  largo = 560,
  color = "#FFC93C",
  opacidad = 1,
}) => {
  const ventanas = Math.max(2, Math.round((largo - 260) / 90));
  const anchoV = (largo - 250) / ventanas;
  return (
    <g transform={`translate(${x} ${y})`} opacity={opacidad}>
      <ellipse cx={largo / 2} cy={2} rx={largo / 2 + 10} ry={12} fill="#000000" opacity={0.15} />
      <rect x={0} y={-206} width={largo} height={176} rx={30} fill={color} stroke={C.contorno} strokeWidth={6} />
      <rect x={0} y={-92} width={largo} height={22} fill="#FF8C42" />
      <rect x={0} y={-206} width={largo} height={176} rx={30} fill="none" stroke={C.contorno} strokeWidth={6} />
      {Array.from({ length: ventanas }, (_, i) => (
        <rect key={i} x={40 + i * anchoV} y={-184} width={anchoV - 16} height={66} rx={12} fill="#BDE7FF" stroke={C.contorno} strokeWidth={4} />
      ))}
      {/* puerta y parabrisas */}
      <rect x={largo - 200} y={-184} width={56} height={140} rx={8} fill="#BDE7FF" stroke={C.contorno} strokeWidth={4} />
      <path d={`M ${largo - 126} -184 L ${largo - 30} -184 Q ${largo - 12} -184 ${largo - 12} -160 L ${largo - 12} -110 L ${largo - 126} -110 Z`} fill="#BDE7FF" stroke={C.contorno} strokeWidth={4} />
      <circle cx={largo - 14} cy={-62} r={10} fill="#FFF7C2" stroke={C.contorno} strokeWidth={3} />
      {[110, largo - 130].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy={-30} r={38} fill="#3A3350" stroke={C.contorno} strokeWidth={5} />
          <circle cx={cx} cy={-30} r={15} fill="#D9D4E8" />
        </g>
      ))}
    </g>
  );
};

/** Plátano. Origen en el centro; mide unos 200 de punta a punta. */
export const Platano: React.FC<{ x: number; y: number; escala?: number; rot?: number }> = ({ x, y, escala = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${escala})`}>
    <path d="M -100 -12 C -60 46 60 46 100 -20 C 104 -30 96 -36 88 -28 C 48 12 -48 14 -88 -20 C -96 -26 -104 -22 -100 -12 Z" fill="#FFD84A" stroke={C.contorno} strokeWidth={5} strokeLinejoin="round" />
    <path d="M -76 -6 C -40 22 40 22 76 -14" stroke="#FFF2A8" strokeWidth={6} fill="none" strokeLinecap="round" />
    <path d="M -100 -12 L -110 -16 L -104 -24 L -96 -20" fill="#6B4A2B" stroke={C.contorno} strokeWidth={3} strokeLinejoin="round" />
    <circle cx={96} cy={-26} r={6} fill="#6B4A2B" />
  </g>
);

/** Diente afilado y curvo, con el borde de sierra (para comer carne). Origen en la base. */
export const DienteAfilado: React.FC<{ x: number; y: number; escala?: number; rot?: number; color?: string }> = ({ x, y, escala = 1, rot = 0, color = "#FFF6DD" }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${escala})`}>
    <path d="M -40 0 C -42 -90 -22 -168 30 -220 C 20 -150 42 -80 40 0 Z" fill={color} stroke={C.contorno} strokeWidth={5} strokeLinejoin="round" />
    <path d="M 32 -196 l 6 6 l -4 8 l 6 6 l -4 8 l 6 6 l -4 8" stroke={C.contorno} strokeWidth={3} fill="none" strokeLinejoin="round" />
    <path d="M -24 -20 C -24 -80 -10 -140 16 -184" stroke="#FFFFFF" strokeWidth={8} fill="none" strokeLinecap="round" opacity={0.8} />
  </g>
);

/** Diente ancho con forma de cuchara (para arrancar hojas). Origen en la base. */
export const DienteCuchara: React.FC<{ x: number; y: number; escala?: number; rot?: number; color?: string }> = ({ x, y, escala = 1, rot = 0, color = "#FFF6DD" }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${escala})`}>
    <path d="M -18 0 L -16 -110 C -46 -132 -48 -206 0 -222 C 48 -206 46 -132 16 -110 L 18 0 Z" fill={color} stroke={C.contorno} strokeWidth={5} strokeLinejoin="round" />
    <ellipse cx={0} cy={-166} rx={20} ry={36} fill="#EADFC2" />
    <path d="M -26 -150 C -30 -180 -20 -204 0 -210" stroke="#FFFFFF" strokeWidth={7} fill="none" strokeLinecap="round" opacity={0.8} />
  </g>
);

/** Gota de ámbar (resina de árbol) con una luciérnaga dentro. */
export const Ambar: React.FC<{ x: number; y: number; escala?: number; brillo?: number; id: string }> = ({ x, y, escala = 1, brillo = 1, id }) => {
  const frame = useCurrentFrame();
  const latido = 0.75 + 0.25 * Math.sin(frame * 0.15);
  return (
    <g transform={`translate(${x} ${y}) scale(${escala})`}>
      <defs>
        <radialGradient id={`${id}-ambar`} cx="40%" cy="35%">
          <stop offset="0%" stopColor="#FFE29A" />
          <stop offset="55%" stopColor="#F5A623" />
          <stop offset="100%" stopColor="#C8641E" />
        </radialGradient>
        <radialGradient id={`${id}-luz`}>
          <stop offset="0%" stopColor="#FFF4A3" stopOpacity={0.95} />
          <stop offset="100%" stopColor="#FFE14D" stopOpacity={0} />
        </radialGradient>
      </defs>
      <path d="M 0 -130 C 64 -64 96 -10 86 44 C 76 104 -76 104 -86 44 C -96 -10 -64 -64 0 -130 Z" fill={`url(#${id}-ambar)`} stroke={C.contorno} strokeWidth={6} opacity={0.95} />
      {/* luciérnaga atrapada: cabeza, cuerpo y farolillo */}
      <g transform="translate(-6 26) rotate(-20) scale(1.6)">
        <circle cx={22} cy={14} r={34 * latido * brillo} fill={`url(#${id}-luz)`} />
        <ellipse cx={-14} cy={0} rx={12} ry={11} fill="#7A3B1E" stroke={C.contorno} strokeWidth={3} />
        <ellipse cx={4} cy={4} rx={14} ry={11} fill="#5A2D18" stroke={C.contorno} strokeWidth={3} />
        <ellipse cx={24} cy={10} rx={13} ry={10} fill="#FFE14D" stroke={C.contorno} strokeWidth={3} opacity={0.6 + 0.4 * latido * brillo} />
        <path d="M -20 -8 q -8 -14 -16 -16 M -12 -10 q -2 -16 -10 -22" stroke={C.contorno} strokeWidth={2.5} fill="none" />
        <ellipse cx={0} cy={-8} rx={10} ry={5} fill="#FFFFFF" opacity={0.5} />
      </g>
      <path d="M -40 -40 C -54 -10 -56 20 -48 44" stroke="#FFFFFF" strokeWidth={10} fill="none" strokeLinecap="round" opacity={0.55} />
      <circle cx={-30} cy={-62} r={7} fill="#FFFFFF" opacity={0.8} />
    </g>
  );
};

/** Hueso de dibujos animados. */
export const Hueso: React.FC<{ x: number; y: number; escala?: number; rot?: number }> = ({ x, y, escala = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${escala})`} fill="#F4EBD8" stroke={C.contorno} strokeWidth={5}>
    <circle cx={-90} cy={-18} r={24} />
    <circle cx={-90} cy={18} r={24} />
    <circle cx={90} cy={-18} r={24} />
    <circle cx={90} cy={18} r={24} />
    <rect x={-92} y={-18} width={184} height={36} stroke="none" />
    <path d="M -76 -18 L 76 -18 M -76 18 L 76 18" fill="none" />
  </g>
);

/** Lupa de detective (para la mano de Galleta). */
export const Lupa: React.FC<{ escala?: number; rot?: number }> = ({ escala = 1, rot = 0 }) => (
  <g transform={`rotate(${rot}) scale(${escala})`}>
    <path d="M 0 0 L 0 46" stroke={C.contorno} strokeWidth={16} strokeLinecap="round" />
    <path d="M 0 0 L 0 46" stroke="#8B5A2B" strokeWidth={9} strokeLinecap="round" />
    <circle cx={0} cy={80} r={36} fill="#CFEFFF" fillOpacity={0.55} stroke={C.contorno} strokeWidth={7} />
    <circle cx={0} cy={80} r={30} fill="none" stroke="#9AA6B8" strokeWidth={4} />
    <path d="M -14 66 Q -6 58 6 60" stroke="#FFFFFF" strokeWidth={5} fill="none" strokeLinecap="round" />
  </g>
);

/** Reloj de arena: el paso de muchísimo tiempo, sin destellos. */
export const RelojArena: React.FC<{ x: number; y: number; escala?: number; giro?: number; arena?: number }> = ({ x, y, escala = 1, giro = 0, arena = 0.5 }) => (
  <g transform={`translate(${x} ${y}) rotate(${giro}) scale(${escala})`}>
    <rect x={-56} y={-96} width={112} height={16} rx={6} fill="#B5651D" stroke={C.contorno} strokeWidth={5} />
    <rect x={-56} y={80} width={112} height={16} rx={6} fill="#B5651D" stroke={C.contorno} strokeWidth={5} />
    <path d="M -42 -80 C -42 -20 -6 -10 -6 0 C -6 10 -42 20 -42 80 L 42 80 C 42 20 6 10 6 0 C 6 -10 42 -20 42 -80 Z" fill="#E8F6FF" fillOpacity={0.7} stroke={C.contorno} strokeWidth={5} />
    <path d={`M -30 ${-74 + 60 * (1 - arena)} L 30 ${-74 + 60 * (1 - arena)} L 4 -6 L -4 -6 Z`} fill="#F2C14E" opacity={arena > 0.02 ? 1 : 0} />
    <path d={`M -38 76 L 38 76 L ${26 * (1 - arena)} ${76 - 56 * (1 - arena)} L ${-26 * (1 - arena)} ${76 - 56 * (1 - arena)} Z`} fill="#F2C14E" />
    <path d="M 0 -6 L 0 74" stroke="#F2C14E" strokeWidth={3} opacity={arena > 0.02 && arena < 0.98 ? 1 : 0} />
  </g>
);

/** Insignia de «lectora o lector de huellas»: la recompensa de identidad. */
export const Insignia: React.FC<{ x: number; y: number; escala?: number; texto: string; rot?: number }> = ({ x, y, escala = 1, texto, rot = 0 }) => {
  const puntas = 16;
  const estrella = Array.from({ length: puntas * 2 }, (_, i) => {
    const r = i % 2 ? 150 : 168;
    const a = (i / (puntas * 2)) * Math.PI * 2;
    return `${(Math.cos(a) * r).toFixed(1)} ${(Math.sin(a) * r).toFixed(1)}`;
  });
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${escala})`}>
      <path d="M -90 100 L -130 250 L -80 222 L -50 268 L -20 130 Z" fill={C.luzRosa} stroke={C.contorno} strokeWidth={6} strokeLinejoin="round" />
      <path d="M 90 100 L 130 250 L 80 222 L 50 268 L 20 130 Z" fill={C.luzTurquesa} stroke={C.contorno} strokeWidth={6} strokeLinejoin="round" />
      <path d={`M ${estrella.join(" L ")} Z`} fill={C.luzAmarilla} stroke={C.contorno} strokeWidth={7} strokeLinejoin="round" />
      <circle r={118} fill="#FFF7DA" stroke={C.contorno} strokeWidth={6} />
      <HuellaDino x={0} y={78} escala={0.62} modo="icono" color="#C98A4B" id="insignia-huella" />
      <g transform="translate(0 196)">
        <rect x={-texto.length * 15 - 30} y={-40} width={texto.length * 30 + 60} height={64} rx={32} fill="#FFFFFF" stroke={C.contorno} strokeWidth={6} />
        <text y={6} textAnchor="middle" fontFamily={FUENTE_TITULO} fontWeight={800} fontSize={42} fill={C.texto}>
          {texto}
        </text>
      </g>
    </g>
  );
};

/** Bocadillo de cómic con un sonido escrito («¡GRRR!», «¡hip!»). */
export const Onomatopeya: React.FC<{ x: number; y: number; texto: string; tam?: number; color?: string; visible: number; temblor?: number; rot?: number }> = ({
  x,
  y,
  texto,
  tam = 110,
  color = C.luzAmarilla,
  visible,
  temblor = 0,
  rot = -6,
}) => {
  const frame = useCurrentFrame();
  if (visible <= 0.01) return null;
  const dx = Math.sin(frame * 1.3) * temblor;
  const dy = Math.cos(frame * 1.7) * temblor;
  return (
    <g transform={`translate(${x + dx} ${y + dy}) rotate(${rot}) scale(${visible})`}>
      <text textAnchor="middle" fontFamily={FUENTE_TITULO} fontWeight={800} fontSize={tam} fill={color} stroke={C.contorno} strokeWidth={tam * 0.13} paintOrder="stroke" strokeLinejoin="round">
        {texto}
      </text>
    </g>
  );
};

/** Nota musical (para tararear). */
export const Nota: React.FC<{ x: number; y: number; escala?: number; opacidad?: number }> = ({ x, y, escala = 1, opacidad = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${escala})`} opacity={opacidad}>
    <path d="M 10 0 L 10 -52 L 36 -60 L 36 -44" stroke={C.contorno} strokeWidth={7} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <ellipse cx={0} cy={2} rx={14} ry={10} fill={C.contorno} transform="rotate(-20 0 2)" />
  </g>
);

/** Etiqueta redondeada con texto (nombre de algo que sale en pantalla). */
export const Etiqueta: React.FC<{ x: number; y: number; texto: string; visible: number; tam?: number; fondo?: string }> = ({ x, y, texto, visible, tam = 44, fondo = "#FFFFFF" }) => {
  if (visible <= 0.01) return null;
  const ancho = texto.length * tam * 0.56 + tam;
  return (
    <g transform={`translate(${x} ${y}) scale(${visible})`}>
      <rect x={-ancho / 2} y={-tam * 0.8} width={ancho} height={tam * 1.3} rx={tam * 0.65} fill={fondo} stroke={C.contorno} strokeWidth={5} />
      <text y={tam * 0.28} textAnchor="middle" fontFamily={FUENTE_TEXTO} fontWeight={700} fontSize={tam} fill={C.texto}>
        {texto}
      </text>
    </g>
  );
};
