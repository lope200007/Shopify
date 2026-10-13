import React from "react";
import { C } from "../marca";

export type Expresion =
  | "feliz"
  | "contento" // ojos cerrados de alegría (^ ^)
  | "sorprendido"
  | "preocupado"
  | "pensando"
  | "riendo"
  | "asustado"
  | "triste";

export type Mirada = { x: number; y: number }; // -1..1

// Parpadeo determinista: cada personaje parpadea con su propio ritmo
// (semilla distinta) para que no lo hagan todos a la vez.
export const aperturaOjos = (frame: number, semilla: number, parpadea = true): number => {
  if (!parpadea) return 1;
  const periodo = 96 + ((semilla * 37) % 50);
  const fase = (frame + semilla * 53) % periodo;
  const curva = [1, 0.55, 0.08, 0.08, 0.55, 1];
  return fase < curva.length ? curva[fase] : 1;
};

type OjoProps = {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  expresion: Expresion;
  mirada: Mirada;
  apertura: number;
  lado: -1 | 1; // -1 ojo izquierdo (del espectador), 1 derecho
  colorPupila?: string;
  grosor?: number;
};

export const Ojo: React.FC<OjoProps> = ({
  cx,
  cy,
  rx,
  ry,
  expresion,
  mirada,
  apertura,
  lado,
  colorPupila = C.contorno,
  grosor = 4,
}) => {
  if (expresion === "contento" || expresion === "riendo") {
    // Ojo cerrado en forma de arco hacia arriba (^)
    return (
      <path
        d={`M ${cx - rx} ${cy + ry * 0.25} Q ${cx} ${cy - ry * 0.9} ${cx + rx} ${cy + ry * 0.25}`}
        fill="none"
        stroke={C.contorno}
        strokeWidth={grosor + 1.5}
        strokeLinecap="round"
      />
    );
  }
  const escalaBlanco = expresion === "sorprendido" || expresion === "asustado" ? 1.12 : 1;
  const pupila =
    expresion === "sorprendido" || expresion === "asustado"
      ? 0.42
      : expresion === "triste"
        ? 0.62
        : 0.6;
  const my = expresion === "pensando" ? -0.6 : mirada.y;
  const mx = expresion === "pensando" ? 0.5 : mirada.x;
  const ap = Math.max(0.06, apertura);
  return (
    <g transform={`translate(${cx} ${cy}) scale(1 ${ap}) translate(${-cx} ${-cy})`}>
      <ellipse
        cx={cx}
        cy={cy}
        rx={rx * escalaBlanco}
        ry={ry * escalaBlanco}
        fill={C.blanco}
        stroke={C.contorno}
        strokeWidth={grosor}
      />
      <circle
        cx={cx + mx * rx * 0.38}
        cy={cy + my * ry * 0.34}
        r={Math.min(rx, ry) * pupila}
        fill={colorPupila}
      />
      <circle
        cx={cx + mx * rx * 0.38 - rx * 0.16}
        cy={cy + my * ry * 0.34 - ry * 0.2}
        r={Math.min(rx, ry) * 0.2}
        fill={C.blanco}
      />
      <circle
        cx={cx + mx * rx * 0.38 + rx * 0.14}
        cy={cy + my * ry * 0.34 + ry * 0.16}
        r={Math.min(rx, ry) * 0.09}
        fill={C.blanco}
      />
    </g>
  );
};

type CejaProps = {
  cx: number;
  cy: number;
  ancho: number;
  expresion: Expresion;
  lado: -1 | 1;
  grosor?: number;
  color?: string;
};

export const Ceja: React.FC<CejaProps> = ({
  cx,
  cy,
  ancho,
  expresion,
  lado,
  grosor = 5,
  color = C.contorno,
}) => {
  // inclinación: positivo = extremo interior más bajo (enfado/concentración),
  // negativo = extremo interior más alto (preocupación/tristeza)
  let alto = 0;
  let incl = 0;
  let curva = -4;
  switch (expresion) {
    case "sorprendido":
      alto = -10;
      curva = -7;
      break;
    case "asustado":
      alto = -8;
      incl = -9;
      break;
    case "preocupado":
    case "triste":
      alto = -2;
      incl = -8;
      break;
    case "pensando":
      alto = lado === 1 ? -9 : 1;
      incl = lado === 1 ? 0 : 4;
      break;
    case "riendo":
    case "contento":
      alto = -6;
      curva = -6;
      break;
    default:
      alto = -3;
  }
  const interior = cx - (lado * ancho) / 2;
  const exterior = cx + (lado * ancho) / 2;
  const yInt = cy + alto + incl;
  const yExt = cy + alto - incl * 0.4;
  return (
    <path
      d={`M ${interior} ${yInt} Q ${cx} ${cy + alto + curva} ${exterior} ${yExt}`}
      fill="none"
      stroke={color}
      strokeWidth={grosor}
      strokeLinecap="round"
    />
  );
};

