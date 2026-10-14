import React from "react";
import { C } from "../marca";

// Huellas vistas desde arriba. Origen en el talón; los dedos apuntan hacia
// arriba (y negativa). A escala 1, la del dinosaurio mide unos 230 de largo.

// Huella de terópodo (dinosaurio carnívoro que andaba sobre dos patas):
// tres dedos largos, el del medio el más largo, con una garra en la punta.
const DEDO_CENTRAL = "M -22 -58 C -25 -118 -17 -172 -7 -198 L 0 -222 L 7 -198 C 17 -172 25 -118 22 -58 Z";
const DEDO_LATERAL = "M -19 0 C -21 -48 -14 -92 -5 -112 L 0 -132 L 5 -112 C 14 -92 21 -48 19 0 Z";
const GARRA_CENTRAL = "M -8 -196 L 0 -224 L 8 -196 Q 0 -190 -8 -196 Z";
const GARRA_LATERAL = "M -6 -110 L 0 -134 L 6 -110 Q 0 -105 -6 -110 Z";

// [transformación del dedo, camino del dedo, camino de la garra]
const DEDOS: [string, string, string][] = [
  ["translate(-20 -50) rotate(-27)", DEDO_LATERAL, GARRA_LATERAL], // 1: el de la izquierda
  ["", DEDO_CENTRAL, GARRA_CENTRAL], // 2: el del medio
  ["translate(20 -50) rotate(27) scale(1.05)", DEDO_LATERAL, GARRA_LATERAL], // 3: el de la derecha
];

const FormaHuella: React.FC<{ fill?: string; stroke?: string; strokeWidth?: number }> = ({ fill = "none", stroke = "none", strokeWidth = 0 }) => (
  <g fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round">
    <ellipse cx={0} cy={-36} rx={40} ry={42} />
    {DEDOS.map(([tr, d], i) => (
      <path key={i} d={d} transform={tr || undefined} />
    ))}
  </g>
);

export type HuellaProps = {
  x: number;
  y: number;
  escala?: number;
  rot?: number;
  /** aplasta en vertical para verla tumbada en el suelo (perspectiva) */
  aplastar?: number;
  /** «hundida» = marcada en barro o roca; «icono» = dibujo plano */
  modo?: "hundida" | "icono";
  fondo?: string; // color del barro o de la roca de alrededor
  dedos?: [number, number, number]; // brillo de cada dedo (0..1) para contarlos
  garras?: number; // brillo de las garras (0..1)
  color?: string; // color del icono
  id: string;
  opacidad?: number;
};

export const HuellaDino: React.FC<HuellaProps> = ({
  x,
  y,
  escala = 1,
  rot = 0,
  aplastar = 1,
  modo = "hundida",
  fondo = "#B9A794",
  dedos = [0, 0, 0],
  garras = 0,
  color = C.contorno,
  id,
  opacidad = 1,
}) => {
  const oscuro = mezclar(mezclar(fondo, "#5A3E2B", 0.5), "#2B2140", 0.38);
  const medio = mezclar(mezclar(fondo, "#5A3E2B", 0.5), "#2B2140", 0.12);
  return (
    <g transform={`translate(${x} ${y}) scale(${escala} ${escala * aplastar}) rotate(${rot})`} opacity={opacidad}>
      {modo === "icono" ? (
        <FormaHuella fill={color} />
      ) : (
        <>
          <defs>
            <clipPath id={`${id}-forma`}>
              <ellipse cx={0} cy={-36} rx={40} ry={42} />
              {DEDOS.map(([tr, d], i) => (
                <path key={i} d={d} transform={tr || undefined} />
              ))}
            </clipPath>
          </defs>
          {/* borde levantado alrededor (el barro que se apartó al pisar) */}
          <FormaHuella stroke={mezclar(fondo, "#FFFFFF", 0.3)} strokeWidth={16} />
          <FormaHuella stroke={C.contorno} strokeWidth={8} />
          {/* hueco: sombra arriba a la izquierda, fondo más claro */}
          <g clipPath={`url(#${id}-forma)`}>
            <rect x={-200} y={-300} width={400} height={400} fill={oscuro} />
            <g transform="translate(7 9)">
              <FormaHuella fill={medio} />
            </g>
          </g>
        </>
      )}
      {/* brillo para contar los dedos */}
      {DEDOS.map(([tr, d], i) =>
        dedos[i] > 0.01 ? (
          <path key={`b${i}`} d={d} transform={tr || undefined} fill={C.luzAmarilla} opacity={0.75 * dedos[i]} stroke="#FFF7C2" strokeWidth={6} />
        ) : null,
      )}
      {/* garras */}
      {DEDOS.map(([tr, , g], i) => (
        <path
          key={`g${i}`}
          d={g}
          transform={tr || undefined}
          fill={garras > 0.01 ? mezclarColor("#5A4A3C", "#FF7EB6", garras) : modo === "icono" ? color : "#5A4A3C"}
          stroke={garras > 0.01 ? "#FFFFFF" : "none"}
          strokeWidth={garras * 4}
        />
      ))}
    </g>
  );
};

