import React from "react";
import { AbsoluteFill, spring, useVideoConfig } from "remotion";
import { C, FUENTE_TITULO } from "../../../marca";
import { bocaDe, clave, EscenaColocada, paso, pose } from "../../../comun/tiempo";
import { Fx, MusicaEscena, useEscena, VocesEscena } from "../../../comun/Sonido";
import { Iris } from "../../../comun/Rotulos";
import { CuentaAtras } from "../../../comun/Juego";
import { Autobus, DienteAfilado, DienteCuchara } from "../../../escenario/Cosas";
import { Braquiosaurio } from "../../../escenario/Dinos";
import { Arbol } from "../../../escenario/Bosque";
import { Galleta } from "../../../personajes/Galleta";
import { Lechuza } from "../../../personajes/Lechuza";
import { POSES } from "../../../personajes/cara";
import { usePalabra } from "../mundo";

const Tarjeta: React.FC<{ x: number; visible: number; acierto: number; children: React.ReactNode }> = ({ x, visible, acierto, children }) => {
  if (visible <= 0.01) return null;
  return (
    <g transform={`translate(${x} 560) scale(${visible}) rotate(${(1 - visible) * -8})`}>
      {acierto > 0.01 ? <rect x={-290} y={-300} width={580} height={600} rx={56} fill={C.luzTurquesa} opacity={0.5 * acierto} /> : null}
      <rect x={-260} y={-270} width={520} height={540} rx={44} fill="#FFFFFF" stroke={C.contorno} strokeWidth={7} />
      <rect x={-230} y={-60} width={460} height={60} rx={20} fill="#F28B9B" stroke={C.contorno} strokeWidth={5} />
      {children}
      {acierto > 0.01 ? (
        <g transform={`translate(190 -220) scale(${acierto})`}>
          <circle r={56} fill={C.luzTurquesa} stroke={C.contorno} strokeWidth={6} />
          <path d="M -26 0 L -6 22 L 28 -22" stroke="#FFFFFF" strokeWidth={14} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      ) : null}
    </g>
  );
};

