import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { C } from "../../../marca";
import { bocaDe, clave, EscenaColocada, paso, pose, quienHabla, salto } from "../../../comun/tiempo";
import { Fx, MusicaEscena, useEscena, VocesEscena } from "../../../comun/Sonido";
import { Iris, Rotulo } from "../../../comun/Rotulos";
import { BosqueNoche, CieloNoche, LucesFlotantes } from "../../../escenario/Bosque";
import { LunaFase } from "../../../escenario/Luna";
import { Farolin } from "../../../personajes/Farolin";
import { Galleta } from "../../../personajes/Galleta";
import { POSES } from "../../../personajes/cara";

/** Red de cazar mariposas (en la mano de Galleta: el palo sigue al brazo). */
export const Red: React.FC = () => (
  <g>
    <path d="M 0 -10 L 0 150" stroke={C.contorno} strokeWidth={12} strokeLinecap="round" />
    <path d="M 0 -10 L 0 150" stroke="#C98A4B" strokeWidth={6} strokeLinecap="round" />
    <ellipse cx={0} cy={190} rx={46} ry={40} fill="none" stroke={C.contorno} strokeWidth={8} />
    <ellipse cx={0} cy={190} rx={46} ry={40} fill="none" stroke="#F2C14E" strokeWidth={4} />
    <path d="M -44 196 Q 0 300 44 196" fill="#FFFFFF" opacity={0.55} stroke={C.contorno} strokeWidth={3} />
    {[-24, 0, 24].map((dx) => (
      <path key={dx} d={`M ${dx} 222 L ${dx * 0.6} 270`} stroke={C.contorno} strokeWidth={1.5} opacity={0.4} />
    ))}
  </g>
);