/** Pisada de Galleta (osita): almohadilla y cinco deditos. */
export const HuellaOsita: React.FC<{ x: number; y: number; escala?: number; aplastar?: number; fondo?: string; opacidad?: number }> = ({
  x,
  y,
  escala = 1,
  aplastar = 1,
  fondo = "#D9B98C",
  opacidad = 1,
}) => {
  const hueco = mezclar(fondo, "#2B2140", 0.3);
  return (
    <g transform={`translate(${x} ${y}) scale(${escala} ${escala * aplastar})`} opacity={opacidad}>
      <path d="M -30 -22 C -34 -48 -14 -58 0 -58 C 14 -58 34 -48 30 -22 C 27 -4 14 0 0 0 C -14 0 -27 -4 -30 -22 Z" fill={hueco} stroke={C.contorno} strokeWidth={4} />
      {[
        [-30, -70, 8],
        [-15, -82, 9],
        [2, -86, 9],
        [19, -80, 9],
        [32, -66, 8],
      ].map(([cx, cy, r], i) => (
        <ellipse key={i} cx={cx} cy={cy} rx={r} ry={r * 1.15} fill={hueco} stroke={C.contorno} strokeWidth={4} />
      ))}
    </g>
  );
};

/** Pisada de gallina: tres dedos largos delante y uno cortito detrás. */
export const HuellaGallina: React.FC<{
  x: number;
  y: number;
  escala?: number;
  rot?: number;
  aplastar?: number;
  color?: string;
  dedos?: number; // brillo de los tres dedos de delante
  opacidad?: number;
}> = ({ x, y, escala = 1, rot = 0, aplastar = 1, color = "#7A5C3E", dedos = 0, opacidad = 1 }) => {
  const trazos = ["M 0 0 L 0 -100", "M 0 0 L -52 -72", "M 0 0 L 52 -72"];
  return (
    <g transform={`translate(${x} ${y}) scale(${escala} ${escala * aplastar}) rotate(${rot})`} opacity={opacidad}>
      <path d="M 0 0 L 0 26" stroke={C.contorno} strokeWidth={18} strokeLinecap="round" />
      <path d="M 0 0 L 0 26" stroke={color} strokeWidth={10} strokeLinecap="round" />
      {trazos.map((d, i) => (
        <g key={i}>
          <path d={d} stroke={C.contorno} strokeWidth={20} strokeLinecap="round" />
          <path d={d} stroke={color} strokeWidth={12} strokeLinecap="round" />
          {dedos > 0.01 ? <path d={d} stroke={C.luzAmarilla} strokeWidth={12} strokeLinecap="round" opacity={0.85 * dedos} /> : null}
        </g>
      ))}
    </g>
  );
};

// ------------------------------------------------------------------ colores

const hex = (c: string) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
const aHex = (v: number[]) => "#" + v.map((n) => Math.round(Math.max(0, Math.min(255, n))).toString(16).padStart(2, "0")).join("");

/** Mezcla dos colores (#RRGGBB): k = 0 → a, k = 1 → b. */
export const mezclar = (a: string, b: string, k: number) => {
  const A = hex(a);
  const B = hex(b);
  return aHex(A.map((v, i) => v + (B[i] - v) * k));
};
const mezclarColor = mezclar;
