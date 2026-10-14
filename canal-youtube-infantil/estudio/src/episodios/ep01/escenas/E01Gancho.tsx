import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { C, FUENTE_TITULO } from "../../../marca";
import { bocaDe, clave, EscenaColocada, paso, pose, quienHabla } from "../../../comun/tiempo";
import { Fx, MusicaEscena, useEscena, VocesEscena } from "../../../comun/Sonido";
import { Iris, Logo } from "../../../comun/Rotulos";
import { BosqueNoche, CieloNoche, LucesFlotantes } from "../../../escenario/Bosque";
import { LunaFase } from "../../../escenario/Luna";
import { Farolin } from "../../../personajes/Farolin";
import { Galleta } from "../../../personajes/Galleta";
import { POSES } from "../../../personajes/cara";

// Galleta despierta a Farolín: «¡La luna se está rompiendo!». Cuarto menguante.
export const E01Gancho: React.FC<{ escena: EscenaColocada }> = ({ escena }) => {
  const { frame, ini, fin } = useEscena(escena);
  const habla = quienHabla(escena, frame);

  // Cámara: sube al cielo para ver la luna y vuelve
  const subir = clave(frame, [
    [ini("l003") + 10, 0],
    [ini("l003") + 40, 520],
    [fin("l004") + 4, 520],
    [ini("l005") + 14, 0],
  ]);
  const titulo = interpolate(frame, [ini("l006") - 6, ini("l006") + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Galleta entra corriendo
  const gx = clave(frame, [
    [0, 2150],
    [ini("l001") + 18, 1240],
  ]);
  const correBote = frame < ini("l001") + 18 ? Math.abs(Math.sin(frame * 0.5)) * 18 : 0;

  // Farolín dormido sobre la seta: se despierta en l002
  const despierto = frame >= ini("l002") - 4;
  // dormido encima del sombrero de la seta (y = 583) y, al despertar, vuela
  const fy = clave(frame, [
    [ini("l002") - 4, 583],
    [ini("l002") + 16, 520],
  ]);
  const brillo = clave(frame, [
    [ini("l002") - 4, 0.25],
    [ini("l002") + 20, 1],
  ]);

  const exprG = paso(frame, [
    [0, "sorprendido" as const],
    [ini("l003"), "sorprendido" as const],
    [ini("l005"), "preocupado" as const],
    [fin("l005"), "preocupado" as const],
  ]);
  const exprF = despierto
    ? paso(frame, [
        [0, "feliz" as const],
        [ini("l004"), "sorprendido" as const],
        [ini("l005"), "preocupado" as const],
      ])
    : ("contento" as const);
  const brazosG = pose(frame, [
    [0, POSES.celebrar],
    [ini("l002"), POSES.reposo],
    [ini("l003"), { a: 14, b: 165 }],
    [ini("l005"), POSES.brazosAbiertos],
    [ini("l005") + 30, { a: 120, b: 120 }],
    [fin("l005"), POSES.reposo],
  ]);

  // trozo que falta: contorno punteado de la luna llena
  const contorno = clave(frame, [
    [ini("l004") + 8, 0],
    [ini("l004") + 22, 1],
    [fin("l004") + 4, 1],
    [fin("l004") + 14, 0],
  ]);

  return (
    <AbsoluteFill>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080">
        <g transform={`translate(0 ${subir})`}>
          <CieloNoche alto={1080} />
          <g transform="translate(0 -520)">
            <CieloNoche alto={600} estrellas={60} />
          </g>
          <LunaFase x={1300} y={-330} r={150} fase={0.75} id="luna-e01" brilloHalo={0.8} />
          <circle cx={1300} cy={-330} r={150} fill="none" stroke="#FFF4C2" strokeWidth={8} strokeDasharray="22 16" opacity={contorno * 0.9} />
          <BosqueNoche />
          <LucesFlotantes n={10} />
          {/* seta grande donde duerme Farolín */}
          <g transform="translate(700 860)">
            <path d="M -30 0 Q -34 -60 -20 -90 L 20 -90 Q 34 -60 30 0 Z" fill="#FFF1DC" stroke={C.contorno} strokeWidth={5} />
            <path d="M -110 -80 Q -100 -190 0 -196 Q 100 -190 110 -80 Q 0 -60 -110 -80 Z" fill="#E85D75" stroke={C.contorno} strokeWidth={5} />
            <circle cx={-50} cy={-140} r={14} fill="#FFFFFF" />
            <circle cx={30} cy={-160} r={12} fill="#FFFFFF" />
            <circle cx={60} cy={-110} r={10} fill="#FFFFFF" />
          </g>
          {!despierto
            ? [0, 1, 2].map((k) => {
                const t = (frame + k * 20) % 60;
                return (
                  <text key={k} x={770 + t * 1.2} y={470 - t * 1.6} fontFamily={FUENTE_TITULO} fontWeight={800} fontSize={30 + t * 0.4} fill="#FFFFFF" opacity={1 - t / 60}>
                    z
                  </text>
                );
              })
            : null}
          <Farolin
            x={700}
            y={fy}
            escala={1.25}
            expresion={exprF}
            habla={bocaDe(escena, "farolin", frame)}
            luz={exprF === "preocupado" ? "azul" : "amarilla"}
            brillo={brillo}
            volando={despierto}
            mirada={habla === "galleta" ? { x: 1, y: 0 } : subir > 200 ? { x: 0.6, y: -1 } : { x: 0.6, y: 0 }}
            brazos={despierto ? POSES.reposo : { a: 30, b: 30 }}
            idPrefijo="f-e01"
          />
          <Galleta
            x={gx}
            y={900 - correBote}
            escala={1.1}
            expresion={exprG}
            habla={bocaDe(escena, "galleta", frame)}
            brazos={brazosG}
            voltear={frame < ini("l001") + 18}
            mirada={subir > 200 ? { x: 0.3, y: -1 } : { x: -1, y: 0 }}
          />
        </g>
        {/* título: en pregunta, como en YouTube (lo que el vídeo responde, sin afirmar algo falso) */}
        <g opacity={titulo}>
          <rect x={0} y={0} width={1920} height={1080} fill="#140F3D" opacity={0.55} />
          <Logo x={960} y={430} escala={1.15 * (0.85 + 0.15 * titulo)} />
          <text x={960} y={720} textAnchor="middle" fontFamily={FUENTE_TITULO} fontWeight={800} fontSize={78} fill="#FFFFFF" stroke={C.contorno} strokeWidth={10} paintOrder="stroke">
            ¿La luna se está rompiendo?
          </text>
        </g>
        <Iris duracion={escena.duracion} entrada={12} salida={16} centro={[960, 600]} />
      </svg>
      <VocesEscena escena={escena} />
      <MusicaEscena pista="noche" escena={escena} volumen={0.16} hasta={ini("l006") - 4} ambiente />
      <MusicaEscena pista="tema" escena={escena} volumen={0.35} desde={ini("l006") - 6} />
      <Fx efecto="susurro" en={ini("l003") + 8} volumen={0.2} />
    </AbsoluteFill>
  );
};
