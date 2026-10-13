import React from "react";
import { useCurrentFrame } from "remotion";
import { C } from "../marca";
import { aperturaOjos, Ceja, Expresion, Mirada } from "./cara";

export type LechuzaProps = {
  x: number;
  y: number; // suelo / rama bajo sus pies
  escala?: number;
  expresion?: Expresion;
  habla?: number;
  mirada?: Mirada;
  alaA?: number; // grados: 0 plegada, 90 extendida hacia fuera
  alaB?: number;
  voltear?: boolean;
  semilla?: number;
  inclinacion?: number; // inclinación de cabeza, grados
  objetoAlaB?: React.ReactNode;
  parpadea?: boolean;
};

// Doña Lechuza: la sabia del bosque. No da las respuestas: propone un
// experimento. Su frase: «Uuuh… vamos a comprobarlo».
export const Lechuza: React.FC<LechuzaProps> = ({
  x,
  y,
  escala = 1,
  expresion = "feliz",
  habla = 0,
  mirada = { x: 0, y: 0 },
  alaA = 0,
  alaB = 0,
  voltear = false,
  semilla = 3,
  inclinacion = 0,
  objetoAlaB,
  parpadea = true,
}) => {
  const frame = useCurrentFrame();
  const apertura = aperturaOjos(frame, semilla, parpadea);
  const respira = Math.sin(frame * 0.08 + semilla) * 0.012;
  const cabeceo = inclinacion + Math.sin(frame * 0.05 + semilla) * 1.5;
  const ojosCerrados = expresion === "contento" || expresion === "riendo";
  const pico = Math.max(0, Math.min(1, habla));
  const sx = escala * (voltear ? -1 : 1);

  const plumas = [
    [-30, 40],
    [0, 52],
    [30, 40],
    [-18, 78],
    [18, 78],
    [-34, 112],
    [0, 116],
    [34, 112],
  ];

  return (
    <g transform={`translate(${x} ${y}) scale(${sx} ${escala}) translate(0 -168)`}>
      <ellipse cx={0} cy={170} rx={88} ry={13} fill="#000000" opacity={0.15} />

      {/* patas */}
      {[-1, 1].map((lado) => (
        <g key={lado} transform={`translate(${lado * 32} 156)`}>
          {[-12, 0, 12].map((dx) => (
            <path key={dx} d={`M 0 -6 L ${dx} 10`} stroke={C.contorno} strokeWidth={10} strokeLinecap="round" />
          ))}
          {[-12, 0, 12].map((dx) => (
            <path key={`c${dx}`} d={`M 0 -6 L ${dx} 10`} stroke="#F2A33A" strokeWidth={5} strokeLinecap="round" />
          ))}
        </g>
      ))}

      {/* cuerpo */}
      <g transform={`translate(0 150) scale(${1 - respira} ${1 + respira}) translate(0 -150)`}>
        <ellipse cx={0} cy={44} rx={88} ry={118} fill={C.lechuza} stroke={C.contorno} strokeWidth={5} />
        <ellipse cx={0} cy={72} rx={60} ry={78} fill="#F8E7C4" />
        {plumas.map(([px, py], i) => (
          <path key={i} d={`M ${px - 6} ${py} Q ${px} ${py + 8} ${px + 6} ${py}`} stroke={C.lechuzaOscuro} strokeWidth={3.5} fill="none" strokeLinecap="round" />
        ))}
      </g>

      {/* alas */}
      {(
        [
          [-1, alaA],
          [1, alaB],
        ] as const
      ).map(([lado, ang]) => (
        <g key={lado} transform={`translate(${lado * 74} -14) rotate(${lado === -1 ? ang : -ang})`}>
          <path
            d="M 0 0 Q -34 60 -12 128 Q 6 140 22 120 Q 30 60 0 0 Z"
            transform={lado === 1 ? "scale(-1 1)" : undefined}
            fill={C.lechuzaOscuro}
            stroke={C.contorno}
            strokeWidth={5}
            strokeLinejoin="round"
          />
          {[40, 70, 100].map((py) => (
            <path key={py} d={`M ${lado * -14} ${py} Q ${lado * -4} ${py + 8} ${lado * 8} ${py}`} stroke={C.contorno} strokeWidth={3} fill="none" opacity={0.35} />
          ))}
          {lado === 1 && objetoAlaB ? <g transform="translate(0 132)">{objetoAlaB}</g> : null}
        </g>
      ))}

      {/* cabeza */}
      <g transform={`rotate(${cabeceo} 0 -40)`}>
        <ellipse cx={0} cy={-96} rx={96} ry={88} fill={C.lechuza} stroke={C.contorno} strokeWidth={5} />
        {/* cara en forma de corazón */}
        <path
          d="M 0 -146 C -30 -184 -92 -160 -84 -104 C -78 -60 -36 -30 0 -18 C 36 -30 78 -60 84 -104 C 92 -160 30 -184 0 -146 Z"
          fill={C.caraLechuza}
          stroke={C.lechuzaOscuro}
          strokeWidth={4}
        />
        {/* ojos negros de lechuza */}
        {[-1, 1].map((lado) => {
          const ox = lado * 36;
          const oy = -100;
          return (
            <g key={lado}>
              {ojosCerrados ? (
                <path d={`M ${ox - 16} ${oy + 4} Q ${ox} ${oy - 14} ${ox + 16} ${oy + 4}`} stroke={C.contorno} strokeWidth={6} fill="none" strokeLinecap="round" />
              ) : (
                <g transform={`translate(${ox} ${oy}) scale(1 ${Math.max(0.06, apertura)}) translate(${-ox} ${-oy})`}>
                  <circle cx={ox} cy={oy} r={expresion === "sorprendido" ? 21 : 18} fill="#2B1B12" />
                  <circle cx={ox - 6 + mirada.x * 4} cy={oy - 7 + mirada.y * 4} r={6} fill="#FFFFFF" />
                  <circle cx={ox + 6 + mirada.x * 4} cy={oy + 6 + mirada.y * 4} r={2.5} fill="#FFFFFF" />
                </g>
              )}
              {/* gafas */}
              <circle cx={ox} cy={oy} r={30} fill="#CFEFFF" opacity={0.18} />
              <circle cx={ox} cy={oy} r={30} fill="none" stroke="#5B3A1E" strokeWidth={6} />
              <Ceja cx={ox} cy={oy - 40} ancho={26} expresion={expresion} lado={lado as -1 | 1} grosor={5} color={C.lechuzaOscuro} />
            </g>
          );
        })}
        <path d="M -6 -100 Q 0 -108 6 -100" stroke="#5B3A1E" strokeWidth={6} fill="none" />
        {/* pico: la parte de abajo se abre al hablar */}
        <path d={`M -11 -70 L 11 -70 L 0 ${-52 + pico * 4} Z`} fill="#E9A779" stroke={C.contorno} strokeWidth={3.5} strokeLinejoin="round" />
        <path
          d={`M -9 ${-66 + pico * 7} L 9 ${-66 + pico * 7} L 0 ${-56 + pico * 12} Z`}
          fill="#C97E52"
          stroke={C.contorno}
          strokeWidth={3}
          strokeLinejoin="round"
          opacity={pico > 0.05 ? 1 : 0}
        />
        <g opacity={0.5}>
          <ellipse cx={-58} cy={-70} rx={13} ry={8} fill={C.rosaMejillas} />
          <ellipse cx={58} cy={-70} rx={13} ry={8} fill={C.rosaMejillas} />
        </g>
      </g>
    </g>
  );
};
