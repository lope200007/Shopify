import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FUENTE_TITULO } from "../marca";
import { HuellaDino } from "../escenario/Huellas";

// Piezas de «juego» que se repiten entre episodios: la cuenta atrás para
// contestar, el marcador de pistas y la luz de las historias de Farolín.

/** Cuenta atrás 3-2-1 para que el niño conteste en voz alta. */
export const CuentaAtras: React.FC<{ desde: number; hasta: number; x?: number; y?: number; r?: number }> = ({ desde, hasta, x = 960, y = 560, r = 130 }) => {
  const frame = useCurrentFrame();
  if (frame < desde || frame >= hasta) return null;
  const largo = hasta - desde;
  const k = (frame - desde) / largo;
  const numero = 3 - Math.floor(k * 3);
  const local = ((frame - desde) % (largo / 3)) / (largo / 3);
  const s = interpolate(local, [0, 0.15, 1], [0.6, 1.1, 1]);
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={r + 20} fill="#140F3D" opacity={0.35} />
      <circle r={r} fill="none" stroke="#FFFFFF" strokeWidth={14} opacity={0.35} />
      <circle r={r} fill="none" stroke={C.luzAmarilla} strokeWidth={14} strokeDasharray={`${2 * Math.PI * r * (1 - k)} 9999`} transform="rotate(-90)" strokeLinecap="round" />
      <text y={r * 0.46} textAnchor="middle" fontFamily={FUENTE_TITULO} fontWeight={800} fontSize={r * 1.3} fill="#FFFFFF" stroke={C.contorno} strokeWidth={8} paintOrder="stroke" transform={`scale(${s})`}>
        {numero}
      </text>
    </g>
  );
};

// iconos de las tres pistas de la huella
const IconoDedos: React.FC = () => (
  <g>
    <HuellaDino x={0} y={34} escala={0.3} modo="icono" color="#C98A4B" id="icono-dedos" />
    <text x={30} y={34} fontFamily={FUENTE_TITULO} fontWeight={800} fontSize={34} fill={C.texto}>
      3
    </text>
  </g>
);
const IconoGarra: React.FC = () => (
  <path d="M -20 30 C -24 -6 -6 -30 22 -36 C 8 -18 6 6 14 30 Z" fill="#FFF6DD" stroke={C.contorno} strokeWidth={5} strokeLinejoin="round" />
);
const IconoDosPatas: React.FC = () => (
  <g>
    <HuellaDino x={-14} y={36} escala={0.2} modo="icono" color="#C98A4B" id="icono-p1" />
    <HuellaDino x={16} y={4} escala={0.2} modo="icono" color="#C98A4B" id="icono-p2" />
  </g>
);

/**
 * Marcador de pistas (efecto de «gradiente de meta»: cuanto más cerca de
 * la meta, más ganas de llegar). `pistas` es el inicio de cada pista
 * (fotograma) o null si aún no se ha encontrado.
 */