// ¡Te toca a ti! Dientes afilados o en forma de cuchara: ¿cuáles son para
// comer carne? Luego, el braquiosaurio, tan largo como casi dos autobuses,
// que se tragaba las hojas sin masticar.
export const E05Pregunta: React.FC<{ escena: EscenaColocada }> = ({ escena }) => {
  const { frame, ini, fin } = useEscena(escena);
  const { fps } = useVideoConfig();
  const pal = usePalabra(escena);

  const tarjeta = (momento: number) => spring({ frame: frame - momento, fps, config: { damping: 12, stiffness: 140 } });
  const afilados = tarjeta(pal("l037", "afilados") - 4);
  const cucharas = tarjeta(pal("l037", "cucharitas") - 4);
  const cuenta: [number, number] = [fin("l037") + 4, ini("l038") - 2];
  const acierto = clave(frame, [
    [pal("l038", "afilados"), 0],
    [pal("l038", "afilados") + 10, 1],
  ]);
  const pregunta = 1 - clave(frame, [
    [pal("l039", "braquiosaurio") - 8, 0],
    [pal("l039", "braquiosaurio") + 4, 1],
  ]);
  const braquio = 1 - pregunta;
  const buses = clave(frame, [
    [pal("l040", "dos") - 6, 0],
    [pal("l040", "autobuses") + 8, 1],
  ]);
  const glup = clave(frame, [
    [pal("l040", "tragaba"), -1],
    [pal("l040", "tragaba") + 1, 0],
    [fin("l040") + 6, 1],
  ]);
  const come = frame >= pal("l039", "hojas") - 4 && frame < pal("l040", "tragaba") ? 0.5 + 0.5 * Math.sin(frame * 0.5) : 0;

  return (
    <AbsoluteFill>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080">
        {/* ----- la pregunta ----- */}
        <g opacity={pregunta}>
          <rect x={0} y={0} width={1920} height={1080} fill="#FFF3D6" />
          {Array.from({ length: 30 }, (_, i) => (
            <circle key={i} cx={(i * 263) % 1920} cy={(i * 151) % 1080} r={10 + (i % 4) * 6} fill={[C.luzAmarilla, C.luzTurquesa, C.luzRosa][i % 3]} opacity={0.18} />
          ))}
          <text x={960} y={150} textAnchor="middle" fontFamily={FUENTE_TITULO} fontWeight={800} fontSize={96} fill={C.texto}>
            ¡Te toca a ti!
          </text>
          <Tarjeta x={520} visible={afilados} acierto={acierto}>
            <DienteAfilado x={-130} y={-60} escala={0.9} rot={180} />
            <DienteAfilado x={0} y={-60} escala={1.05} rot={180} />
            <DienteAfilado x={130} y={-60} escala={0.85} rot={180} />
          </Tarjeta>
          <Tarjeta x={1400} visible={cucharas} acierto={0}>
            {[-150, -50, 50, 150].map((dx, i) => (
              <DienteCuchara key={dx} x={dx} y={-60} escala={0.85 + (i % 2) * 0.08} rot={180} />
            ))}
          </Tarjeta>
          <g opacity={clave(frame, [[pal("l037", "cuales") - 4, 0], [pal("l037", "cuales") + 6, 1], [cuenta[0], 1], [cuenta[0] + 6, 0]])}>
            <circle cx={960} cy={560} r={90} fill={C.luzAmarilla} stroke={C.contorno} strokeWidth={7} />
            <text x={960} y={600} textAnchor="middle" fontFamily={FUENTE_TITULO} fontWeight={800} fontSize={120} fill={C.texto}>
              ?
            </text>
          </g>
          <CuentaAtras desde={cuenta[0]} hasta={cuenta[1]} x={960} y={560} r={100} />
          <Galleta
            x={180}
            y={1130}
            escala={0.75}
            expresion={paso(frame, [
              [0, "pensando" as const],
              [ini("l038"), "riendo" as const],
            ])}
            habla={bocaDe(escena, "galleta", frame)}
            brazos={pose(frame, [
              [0, POSES.pensar],
              [ini("l038"), POSES.señalar],
            ])}
            mirada={{ x: 1, y: -0.6 }}
          />
        </g>

        {/* ----- el braquiosaurio ----- */}
        {braquio > 0.01 ? (
          <g opacity={braquio}>
            <rect x={0} y={0} width={1920} height={1080} fill="#BDE7FF" />
            <circle cx={1700} cy={160} r={80} fill="#FFE9A8" />
            <path d="M 0 700 Q 500 640 960 690 Q 1400 730 1920 680 L 1920 1080 L 0 1080 Z" fill="#9BD27A" stroke={C.contorno} strokeWidth={5} />
            {/* árbol altísimo */}
            <path d="M 1270 820 L 1290 300 L 1330 300 L 1350 820 Z" fill="#8B5A2B" stroke={C.contorno} strokeWidth={6} />
            {[
              [1310, 210, 150],
              [1190, 280, 100],
              [1430, 270, 110],
            ].map(([cx, cy, r], i) => (
              <circle key={i} cx={cx} cy={cy} r={r} fill={i % 2 ? "#4FA866" : "#57B77A"} stroke={C.contorno} strokeWidth={6} />
            ))}
            <Arbol x={200} y={760} s={1.1} tono="#57B77A" tonoClaro="#8EE0A6" />
            <Braquiosaurio
              x={790}
              y={800}
              escala={0.95}
              cuello={clave(frame, [
                [pal("l039", "cuello") - 4, -6],
                [pal("l039", "cuello") + 14, 4],
              ])}
              boca={come}
              glup={glup}
              expresion={paso(frame, [
                [0, "feliz" as const],
                [pal("l040", "tragaba"), "sorprendido" as const],
                [fin("l040") + 6, "feliz" as const],
                [pal("l041", "abuela"), "contento" as const],
              ])}
              mirada={frame >= ini("l041") ? { x: -0.4, y: 1 } : { x: 1, y: 0 }}
            />
            {/* casi tan largo como dos autobuses */}
            <g opacity={buses}>
              {(() => {
                const ancho = 420;
                const x0 = 790 - 400 * 0.95;
                const x = clave(frame, [
                  [pal("l040", "dos") - 6, 2000],
                  [pal("l040", "autobuses") + 8, x0],
                ]);
                return (
                  <g>
                    <Autobus x={x} y={1050} largo={ancho - 12} />
                    <Autobus x={x + ancho} y={1050} largo={ancho - 12} color="#FF9E5E" />
                  </g>
                );
              })()}
            </g>
            {/* Galleta y su abuela: hay que masticar bien */}
            {frame >= ini("l041") - 12 ? (
              <Galleta
                x={clave(frame, [
                  [ini("l041") - 12, -200],
                  [ini("l041") + 4, 230],
                ])}
                y={1120}
                escala={0.8}
                expresion={paso(frame, [
                  [0, "sorprendido" as const],
                  [pal("l041", "abuela"), "feliz" as const],
                ])}
                habla={bocaDe(escena, "galleta", frame)}
                brazos={pose(frame, [
                  [0, POSES.manosCara],
                  [pal("l041", "abuela"), { a: 14, b: 160 }],
                ])}
                mirada={{ x: 1, y: -0.8 }}
              />
            ) : null}
            {frame >= ini("l040") - 10 && frame < ini("l041") ? (
              <Lechuza
                x={clave(frame, [
                  [ini("l040") - 10, 2100],
                  [ini("l040") + 6, 1700],
                ])}
                y={1100}
                escala={0.7}
                voltear
                habla={bocaDe(escena, "lechuza", frame)}
                alaB={40}
                mirada={{ x: 0.6, y: -0.6 }}
              />
            ) : null}
          </g>
        ) : null}
        <Iris duracion={escena.duracion} entrada={14} salida={16} />
      </svg>
      <VocesEscena escena={escena} />
      <MusicaEscena pista="repaso" escena={escena} volumen={0.13} />
      <Fx efecto="acierto" en={fin("l038") + 2} volumen={0.5} />
      <Fx efecto="glup" en={pal("l040", "sin")} volumen={0.18} />
    </AbsoluteFill>
  );
};
