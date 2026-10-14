import React from "react";
import { useCurrentFrame } from "remotion";
import { C, FUENTE_TEXTO } from "../marca";
import espana from "./espana.json";
import { HuellaDino } from "./Huellas";

// Mapa de España con el contorno real (Natural Earth, dominio público,
// simplificado). Canarias va en un recuadro, como en los mapas del cole.

export const MapaEspana: React.FC<{
  x: number;
  y: number;
  ancho?: number;
  visible?: number;
  rioja?: number; // 0..1 resalta La Rioja
  huellas?: number; // 0..1 cuántas huellas han aparecido alrededor
}> = ({ x, y, ancho = 900, visible = 1, rioja = 0, huellas = 0 }) => {
  const frame = useCurrentFrame();
  if (visible <= 0.01) return null;
  const e = ancho / espana.ancho;
  const [rx, ry] = espana.rioja;
  const pulso = 1 + 0.12 * Math.sin(frame * 0.2);
  const [cw, ch] = espana.tamCanarias;
  const eCan = 0.42;
  // huellas pequeñitas alrededor de La Rioja (no es un recuento: dice «muchas»)
  const puntos = Array.from({ length: 14 }, (_, i) => {
    const a = i * 2.4;
    const d = 26 + (i % 5) * 9;
    return [rx + Math.cos(a) * d, ry + Math.sin(a) * d * 0.8, (a * 57) % 360] as const;
  });
  return (
    <g transform={`translate(${x} ${y}) scale(${e * visible})`}>
      {espana.peninsula.concat(espana.baleares).map((d, i) => (
        <path key={i} d={d} fill="#F7E3B5" stroke={C.contorno} strokeWidth={6 / e} strokeLinejoin="round" />
      ))}
      <g transform={`translate(${-cw * eCan - 30} ${espana.alto - ch * eCan - 10}) scale(${eCan})`}>
        <rect x={-30} y={-30} width={cw + 60} height={ch + 60} rx={20} fill="none" stroke={C.contorno} strokeWidth={5 / (e * eCan)} strokeDasharray="14 10" opacity={0.6} />
        {espana.canarias.map((d, i) => (
          <path key={i} d={d} fill="#F7E3B5" stroke={C.contorno} strokeWidth={6 / (e * eCan)} strokeLinejoin="round" />
        ))}
      </g>
      {rioja > 0.01 ? (
        <g opacity={Math.min(1, rioja * 1.5)}>
          <circle cx={rx} cy={ry} r={60 * pulso} fill={C.luzRosa} opacity={0.3} />
          {puntos.slice(0, Math.round(huellas * puntos.length)).map(([px, py, rot], i) => (
            <HuellaDino key={i} x={px} y={py} escala={0.09} rot={rot} modo="icono" color="#8B5A2B" id={`mapa-h${i}`} />
          ))}
          <circle cx={rx} cy={ry} r={14} fill={C.luzRosa} stroke={C.contorno} strokeWidth={5} />
          <g transform={`translate(${rx + 80} ${ry + 30})`}>
            <rect x={-10} y={-44} width={230} height={60} rx={30} fill="#FFFFFF" stroke={C.contorno} strokeWidth={5} />
            <text x={105} y={-3} textAnchor="middle" fontFamily={FUENTE_TEXTO} fontWeight={700} fontSize={40} fill={C.texto}>
              La Rioja
            </text>
          </g>
        </g>
      ) : null}
    </g>
  );
};
