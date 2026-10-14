import React from "react";
import { C } from "../../marca";
import { EscenaColocada, momentoPalabra, Palabras } from "../../comun/tiempo";
import { CieloAtardecer, OrillaRio, RocaHuella } from "../../escenario/Rio";
import palabrasJson from "./palabras.json";

// El mundo del episodio 2: dónde está cada cosa en la orilla (coordenadas
// de mundo; en pantalla, x = mundo − camX) y atajos para sincronizar.

export const PALABRAS = palabrasJson as unknown as Palabras;

export const ROCA = { x: 1060, y: 930, escala: 1.1 };
export const TOCON = { x: 1560, arriba: 798 }; // Doña Lechuza se posa en y = arriba
export const ARBUSTO = { x: 1980, y: 930 };
export const COLOR_ROCA = "#CDBFAF";

/** Fotograma de la escena en que se dice una palabra. */
export const usePalabra = (escena: EscenaColocada) => (id: string, palabra: string, n = 0, alFinal = false) =>
  momentoPalabra(escena, PALABRAS, id, palabra, n, alFinal);

/** Fondo de la orilla del río con la roca de la huella. */
export const Orilla: React.FC<{
  id: string;
  camX?: number;
  oscurece?: number;
  sacudidaArbusto?: number;
  conArbusto?: boolean;
  dedos?: [number, number, number];
  garras?: number;
  brillo?: number;
  rastro?: number;
}> = ({ id, camX = 300, oscurece = 0, sacudidaArbusto = 0, conArbusto = true, dedos, garras, brillo, rastro }) => (
  <g>
    <CieloAtardecer oscurece={oscurece} id={`${id}-cielo`} />
    <OrillaRio camX={camX} oscurece={oscurece} sacudidaArbusto={sacudidaArbusto} conArbusto={conArbusto} />
    <RocaHuella x={ROCA.x - camX} y={ROCA.y} escala={ROCA.escala} id={`${id}-roca`} oscurece={oscurece} dedos={dedos} garras={garras} brillo={brillo} rastro={rastro} />
  </g>
);

/** Cabeza de Galleta vista desde arriba, para comparar tamaños con la huella. */
export const CabezaGalleta: React.FC<{ x: number; y: number; r: number; opacidad?: number }> = ({ x, y, r, opacidad = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${r / 98})`} opacity={opacidad}>
    {[-1, 1].map((l) => (
      <g key={l}>
        <circle cx={l * 72} cy={-78} r={35} fill={C.caramelo} stroke={C.contorno} strokeWidth={5} />
        <circle cx={l * 72} cy={-76} r={18} fill="#F2A7A0" />
      </g>
    ))}
    <circle r={98} fill={C.caramelo} stroke={C.contorno} strokeWidth={5} />
    <ellipse cx={0} cy={34} rx={50} ry={38} fill={C.crema} stroke={C.contorno} strokeWidth={4} />
    <ellipse cx={0} cy={14} rx={18} ry={12} fill="#3B2A2A" />
    <circle cx={-36} cy={-16} r={11} fill={C.contorno} />
    <circle cx={36} cy={-16} r={11} fill={C.contorno} />
    <circle cx={-32} cy={-20} r={4} fill="#FFFFFF" />
    <circle cx={40} cy={-20} r={4} fill="#FFFFFF" />
    <path d="M -12 44 Q 0 54 12 44" stroke={C.contorno} strokeWidth={4} fill="none" strokeLinecap="round" />
  </g>
);

/** Cresta de hojas: el disfraz de dinosaurio de Galleta. Origen en lo alto de la cabeza. */
export const CrestaHojas: React.FC<{ x: number; y: number; escala?: number; rot?: number; voltear?: boolean }> = ({ x, y, escala = 1, rot = 0, voltear = false }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${escala * (voltear ? -1 : 1)} ${escala})`}>
    {[
      [-46, 12, -40, "#6FD08C"],
      [0, 0, -5, "#57B77A"],
      [44, 10, 32, "#6FD08C"],
    ].map(([dx, dy, a, color], i) => (
      <g key={i} transform={`translate(${dx} ${dy}) rotate(${a})`}>
        <path d="M 0 0 C -26 -30 -18 -70 0 -86 C 18 -70 26 -30 0 0 Z" fill={color as string} stroke={C.contorno} strokeWidth={5} strokeLinejoin="round" />
        <path d="M 0 -6 L 0 -70" stroke={C.contorno} strokeWidth={3} opacity={0.4} />
      </g>
    ))}
  </g>
);

/** Nubecita de polvo al pisar fuerte. */
export const Polvo: React.FC<{ x: number; y: number; t: number }> = ({ x, y, t }) => {
  if (t < 0 || t > 1) return null;
  return (
    <g opacity={1 - t}>
      {[-1, 1].map((l) =>
        [0, 1, 2].map((i) => (
          <circle key={`${l}${i}`} cx={x + l * (20 + t * (50 + i * 30))} cy={y - 10 - i * 8 - t * 20} r={14 + i * 4 + t * 10} fill="#F3E3C3" stroke={C.contorno} strokeWidth={3} />
        )),
      )}
    </g>
  );
};