// El plan de Galleta: atrapar la luna con una red. Sale torcido (y blandito).
export const E02Plan: React.FC<{ escena: EscenaColocada }> = ({ escena }) => {
  const { frame, ini, fin } = useEscena(escena);
  const habla = quienHabla(escena, frame);

  const s1 = fin("l009") + 6; // primer salto
  const s2 = s1 + 30; // segundo salto, más alto, hacia las hojas
  const aterriza = s2 + 28;
  const j1 = salto(frame, s1, 140, 24);
  const j2 = salto(frame, s2, 300, 28);
  const enHojas = frame >= aterriza && frame < ini("l011") + 6;
  const gx = clave(frame, [
    [s2, 900],
    [aterriza, 1180],
  ]);
  const hundida = enHojas ? 60 : clave(frame, [[ini("l011") + 6, 60], [ini("l011") + 18, 0]]);
  const sacudida = frame >= aterriza ? interpolate(frame - aterriza, [0, 6, 40], [0, 1.4, 0], { extrapolateRight: "clamp" }) : 0;

  const conRed = frame >= ini("l007") + 20 && frame < aterriza;
  const exprG = paso(frame, [
    [0, "feliz" as const],
    [ini("l007"), "riendo" as const],
    [ini("l007") + 25, "feliz" as const],
    [s1 - 4, "sorprendido" as const],
    [aterriza, "contento" as const],
    [ini("l011"), "riendo" as const],
    [ini("l011") + 40, "pensando" as const],
    [ini("l014"), "riendo" as const],
  ]);
  const brazosG = pose(frame, [
    [0, POSES.reposo],
    [ini("l007"), POSES.celebrar],
    [ini("l007") + 22, { a: 14, b: 120 }],
    [s1 - 6, { a: 40, b: 170 }],
    [aterriza, POSES.brazosAbiertos],
    [ini("l011") + 10, POSES.celebrar],
    [ini("l011") + 40, POSES.reposo],
    [ini("l014"), { a: 14, b: 140 }],
  ]);

  const fx = clave(frame, [
    [0, 640],
    [ini("l010"), 640],
    [ini("l010") + 20, 960],
    [ini("l013"), 960],
    [ini("l013") + 20, 860],
  ]);
  const fy = clave(frame, [
    [0, 560],
    [ini("l010") + 20, 640],
    [ini("l012"), 560],
  ]);
  const exprF = paso(frame, [
    [0, "feliz" as const],
    [ini("l008"), "preocupado" as const],
    [s1, "sorprendido" as const],
    [ini("l010"), "preocupado" as const],
    [ini("l012"), "pensando" as const],
    [ini("l013"), "riendo" as const],
    [ini("l013") + 30, "feliz" as const],
  ]);
  const luz = paso(frame, [
    [0, "amarilla" as const],
    [ini("l008"), "azul" as const],
    [ini("l011"), "amarilla" as const],
    [ini("l013") - 16, "turquesa" as const],
    [fin("l013"), "amarilla" as const],
  ]);
  const brazosF = pose(frame, [
    [0, POSES.reposo],
    [ini("l012"), { a: 14, b: 160 }],
    [ini("l013"), POSES.celebrar],
    [fin("l013"), POSES.reposo],
  ]);

  // salida: los dos se van hacia la izquierda
  const salida = frame >= fin("l014") ? frame - fin("l014") : 0;
  const huida = interpolate(salida, [0, 30], [0, -1300], { extrapolateRight: "clamp" });

  const galletaY = 900 + j1.dy + j2.dy + hundida;
  const estira = j1.estira * j2.estira;

  return (
    <AbsoluteFill>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080">
        <CieloNoche />
        <LunaFase x={1560} y={190} r={92} fase={0.75} id="luna-e02" />
        <BosqueNoche hojas sacudidaHojas={sacudida} />
        <LucesFlotantes n={8} semilla={9} />
        <Galleta
          x={gx + huida}
          y={galletaY}
          escala={1.05}
          expresion={exprG}
          habla={bocaDe(escena, "galleta", frame)}
          brazos={brazosG}
          estiramiento={estira}
          voltear={salida > 0}
          mirada={frame >= s1 - 6 && frame < aterriza ? { x: 0.5, y: -1 } : habla === "farolin" ? { x: -1, y: -0.3 } : { x: 0, y: 0 }}
          objeto={conRed ? <Red /> : undefined}
        />
        {/* hojas pegadas en la cabeza después de caer */}
        {frame >= aterriza && frame < fin("l014") ? (
          <g transform={`translate(${gx + huida} ${galletaY - 152 * 1.05 - 200})`}>
            <path d="M -40 0 Q -26 -16 -10 0 Q -26 12 -40 0 Z" fill="#E9883A" stroke={C.contorno} strokeWidth={3} />
            <path d="M 10 -10 Q 26 -26 44 -8 Q 24 2 10 -10 Z" fill="#F2C14E" stroke={C.contorno} strokeWidth={3} />
          </g>
        ) : null}
        <Farolin
          x={fx + huida}
          y={fy}
          escala={1.2}
          expresion={exprF}
          habla={bocaDe(escena, "farolin", frame)}
          luz={luz}
          brazos={brazosF}
          voltear={salida > 0}
          mirada={habla === "galleta" ? { x: 1, y: 0.2 } : { x: 0.5, y: -0.5 }}
          idPrefijo="f-e02"
        />
        <Rotulo texto="¡Tengo un plan!" x={1240} y={300} desde={ini("l007") + 8} hasta={fin("l007") + 12} tam={64} fondo={C.luzAmarilla} />
        <Iris duracion={escena.duracion} entrada={14} salida={16} centro={[480, 600]} />
      </svg>
      <VocesEscena escena={escena} />
      <MusicaEscena pista="aventura" escena={escena} volumen={0.16} ambiente />
      <Fx efecto="pop" en={ini("l007") + 18} volumen={0.5} />
      <Fx efecto="salto" en={s1} volumen={0.5} />
      <Fx efecto="salto" en={s2} volumen={0.55} />
      <Fx efecto="plof" en={aterriza} volumen={0.7} />
      <Fx efecto="idea" en={ini("l013") - 16} volumen={0.45} />
      <Fx efecto="susurro" en={fin("l014") + 2} volumen={0.4} />
    </AbsoluteFill>
  );
};
