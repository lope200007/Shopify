import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { C, FUENTE_TEXTO, FUENTE_TITULO } from "../../../marca";
import { bocaDe, clave, EscenaColocada, paso, pose, quienHabla } from "../../../comun/tiempo";
import { Fx, MusicaEscena, useEscena, VocesEscena } from "../../../comun/Sonido";
import { Iris, Logo, Rotulo } from "../../../comun/Rotulos";
import { BosqueNoche, CieloNoche, LucesFlotantes } from "../../../escenario/Bosque";
import { LunaFase } from "../../../escenario/Luna";
import { Farolin } from "../../../personajes/Farolin";
import { Galleta } from "../../../personajes/Galleta";
import { POSES } from "../../../personajes/cara";

/** Dibujo de la luna hecho con ceras (el reto). */
const DibujoCeras: React.FC<{ visible: number }> = ({ visible }) => (
  <g transform={`translate(1450 520) rotate(4) scale(${visible})`} opacity={visible}>
    <rect x={-210} y={-170} width={420} height={330} rx={10} fill="#FFFDF5" stroke={C.contorno} strokeWidth={6} />
    <path d="M -150 -120 L 150 -120" stroke="#DDE7F5" strokeWidth={3} />
    <path d="M 0 -95 A 85 85 0 0 0 0 75 A 40 85 0 0 1 0 -95 Z" fill="none" stroke="#F2B632" strokeWidth={9} strokeLinejoin="round" strokeDasharray="3 2" />
    {[
      [-120, -60],
      [120, -40],
      [90, 90],
      [-110, 100],
    ].map(([x, y], i) => (
      <path key={i} d={`M ${x} ${y - 14} L ${x + 4} ${y - 4} L ${x + 14} ${y} L ${x + 4} ${y + 4} L ${x} ${y + 14} L ${x - 4} ${y + 4} L ${x - 14} ${y} L ${x - 4} ${y - 4} Z`} fill="#8E7DBE" />
    ))}
    <text x={0} y={140} textAnchor="middle" fontFamily={FUENTE_TEXTO} fontWeight={600} fontSize={30} fill="#5A4E73">
      mi luna de hoy
    </text>
  </g>
);

export const E08Final: React.FC<{ escena: EscenaColocada }> = ({ escena }) => {
  const { frame, ini, fin } = useEscena(escena);
  const habla = quienHabla(escena, frame);
  const dibujo = clave(frame, [
    [ini("l059") + 30, 0],
    [ini("l059") + 44, 1],
    [ini("l060"), 1],
    [ini("l060") + 10, 0],
  ]);
  const mirarCielo = frame >= ini("l060") && frame < ini("l062");
  const final = interpolate(frame, [ini("l062") - 10, ini("l062") + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080">
        <CieloNoche estrellas={mirarCielo ? 150 : 90} />
        <LunaFase x={1500} y={200} r={90} fase={0.75} id="luna-e08" />
        <BosqueNoche />
        <LucesFlotantes n={12} semilla={31} />
        <Galleta
          x={760}
          y={910}
          escala={1}
          expresion={paso(frame, [[0, "feliz" as const], [ini("l059"), "riendo" as const], [ini("l060"), "pensando" as const], [ini("l061"), "sorprendido" as const], [fin("l061"), "riendo" as const]])}
          habla={bocaDe(escena, "galleta", frame)}
          brazos={pose(frame, [[0, POSES.reposo], [ini("l059") + 30, POSES.señalar], [ini("l060"), POSES.pensar], [ini("l061"), POSES.reposo], [ini("l062"), POSES.celebrar]])}
          mirada={mirarCielo ? { x: 0.6, y: -1 } : habla === "farolin" ? { x: -1, y: -0.4 } : { x: 0.4, y: 0 }}
        />
        <Farolin
          x={420}
          y={560}
          escala={1.2}
          expresion={paso(frame, [[0, "riendo" as const], [ini("l058") + 25, "feliz" as const], [ini("l061"), "pensando" as const], [ini("l061") + 30, "riendo" as const]])}
          habla={bocaDe(escena, "farolin", frame)}
          luz={paso(frame, [[0, "amarilla" as const], [fin("l061") + 2, "turquesa" as const], [ini("l062"), "rosa" as const]])}
          brazos={pose(frame, [[0, POSES.celebrar], [ini("l058") + 25, POSES.señalar], [fin("l058"), POSES.reposo], [ini("l062"), POSES.celebrar]])}
          mirada={mirarCielo ? { x: 0.5, y: -1 } : { x: 1, y: 0.2 }}
          idPrefijo="f-e08"
        />
        <Rotulo texto="¡Reto!" x={1240} y={300} desde={ini("l058") - 8} hasta={fin("l058") + 10} fondo={C.luzRosa} tam={84} />
        <DibujoCeras visible={dibujo} />
        <Rotulo texto="Próxima aventura" x={1400} y={520} desde={ini("l061") + 20} hasta={ini("l062") - 6} fondo={C.luzTurquesa} tam={58} />
        {/* cierre */}
        <g opacity={final}>
          <rect x={0} y={0} width={1920} height={1080} fill="#140F3D" opacity={0.6} />
          <Logo x={960} y={430} escala={1.1} />
          <text x={960} y={700} textAnchor="middle" fontFamily={FUENTE_TITULO} fontWeight={800} fontSize={72} fill={C.luzAmarilla} stroke={C.contorno} strokeWidth={10} paintOrder="stroke">
            ¡Aprender es una aventura!
          </text>
          <text x={960} y={800} textAnchor="middle" fontFamily={FUENTE_TEXTO} fontWeight={600} fontSize={42} fill="#FFFFFF">
            Próxima aventura: ¿por qué no se caen las estrellas?
          </text>
        </g>
        <Iris duracion={escena.duracion} entrada={14} salida={24} />
      </svg>
      <VocesEscena escena={escena} />
      <MusicaEscena pista="noche" escena={escena} volumen={0.14} hasta={ini("l062") - 8} ambiente />
      <MusicaEscena pista="tema" escena={escena} volumen={0.35} desde={ini("l062") - 10} />
      <Fx efecto="pop" en={ini("l058") - 8} volumen={0.4} />
      <Fx efecto="pop" en={ini("l059") + 30} volumen={0.22} />
      <Fx efecto="idea" en={fin("l061") + 2} volumen={0.4} />
    </AbsoluteFill>
  );
};