type BocaProps = {
  cx: number;
  cy: number;
  ancho: number;
  expresion: Expresion;
  habla: number; // 0..1, apertura por la voz
  grosor?: number;
  colorInterior?: string;
};

export const Boca: React.FC<BocaProps> = ({
  cx,
  cy,
  ancho,
  expresion,
  habla,
  grosor = 4,
  colorInterior = "#7A1F2B",
}) => {
  const w = ancho / 2;
  const abierta = Math.max(
    habla,
    expresion === "riendo" ? 0.85 : expresion === "sorprendido" || expresion === "asustado" ? 0.5 : 0,
  );

  if (abierta < 0.06) {
    if (expresion === "preocupado" || expresion === "triste") {
      return (
        <path
          d={`M ${cx - w * 0.8} ${cy + 5} Q ${cx} ${cy - 7} ${cx + w * 0.8} ${cy + 5}`}
          fill="none"
          stroke={C.contorno}
          strokeWidth={grosor}
          strokeLinecap="round"
        />
      );
    }
    if (expresion === "pensando") {
      return (
        <path
          d={`M ${cx - w * 0.6} ${cy + 2} Q ${cx + w * 0.1} ${cy + 6} ${cx + w * 0.7} ${cy - 3}`}
          fill="none"
          stroke={C.contorno}
          strokeWidth={grosor}
          strokeLinecap="round"
        />
      );
    }
    // sonrisa cerrada
    return (
      <path
        d={`M ${cx - w} ${cy - 2} Q ${cx} ${cy + w * 0.75} ${cx + w} ${cy - 2}`}
        fill="none"
        stroke={C.contorno}
        strokeWidth={grosor}
        strokeLinecap="round"
      />
    );
  }

  if (expresion === "sorprendido" || expresion === "asustado") {
    // boca en «O»
    const r = w * (0.35 + 0.35 * abierta);
    return (
      <g>
        <ellipse
          cx={cx}
          cy={cy + r * 0.4}
          rx={r * 0.85}
          ry={r * 1.1}
          fill={colorInterior}
          stroke={C.contorno}
          strokeWidth={grosor}
        />
      </g>
    );
  }

  // boca abierta: borde de arriba casi recto, de abajo curvo.
  // Si está preocupado, la comisura baja un poco.
  const baja = expresion === "preocupado" || expresion === "triste" ? 5 : 0;
  const prof = w * (0.25 + 1.0 * abierta);
  const arriba = cy - 2 + baja;
  const d = `M ${cx - w} ${arriba} Q ${cx} ${arriba + w * 0.12} ${cx + w} ${arriba} Q ${cx + w * 0.75} ${arriba + prof} ${cx} ${arriba + prof} Q ${cx - w * 0.75} ${arriba + prof} ${cx - w} ${arriba} Z`;
  return (
    <g>
      <clipPath id={`boca-${Math.round(cx)}-${Math.round(cy)}`}>
        <path d={d} />
      </clipPath>
      <path d={d} fill={colorInterior} />
      <ellipse
        cx={cx}
        cy={arriba + prof * 0.95}
        rx={w * 0.55}
        ry={prof * 0.42}
        fill="#FF6F7D"
        clipPath={`url(#boca-${Math.round(cx)}-${Math.round(cy)})`}
      />
      <path d={d} fill="none" stroke={C.contorno} strokeWidth={grosor} strokeLinejoin="round" />
    </g>
  );
};

export const Mejillas: React.FC<{
  x: number;
  y: number;
  rx: number;
  ry: number;
  color?: string;
}> = ({ x, y, rx, ry, color = C.rosaMejillas }) => (
  <g opacity={0.55}>
    <ellipse cx={-x} cy={y} rx={rx} ry={ry} fill={color} />
    <ellipse cx={x} cy={y} rx={rx} ry={ry} fill={color} />
  </g>
);

// Ángulos de brazos (grados). 0 = colgando; positivo = hacia fuera y arriba;
// negativo = hacia dentro (por delante del cuerpo).
export type Brazos = { a: number; b: number }; // a = lado izquierdo del espectador

export const POSES: Record<string, Brazos> = {
  reposo: { a: 14, b: 14 },
  saludo: { a: 14, b: 150 },
  celebrar: { a: 150, b: 150 },
  señalar: { a: 14, b: 100 },
  señalarIzq: { a: 100, b: 14 },
  pensar: { a: 14, b: -150 },
  manosCara: { a: -145, b: -145 },
  brazosAbiertos: { a: 70, b: 70 },
  explicar: { a: 30, b: 70 },
};
