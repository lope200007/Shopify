import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { C, FUENTE_TITULO } from "../../../marca";
import { bocaDe, clave, EscenaColocada, paso, pose, quienHabla } from "../../../comun/tiempo";
import { Fx, MusicaEscena, useEscena, VocesEscena } from "../../../comun/Sonido";
import { Iris, Rotulo } from "../../../comun/Rotulos";
import { InteriorArbol } from "../../../escenario/Arbol";
import { CieloNoche } from "../../../escenario/Bosque";
import { Astronauta, FilaTierras, SueloLunar, Tierra } from "../../../escenario/Espacio";
import { LunaFase } from "../../../escenario/Luna";
import { Farolin } from "../../../personajes/Farolin";
import { Galleta } from "../../../personajes/Galleta";
import { Lechuza } from "../../../personajes/Lechuza";
import { POSES } from "../../../personajes/cara";

const fundido = (frame: number, desde: number, hasta: number, t = 8) =>
  Math.min(
    interpolate(frame, [desde - t, desde], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    interpolate(frame, [hasta, hasta + t], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
  );

/** Luna de queso (lo que imagina Galleta). */
const LunaQueso: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <circle r={110} fill="#FFD95A" stroke={C.contorno} strokeWidth={6} />
    {[
      [-40, -30, 22],
      [30, 20, 28],
      [-20, 50, 16],
      [50, -50, 14],
    ].map(([cx, cy, r], i) => (
      <circle key={i} cx={cx} cy={cy} r={r} fill="#F2B632" stroke={C.contorno} strokeWidth={4} />
    ))}
  </g>
);

export const E06Datos: React.FC<{ escena: EscenaColocada }> = ({ escena }) => {
  const { frame, ini, fin } = useEscena(escena);
  const habla = quienHabla(escena, frame);

  const espacio = fundido(frame, ini("l048"), ini("l049") - 4);
  // primero se tacha la luna de queso («Uuuh, no…») y luego se va a la luna de verdad
  const luna = fundido(frame, ini("l052") + 46, ini("l053") - 4);
  const interior = 1 - Math.max(espacio, luna);

  const tira = clave(frame, [
    [ini("l046") + 10, 0],
    [ini("l046") + 24, 1],
    [fin("l046") + 10, 1],
    [fin("l046") + 20, 0],
  ]);
  const queso = clave(frame, [
    [ini("l051") + 6, 0],
    [ini("l051") + 18, 1],
    [ini("l052") + 40, 1],
    [ini("l052") + 48, 0],
  ]);
  const tachar = clave(frame, [
    [ini("l052") + 14, 0],
    [ini("l052") + 22, 1],
  ]);

  return (
    <AbsoluteFill>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080">
        {/* ---------------- dentro del árbol */}
        <g opacity={interior}>
          <InteriorArbol lampara={1} />
          <Lechuza
            x={1560}
            y={850}
            voltear
            expresion={paso(frame, [[0, "feliz" as const], [ini("l050"), "riendo" as const], [fin("l050"), "feliz" as const], [ini("l052"), "contento" as const], [ini("l052") + 30, "feliz" as const]])}
            habla={bocaDe(escena, "lechuza", frame)}
            alaB={clave(frame, [[ini("l046"), 0], [ini("l046") + 12, 60], [fin("l046"), 60], [fin("l046") + 10, 0]])}
            mirada={habla === "galleta" ? { x: 1, y: 0.4 } : { x: 0.7, y: 0.2 }}
          />
          <Galleta
            x={980}
            y={850}
            expresion={paso(frame, [
              [0, "pensando" as const],
              [ini("l046"), "feliz" as const],
              [ini("l047"), "sorprendido" as const],
              [ini("l050"), "riendo" as const],
              [ini("l051"), "pensando" as const],
              [ini("l052"), "sorprendido" as const],
              [ini("l053"), "riendo" as const],
            ])}
            habla={bocaDe(escena, "galleta", frame)}
            brazos={pose(frame, [[0, POSES.reposo], [ini("l050"), POSES.celebrar], [fin("l050"), POSES.reposo], [ini("l051"), POSES.pensar], [ini("l052"), POSES.reposo]])}
            mirada={habla === "farolin" ? { x: -1, y: -0.3 } : { x: 1, y: -0.2 }}
          />
          <Farolin
            x={560}
            y={520}
            escala={1.15}
            expresion={paso(frame, [[0, "feliz" as const], [ini("l049"), "riendo" as const], [fin("l050"), "feliz" as const], [ini("l053"), "riendo" as const]])}
            habla={bocaDe(escena, "farolin", frame)}
            luz={paso(frame, [[0, "amarilla" as const], [ini("l053"), "rosa" as const]])}
            brazos={pose(frame, [[0, POSES.reposo], [ini("l049"), POSES.señalar], [fin("l049"), POSES.reposo], [ini("l053"), POSES.celebrar]])}
            mirada={{ x: 1, y: 0.2 }}
            idPrefijo="f-e06"
          />
          {/* tira de fases: casi un mes */}
          <g opacity={tira} transform={`translate(0 ${(1 - tira) * -40})`}>
            <rect x={300} y={60} width={1320} height={220} rx={40} fill="#140F3D" stroke={C.contorno} strokeWidth={6} opacity={0.92} />
            {Array.from({ length: 8 }, (_, i) => (
              <LunaFase key={i} x={400 + i * 160} y={150} r={46} fase={i / 8} id={`tira-${i}`} brilloHalo={0.2} />
            ))}
            <text x={960} y={250} textAnchor="middle" fontFamily={FUENTE_TITULO} fontWeight={800} fontSize={48} fill={C.luzAmarilla}>
              casi un mes: 29 días y medio
            </text>
          </g>
          {/* luna de queso imaginada */}
          <g opacity={queso}>
            <circle cx={1180} cy={470} r={18} fill="#FFFFFF" stroke={C.contorno} strokeWidth={4} />
            <circle cx={1230} cy={400} r={28} fill="#FFFFFF" stroke={C.contorno} strokeWidth={4} />
            <ellipse cx={1380} cy={250} rx={190} ry={150} fill="#FFFFFF" stroke={C.contorno} strokeWidth={5} />
            <LunaQueso x={1380} y={250} s={1} />
            <path d="M 1270 150 L 1490 350 M 1490 150 L 1270 350" stroke="#E63946" strokeWidth={22} strokeLinecap="round" opacity={tachar} />
          </g>
        </g>

        {/* ---------------- el espacio: 30 Tierras en fila */}
        <g opacity={espacio}>
          <rect x={0} y={0} width={1920} height={1080} fill="#0B0820" />
          <CieloNoche arriba="#05031A" abajo="#120C3A" estrellas={140} />
          <FilaTierras inicio={ini("l048") + 24} duracion={Math.max(40, fin("l048") - ini("l048") - 10)} y={620} />
          <text x={960} y={140} textAnchor="middle" fontFamily={FUENTE_TITULO} fontWeight={800} fontSize={64} fill="#FFFFFF" stroke={C.contorno} strokeWidth={8} paintOrder="stroke">
            ¡Cabrían 30 Tierras!
          </text>
        </g>

        {/* ---------------- en la luna: un astronauta con una piedra */}
        <g opacity={luna}>
          <CieloNoche arriba="#05031A" abajo="#1A1450" estrellas={110} />
          <Tierra x={1560} y={230} r={110} id="tierra-cielo" giro={frame / 600} />
          <SueloLunar y={760} />
          <Astronauta x={760} y={850} s={1.25} />
          <Rotulo texto="¡Es de roca!" x={1300} y={640} desde={ini("l052") + 50} hasta={fin("l052")} fondo="#FFFFFF" tam={70} />
        </g>
        <Iris duracion={escena.duracion} entrada={14} salida={16} />
      </svg>
      <VocesEscena escena={escena} />
      <MusicaEscena pista="noche" escena={escena} volumen={0.15} />
      <Fx efecto="pop" en={ini("l046") + 24} volumen={0.25} />
      <Fx efecto="susurro" en={ini("l048") - 6} volumen={0.35} />
      <Fx efecto="magia" en={ini("l048") + 24} volumen={0.2} />
      <Fx efecto="pop" en={ini("l051") + 20} volumen={0.25} />
      <Fx efecto="susurro" en={ini("l052") + 40} volumen={0.2} />
    </AbsoluteFill>
  );
};