export const MarcadorPistas: React.FC<{ x?: number; y?: number; pistas: (number | null)[]; visible: number; resaltar?: number | null }> = ({
  x = 40,
  y = 40,
  pistas,
  visible,
  resaltar = null,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (visible <= 0.01) return null;
  const encontradas = pistas.filter((p) => p !== null && frame >= p).length;
  const iconos = [IconoDedos, IconoGarra, IconoDosPatas];
  return (
    <g transform={`translate(${x} ${y}) scale(${visible})`}>
      <rect x={0} y={0} width={430} height={150} rx={30} fill="#FFFFFF" stroke={C.contorno} strokeWidth={6} opacity={0.96} />
      <text x={24} y={44} fontFamily={FUENTE_TITULO} fontWeight={800} fontSize={34} fill={C.texto}>
        Pistas
      </text>
      <text x={406} y={44} textAnchor="end" fontFamily={FUENTE_TITULO} fontWeight={800} fontSize={34} fill={encontradas === 3 ? C.luzTurquesa : C.texto}>
        {encontradas}/3
      </text>
      {iconos.map((Icono, i) => {
        const p = pistas[i];
        const hecho = p !== null && frame >= p;
        const s = hecho ? spring({ frame: frame - (p as number), fps, config: { damping: 9, stiffness: 170 } }) : 0;
        const pulso = resaltar === i && !hecho ? 1 + 0.08 * Math.sin(frame * 0.3) : 1;
        const cx = 90 + i * 125;
        const destaca = resaltar === i && hecho ? 1 + 0.12 * Math.sin(frame * 0.35) : 1;
        return (
          <g key={i} transform={`translate(${cx} 98) scale(${pulso * destaca})`}>
            {resaltar === i && hecho ? <circle r={54} fill={C.luzAmarilla} opacity={0.45} /> : null}
            <circle r={38} fill={hecho ? C.luzAmarilla : "#F1ECF7"} stroke={C.contorno} strokeWidth={5} strokeDasharray={hecho ? undefined : "8 8"} />
            {hecho ? (
              <g transform={`scale(${s})`}>
                <g transform="translate(-8 -8)">
                  <Icono />
                </g>
              </g>
            ) : (
              <text y={14} textAnchor="middle" fontFamily={FUENTE_TITULO} fontWeight={800} fontSize={40} fill="#B9AECB">
                ?
              </text>
            )}
          </g>
        );
      })}
    </g>
  );
};

/**
 * La luz de las historias de Farolín: un haz desde su farolillo hasta un
 * círculo donde se ve lo que se cuenta (como un proyector de cuentos).
 */
export const LuzHistorias: React.FC<{
  x: number;
  y: number;
  r: number;
  visible: number;
  desde?: [number, number]; // de dónde sale el haz (el farolillo)
  id: string;
  fondo?: string;
  color?: string;
  children: React.ReactNode;
}> = ({ x, y, r, visible, desde, id, fondo = "#FFF3D6", color = C.luzAmarilla, children }) => {
  const frame = useCurrentFrame();
  if (visible <= 0.01) return null;
  const rr = r * (0.2 + 0.8 * visible);
  let haz: string | null = null;
  if (desde) {
    const [ox, oy] = desde;
    const ang = Math.atan2(y - oy, x - ox);
    const t1 = [x + Math.cos(ang + Math.PI / 2) * rr, y + Math.sin(ang + Math.PI / 2) * rr];
    const t2 = [x + Math.cos(ang - Math.PI / 2) * rr, y + Math.sin(ang - Math.PI / 2) * rr];
    haz = `M ${ox} ${oy} L ${t1[0]} ${t1[1]} L ${t2[0]} ${t2[1]} Z`;
  }
  const latido = 0.9 + 0.1 * Math.sin(frame * 0.12);
  return (
    <g opacity={Math.min(1, visible * 1.4)}>
      <defs>
        <clipPath id={`${id}-clip`}>
          <circle cx={x} cy={y} r={rr} />
        </clipPath>
        <radialGradient id={`${id}-vineta`} cx="50%" cy="50%" r="50%">
          <stop offset="70%" stopColor="#FFFFFF" stopOpacity={0} />
          <stop offset="100%" stopColor="#FFC46B" stopOpacity={0.55} />
        </radialGradient>
        {desde ? (
          <linearGradient id={`${id}-haz`} gradientUnits="userSpaceOnUse" x1={desde[0]} y1={desde[1]} x2={x} y2={y}>
            <stop offset="0%" stopColor={color} stopOpacity={0.55} />
            <stop offset="100%" stopColor={color} stopOpacity={0.12} />
          </linearGradient>
        ) : null}
      </defs>
      {haz ? <path d={haz} fill={`url(#${id}-haz)`} /> : null}
      {[34, 22, 12].map((w, i) => (
        <circle key={i} cx={x} cy={y} r={rr + w / 2} fill="none" stroke={color} strokeWidth={w} opacity={(0.12 + i * 0.1) * latido} />
      ))}
      <g clipPath={`url(#${id}-clip)`}>
        <rect x={x - rr} y={y - rr} width={rr * 2} height={rr * 2} fill={fondo} />
        <g transform={`translate(${x} ${y}) scale(${rr / r}) translate(${-x} ${-y})`}>{children}</g>
        <circle cx={x} cy={y} r={rr} fill={`url(#${id}-vineta)`} />
      </g>
      <circle cx={x} cy={y} r={rr} fill="none" stroke={C.contorno} strokeWidth={6} />
      <circle cx={x} cy={y} r={rr - 8} fill="none" stroke="#FFFFFF" strokeWidth={4} opacity={0.6} />
    </g>
  );
};
