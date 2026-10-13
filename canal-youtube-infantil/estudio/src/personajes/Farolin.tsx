import React from "react";
import { useCurrentFrame } from "remotion";
import { C, LUCES, Luz } from "../marca";
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

export type FarolinProps = {
  x: number;
  y: number;
  escala?: number;
  expresion?: Expresion;
  habla?: number;
  mirada?: Mirada;
  brazos?: Brazos;
  saludando?: boolean;
  luz?: Luz;
  brillo?: number; // 0..1.5 intensidad del farolillo
  volando?: boolean; // aletea y flota
  voltear?: boolean; // mira hacia la izquierda
  semilla?: number;
  rotacion?: number;
  estiramiento?: number; // 1 = normal; >1 se estira en vertical, <1 se aplasta
  idPrefijo?: string;
  parpadea?: boolean;
};

// Farolín: una luciérnaga pequeña y curiosa. Su farolillo (la cola) es su
// forma de hablar sin palabras: amarillo cuando está normal, turquesa cuando
// «se le enciende una idea», rosa cuando está muy contento, azul si tiene miedo.
export const Farolin: React.FC<FarolinProps> = ({
  x,
  y,
  escala = 1,
  expresion = "feliz",
  habla = 0,
  mirada = { x: 0, y: 0 },
  brazos = POSES.reposo,
  saludando = false,
  luz = "amarilla",
  brillo = 1,
  volando = true,
  voltear = false,
  semilla = 1,
  rotacion = 0,
  estiramiento = 1,
  idPrefijo = "farolin",
  parpadea = true,
}) => {
  const frame = useCurrentFrame();
  const color = LUCES[luz];
  const apertura = aperturaOjos(frame, semilla, parpadea);

  const aleteo = volando ? 0.55 + 0.45 * Math.abs(Math.sin(frame * 0.85)) : 0.9;
  const flota = volando ? Math.sin(frame * 0.09 + semilla) * 7 : 0;
  const respira = 1 + Math.sin(frame * 0.12 + semilla) * 0.012;
  const pulso = 0.82 + 0.18 * Math.sin(frame * 0.2 + semilla);
  const antena = Math.sin(frame * 0.11 + semilla) * 5;
  const ola = saludando ? Math.sin(frame * 0.45) * 22 : 0;

  const sx = escala * (voltear ? -1 : 1) / Math.sqrt(estiramiento);
  const sy = escala * estiramiento;
  const gid = `${idPrefijo}-brillo`;

  return (
    <g transform={`translate(${x} ${y + flota}) rotate(${rotacion}) scale(${sx} ${sy})`}>
      <defs>
        <radialGradient id={gid}>
          <stop offset="0%" stopColor={color} stopOpacity={0.85} />
          <stop offset="35%" stopColor={color} stopOpacity={0.35} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </radialGradient>
        <radialGradient id={`${gid}-bombilla`} cx="40%" cy="35%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="45%" stopColor={color} />
          <stop offset="100%" stopColor={color} />
        </radialGradient>
      </defs>

      {/* halo de luz */}
      <circle
        cx={32}
        cy={54}
        r={130 * (0.6 + 0.4 * brillo)}
        fill={`url(#${gid})`}
        opacity={Math.min(1, brillo) * pulso}
      />

      {/* alas: salen de la espalda, por encima de los hombros, hacia fuera */}
      {[-1, 1].map((lado) => (
        <g key={lado} transform={`translate(${lado * 22} -2) rotate(${lado * 62}) scale(1 ${aleteo})`}>
          <ellipse cx={0} cy={-62} rx={30} ry={62} fill={C.alas} opacity={0.85} stroke={C.contorno} strokeWidth={4} />
          <path d={`M 0 -10 Q ${lado * -4} -60 0 -112`} stroke={C.contorno} strokeWidth={2.5} fill="none" opacity={0.3} />
          <ellipse cx={-8} cy={-78} rx={9} ry={24} fill="#FFFFFF" opacity={0.65} />
        </g>
      ))}

      {/* farolillo (abdomen): sale de detrás del cuerpo, con franjas */}
      <g transform="translate(24 42) rotate(-38)">
        <ellipse cx={0} cy={14} rx={33} ry={46} fill={`url(#${gid}-bombilla)`} stroke={C.contorno} strokeWidth={5} />
        <path d="M -30 2 Q 0 14 30 2" stroke="#FFFFFF" strokeWidth={4} fill="none" opacity={0.55} />
        <path d="M -28 24 Q 0 36 28 24" stroke="#FFFFFF" strokeWidth={4} fill="none" opacity={0.55} />
        <ellipse cx={-12} cy={-6} rx={8} ry={13} fill="#FFFFFF" opacity={0.7} />
      </g>

      {/* piernas */}
      {[-1, 1].map((lado) => (
        <g key={lado} transform={`rotate(${volando ? Math.sin(frame * 0.15 + lado) * 8 : 0} ${lado * 10} 34)`}>
          <path
            d={`M ${lado * 10} 34 L ${lado * 15} 62`}
            stroke={C.contorno}
            strokeWidth={13}
            strokeLinecap="round"
          />
          <path
            d={`M ${lado * 10} 34 L ${lado * 15} 62`}
            stroke={C.marino}
            strokeWidth={7}
            strokeLinecap="round"
          />
          <ellipse cx={lado * 18} cy={66} rx={11} ry={7} fill={C.marino} stroke={C.contorno} strokeWidth={4} />
        </g>
      ))}

      {/* cuerpo */}
      <g transform={`scale(1 ${respira})`}>
        <ellipse cx={0} cy={12} rx={31} ry={30} fill={C.marino} stroke={C.contorno} strokeWidth={5} />
        <ellipse cx={-9} cy={2} rx={9} ry={6} fill="#FFFFFF" opacity={0.18} />
      </g>

      {/* brazos */}
      {(
        [
          [-1, brazos.a],
          [1, brazos.b + (saludando ? ola : 0)],
        ] as const
      ).map(([lado, ang]) => (
        <g key={lado} transform={`translate(${lado * 24} 2) rotate(${lado === -1 ? ang : -ang})`}>
          <path d="M 0 0 L 0 32" stroke={C.contorno} strokeWidth={14} strokeLinecap="round" />
          <path d="M 0 0 L 0 32" stroke={C.marino} strokeWidth={8} strokeLinecap="round" />
          <circle cx={0} cy={36} r={9} fill={C.coral} stroke={C.contorno} strokeWidth={4} />
        </g>
      ))}

      {/* antenas */}
      {[-1, 1].map((lado) => (
        <g key={lado} transform={`rotate(${lado * antena} ${lado * 20} -126)`}>
          <path
            d={`M ${lado * 20} -126 Q ${lado * 26} -160 ${lado * 50} -176`}
            fill="none"
            stroke={C.contorno}
            strokeWidth={6}
            strokeLinecap="round"
          />
          <circle cx={lado * 52} cy={-178} r={20} fill={color} opacity={0.35 * brillo} />
          <circle cx={lado * 52} cy={-178} r={10} fill={color} stroke={C.contorno} strokeWidth={4} />
        </g>
      ))}

      {/* cabeza */}
      <circle cx={0} cy={-66} r={66} fill={C.coral} stroke={C.contorno} strokeWidth={5} />
      <path d="M -44 -104 Q -20 -126 12 -124" stroke="#FFFFFF" strokeWidth={9} strokeLinecap="round" fill="none" opacity={0.35} />
      <path d="M -60 -40 Q 0 0 60 -40" stroke={C.coralOscuro} strokeWidth={6} fill="none" opacity={0.25} />

      <Mejillas x={44} y={-40} rx={11} ry={7} />
      <Ojo cx={-25} cy={-72} rx={18} ry={22} expresion={expresion} mirada={mirada} apertura={apertura} lado={-1} />
      <Ojo cx={25} cy={-72} rx={18} ry={22} expresion={expresion} mirada={mirada} apertura={apertura} lado={1} />
      <Ceja cx={-26} cy={-104} ancho={22} expresion={expresion} lado={-1} />
      <Ceja cx={26} cy={-104} ancho={22} expresion={expresion} lado={1} />
      <Boca cx={0} cy={-38} ancho={30} expresion={expresion} habla={habla} />
    </g>
  );
};
