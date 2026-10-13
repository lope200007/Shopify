import React from "react";
import { useCurrentFrame } from "remotion";
import { C } from "../marca";
import {
  aperturaOjos,
  Boca,
  Brazos,
  Ceja,
  Expresion,
  Mejillas,
  Mirada,
  Ojo,
  POSES,
} from "./cara";

export type GalletaProps = {
  x: number;
  y: number; // y = suelo bajo sus pies
  escala?: number;
  expresion?: Expresion;
  habla?: number;
  mirada?: Mirada;
  brazos?: Brazos;
  saludando?: boolean;
  voltear?: boolean;
  semilla?: number;
  rotacion?: number;
  estiramiento?: number; // squash & stretch
  objeto?: React.ReactNode; // algo en la mano derecha (la del espectador)
  parpadea?: boolean;
};

// Galleta: una osita valiente y con mucha energía. Actúa antes de pensar
// («¡Tengo un plan!») y sus planes salen torcidos, pero es la que se atreve.
export const Galleta: React.FC<GalletaProps> = ({
  x,
  y,
  escala = 1,
  expresion = "feliz",
  habla = 0,
  mirada = { x: 0, y: 0 },
  brazos = POSES.reposo,
  saludando = false,
  voltear = false,
  semilla = 2,
  rotacion = 0,
  estiramiento = 1,
  objeto,
  parpadea = true,
}) => {
  const frame = useCurrentFrame();
  const apertura = aperturaOjos(frame, semilla, parpadea);
  const respira = Math.sin(frame * 0.1 + semilla) * 0.012;
  const ola = saludando ? Math.sin(frame * 0.4) * 22 : 0;
  const oreja = (frame + semilla * 40) % 170 < 8 ? Math.sin(((frame + semilla * 40) % 170) * 0.8) * 8 : 0;

  const sx = (escala * (voltear ? -1 : 1)) / Math.sqrt(estiramiento);
  const sy = escala * estiramiento;

  return (
    // el origen local está en los pies (0, 152) para que el aplastamiento
    // al aterrizar se haga desde el suelo
    <g transform={`translate(${x} ${y}) rotate(${rotacion}) scale(${sx} ${sy}) translate(0 -152)`}>
      {/* sombra */}
      <ellipse cx={0} cy={156} rx={92} ry={14} fill="#000000" opacity={0.15} />

      {/* piernas */}
      {[-1, 1].map((lado) => (
        <g key={lado}>
          <ellipse cx={lado * 46} cy={132} rx={32} ry={24} fill={C.caramelo} stroke={C.contorno} strokeWidth={5} />
          <ellipse cx={lado * 46} cy={138} rx={17} ry={11} fill={C.crema} />
        </g>
      ))}

      {/* cuerpo */}
      <g transform={`translate(0 140) scale(${1 - respira} ${1 + respira}) translate(0 -140)`}>
        <ellipse cx={0} cy={40} rx={92} ry={100} fill={C.caramelo} stroke={C.contorno} strokeWidth={5} />
        <ellipse cx={0} cy={60} rx={58} ry={64} fill={C.crema} />
        {/* correa del bolso */}
        <path d="M 66 -34 L -70 92" stroke={C.contorno} strokeWidth={18} strokeLinecap="round" />
        <path d="M 66 -34 L -70 92" stroke={C.bolso} strokeWidth={11} strokeLinecap="round" />
        {/* bolso */}
        <g transform="translate(-80 98) rotate(-8)">
          <rect x={-32} y={-24} width={64} height={50} rx={14} fill={C.bolso} stroke={C.contorno} strokeWidth={5} />
          <path d="M -32 -6 Q 0 14 32 -6 L 32 -12 Q 32 -24 20 -24 L -20 -24 Q -32 -24 -32 -12 Z" fill="#94603A" stroke={C.contorno} strokeWidth={4} />
          <circle cx={0} cy={6} r={6} fill={C.luzAmarilla} stroke={C.contorno} strokeWidth={3} />
        </g>
      </g>

      {/* brazos */}
      {(
        [
          [-1, brazos.a],
          [1, brazos.b + (saludando ? ola : 0)],
        ] as const
      ).map(([lado, ang]) => (
        <g key={lado} transform={`translate(${lado * 78} -12) rotate(${lado === -1 ? ang : -ang})`}>
          <path d="M 0 0 L 0 62" stroke={C.contorno} strokeWidth={42} strokeLinecap="round" />
          <path d="M 0 0 L 0 62" stroke={C.caramelo} strokeWidth={32} strokeLinecap="round" />
          <ellipse cx={0} cy={68} rx={11} ry={8} fill={C.crema} />
          {lado === 1 && objeto ? <g transform="translate(0 72)">{objeto}</g> : null}
        </g>
      ))}

      {/* pañuelo */}
      <g>
        <path d="M -66 -38 Q 0 -18 66 -38 L 10 30 Q 0 38 -10 30 Z" fill={C.pañuelo} stroke={C.contorno} strokeWidth={5} strokeLinejoin="round" />
        {[
          [-34, -24],
          [8, -22],
          [32, -28],
          [-10, 4],
          [12, 2],
        ].map(([px, py], i) => (
          <circle key={i} cx={px} cy={py} r={5} fill="#FFFFFF" opacity={0.9} />
        ))}
      </g>

      {/* orejas */}
      {[-1, 1].map((lado) => (
        <g key={lado} transform={`rotate(${lado === 1 ? oreja : 0} ${lado * 70} -180)`}>
          <circle cx={lado * 72} cy={-196} r={35} fill={C.caramelo} stroke={C.contorno} strokeWidth={5} />
          <circle cx={lado * 72} cy={-194} r={18} fill="#F2A7A0" />
        </g>
      ))}

      {/* cabeza */}
      <circle cx={0} cy={-118} r={98} fill={C.caramelo} stroke={C.contorno} strokeWidth={5} />
      <path d="M -62 -176 Q -26 -206 22 -204" stroke="#FFFFFF" strokeWidth={10} strokeLinecap="round" fill="none" opacity={0.25} />

      {/* hocico */}
      <ellipse cx={0} cy={-84} rx={50} ry={38} fill={C.crema} stroke={C.contorno} strokeWidth={4} />
      <Mejillas x={66} y={-96} rx={16} ry={10} />
      <Ojo cx={-38} cy={-136} rx={15} ry={18} expresion={expresion} mirada={mirada} apertura={apertura} lado={-1} />
      <Ojo cx={38} cy={-136} rx={15} ry={18} expresion={expresion} mirada={mirada} apertura={apertura} lado={1} />
      <Ceja cx={-40} cy={-166} ancho={24} expresion={expresion} lado={-1} grosor={6} />
      <Ceja cx={40} cy={-166} ancho={24} expresion={expresion} lado={1} grosor={6} />
      {/* nariz */}
      <ellipse cx={0} cy={-104} rx={18} ry={12} fill="#3B2A2A" stroke={C.contorno} strokeWidth={3} />
      <ellipse cx={-6} cy={-108} rx={6} ry={3.5} fill="#FFFFFF" opacity={0.6} />
      <path d="M 0 -92 L 0 -84" stroke={C.contorno} strokeWidth={4} strokeLinecap="round" />
      <Boca cx={0} cy={-80} ancho={36} expresion={expresion} habla={habla} />
    </g>
  );
};
