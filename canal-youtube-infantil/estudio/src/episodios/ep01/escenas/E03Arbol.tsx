import React from "react";
import { AbsoluteFill, interpolate, spring, useVideoConfig } from "remotion";
import { bocaDe, clave, EscenaColocada, paso, pose, quienHabla } from "../../../comun/tiempo";
import { Fx, MusicaEscena, useEscena, VocesEscena } from "../../../comun/Sonido";
import { Iris } from "../../../comun/Rotulos";
import { CieloNoche, LucesFlotantes } from "../../../escenario/Bosque";
import { ArbolLechuzaFuera } from "../../../escenario/Arbol";
import { LunaFase } from "../../../escenario/Luna";
import { C } from "../../../marca";
import { Farolin } from "../../../personajes/Farolin";
import { Galleta } from "../../../personajes/Galleta";
import { Lechuza } from "../../../personajes/Lechuza";
import { POSES } from "../../../personajes/cara";

// Llegan al árbol. Doña Lechuza: «La luna no se rompe nunca… ¡vamos a comprobarlo!»
export const E03Arbol: React.FC<{ escena: EscenaColocada }> = ({ escena }) => {
  const { frame, ini, fin } = useEscena(escena);
  const { fps } = useVideoConfig();
  const habla = quienHabla(escena, frame);

  const llegada = clave(frame, [
    [0, -500],
    [ini("l015") - 2, 0],
  ]);
  const corre = frame < ini("l015") ? Math.abs(Math.sin(frame * 0.5)) * 16 : 0;

  const aparece = spring({ frame: frame - (ini("l016") - 8), fps, config: { damping: 12, stiffness: 140 } });
  const exprL = paso(frame, [
    [0, "feliz" as const],
    [ini("l016"), "sorprendido" as const],
    [ini("l016") + 45, "feliz" as const],
    [ini("l018"), "contento" as const],
    [ini("l018") + 40, "feliz" as const],
  ]);
  const alaL = clave(frame, [
    [ini("l018") + 50, 0],
    [ini("l018") + 62, 95],
    [fin("l018"), 95],
  ]);

  const exprG = paso(frame, [
    [0, "sorprendido" as const],
    [ini("l016"), "feliz" as const],
    [ini("l018"), "sorprendido" as const],
    [fin("l018") - 10, "riendo" as const],
  ]);
  const brazosG = pose(frame, [
    [0, POSES.manosCara],
    [ini("l016"), POSES.reposo],
    [fin("l018") - 10, POSES.celebrar],
  ]);
  const exprF = paso(frame, [
    [0, "sorprendido" as const],
    [ini("l017"), "preocupado" as const],
    [ini("l018"), "feliz" as const],
  ]);

  // destello cuando dice «¡Vamos a comprobarlo!»
  const destello = interpolate(frame, [fin("l018"), fin("l018") + 14, fin("l018") + 30], [0, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080">
        <CieloNoche />
        <LunaFase x={300} y={170} r={80} fase={0.75} id="luna-e03" />
        {/* suelo */}
        <path d="M -100 880 Q 960 840 2020 880 L 2020 1200 L -100 1200 Z" fill={C.verdeBosque} stroke={C.contorno} strokeWidth={5} />
        <ArbolLechuzaFuera suelo={900} />
        <LucesFlotantes n={8} semilla={21} />
        <g transform={`translate(1290 ${560 + (1 - aparece) * 120})`} opacity={aparece}>
          <Lechuza
            x={0}
            y={0}
            escala={0.72}
            expresion={exprL}
            habla={bocaDe(escena, "lechuza", frame)}
            alaB={alaL}
            mirada={habla === "galleta" || habla === "farolin" ? { x: -1, y: 0.5 } : { x: -0.6, y: 0.4 }}
            voltear
          />
        </g>
        <Galleta
          x={640 + llegada}
          y={920 - corre}
          escala={0.92}
          expresion={exprG}
          habla={bocaDe(escena, "galleta", frame)}
          brazos={brazosG}
          mirada={{ x: 1, y: -0.8 }}
        />
        <Farolin
          x={430 + llegada}
          y={560}
          escala={1.05}
          expresion={exprF}
          habla={bocaDe(escena, "farolin", frame)}
          luz={exprF === "preocupado" ? "azul" : "amarilla"}
          mirada={{ x: 1, y: -0.2 }}
          idPrefijo="f-e03"
        />
        <circle cx={1290} cy={440} r={420 * destello} fill="#FFF7C2" opacity={0.35 * destello} />
        <Iris duracion={escena.duracion} entrada={14} salida={18} centro={[960, 500]} />
      </svg>
      <VocesEscena escena={escena} />
      <MusicaEscena pista="noche" escena={escena} volumen={0.15} ambiente />
      <Fx efecto="pop" en={ini("l016") - 6} volumen={0.5} />
      <Fx efecto="magia" en={fin("l018") + 2} volumen={0.45} />
    </AbsoluteFill>
  );
};
