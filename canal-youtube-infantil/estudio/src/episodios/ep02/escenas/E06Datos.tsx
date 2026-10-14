import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FUENTE_TITULO } from "../../../marca";
import { bocaDe, clave, EscenaColocada, paso, pose, quienHabla } from "../../../comun/tiempo";
import { MusicaEscena, useEscena, VocesEscena } from "../../../comun/Sonido";
import { Iris } from "../../../comun/Rotulos";
import { LuzHistorias } from "../../../comun/Juego";
import { HuellaDino } from "../../../escenario/Huellas";
import { Ambar, Hueso, Lupa, Nota } from "../../../escenario/Cosas";
import { Braquiosaurio, Tiranosaurio } from "../../../escenario/Dinos";
import { MapaEspana } from "../../../escenario/Mapa";
import { Farolin } from "../../../personajes/Farolin";
import { Galleta } from "../../../personajes/Galleta";
import { Lechuza } from "../../../personajes/Lechuza";
import { POSES } from "../../../personajes/cara";
import { Orilla, TOCON, usePalabra } from "../mundo";

const CAMX = 300;
const CX = 760;
const CY = 330;
const R = 290;

/** Una persona sencilla (para la línea del tiempo). */
const Persona: React.FC<{ x: number; y: number; escala?: number }> = ({ x, y, escala = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${escala})`}>
    <path d="M -26 0 L -16 -70 L 16 -70 L 26 0 Z" fill={C.luzTurquesa} stroke={C.contorno} strokeWidth={5} strokeLinejoin="round" />
    <circle cx={0} cy={-96} r={28} fill="#F2C29B" stroke={C.contorno} strokeWidth={5} />
    <path d="M -28 -104 Q -20 -132 0 -128 Q 24 -132 28 -104 Q 10 -116 -28 -104 Z" fill="#5A3E2B" />
    <circle cx={-9} cy={-96} r={4} fill={C.contorno} />
    <circle cx={9} cy={-96} r={4} fill={C.contorno} />
    <path d="M -8 -84 Q 0 -78 8 -84" stroke={C.contorno} strokeWidth={3} fill="none" strokeLinecap="round" />
  </g>
);

/** Luciérnaga pequeñita (vecina de los dinosaurios). */
const Lucecita: React.FC<{ x: number; y: number; frame: number; fase: number; escala?: number }> = ({ x, y, frame, fase, escala = 1 }) => {
  const b = 0.5 + 0.5 * Math.sin(frame * 0.12 + fase);
  const dx = Math.sin(frame * 0.03 + fase) * 30;
  const dy = Math.cos(frame * 0.025 + fase) * 20;
  return (
    <g transform={`translate(${x + dx} ${y + dy}) scale(${escala})`}>
      <circle r={22} fill="#FFE97A" opacity={0.35 * b} />
      <circle r={7} fill="#FFF7C2" opacity={0.6 + 0.4 * b} />
    </g>
  );
};

// Datos curiosos: nadie ha visto un tiranosaurio (ni sabe cómo sonaba), en La
// Rioja hay miles de huellas y las luciérnagas ya brillaban entonces.
export const E06Datos: React.FC<{ escena: EscenaColocada }> = ({ escena }) => {
  const { frame, ini, fin } = useEscena(escena);
  const pal = usePalabra(escena);
  const habla = quienHabla(escena, frame);
  const oscurece = clave(frame, [
    [0, 0.3],
    [escena.duracion, 0.6],
  ]);

  // qué enseña la luz en cada momento
  const tramo = (a: number, b: number) => clave(frame, [[a - 6, 0], [a + 6, 1], [b - 6, 1], [b + 6, 0]]);
  const tLinea = tramo(pal("l043", "vivieron") - 4, ini("l044"));
  const tRugido = tramo(ini("l044"), ini("l046"));
  const tMapa = tramo(pal("l046", "espana") - 4, ini("l048"));
  const tLuces = tramo(ini("l048"), pal("l048", "encontro") - 2);
  const tAmbar = tramo(pal("l048", "encontro") - 2, ini("l049"));
  const tVecinos = tramo(ini("l049"), escena.duracion + 20);
  const luz = clave(frame, [
    [pal("l043", "vivieron") - 14, 0],
    [pal("l043", "vivieron"), 1],
  ]);

  const largoLinea = clave(frame, [
    [pal("l043", "millones") - 4, 0],
    [pal("l043", "personas"), 1],
  ]);
  const persona = clave(frame, [
    [pal("l043", "personas") - 2, 0],
    [pal("l043", "personas") + 8, 1],
  ]);
  const hueso = clave(frame, [
    [pal("l043", "huesos") - 2, 0],
    [pal("l043", "huesos") + 8, 1],
  ]);
  const huella = clave(frame, [
    [pal("l043", "huellas") - 2, 0],
    [pal("l043", "huellas") + 8, 1],
  ]);
  const tararea = clave(frame, [
    [pal("l045", "mejor") - 4, 0],
    [pal("l045", "mejor") + 8, 1],
  ]);
  const lupa = clave(frame, [
    [pal("l045", "cientificos") - 4, 0],
    [pal("l045", "cientificos") + 8, 1],
  ]);
  const rioja = clave(frame, [
    [pal("l047", "rioja") - 4, 0],
    [pal("l047", "rioja") + 8, 1],
  ]);
  const huellasMapa = clave(frame, [
    [pal("l047", "miles") - 2, 0],
    [pal("l047", "miles") + 30, 1],
  ]);
  const farolillo = frame >= pal("l048", "farolillo") - 4 ? 1.6 : 1;
  const corazon = clave(frame, [
    [pal("l049", "vecinos") - 4, 0],
    [pal("l049", "vecinos") + 8, 1],
  ]);

  return (
    <AbsoluteFill>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080">
        <Orilla id="e06" camX={CAMX} oscurece={oscurece} />
        <Lechuza
          x={TOCON.x - CAMX}
          y={TOCON.arriba}
          escala={0.85}
          voltear
          expresion={paso(frame, [
            [0, "feliz" as const],
            [ini("l045"), "riendo" as const],
            [pal("l045", "mejor"), "pensando" as const],
            [ini("l046"), "feliz" as const],
          ])}
          habla={bocaDe(escena, "lechuza", frame)}
          alaB={habla === "lechuza" ? 30 + 20 * Math.sin(frame * 0.18) : 0}
          mirada={habla === "galleta" ? { x: 1, y: 0.4 } : habla === "farolin" ? { x: 0.6, y: -0.3 } : { x: 0.9, y: -0.3 }}
        />
        <Galleta
          x={330}
          y={1000}
          escala={0.95}
          expresion={paso(frame, [
            [0, "pensando" as const],
            [ini("l043"), "feliz" as const],
            [ini("l044"), "pensando" as const],
            [ini("l045"), "sorprendido" as const],
            [ini("l047"), "riendo" as const],
            [ini("l048"), "feliz" as const],
            [pal("l048", "farolillo"), "sorprendido" as const],
            [ini("l049"), "riendo" as const],
          ])}
          habla={bocaDe(escena, "galleta", frame)}
          brazos={pose(frame, [
            [0, POSES.pensar],
            [fin("l042"), POSES.reposo],
            [ini("l044"), POSES.pensar],
            [fin("l044"), POSES.reposo],
            [pal("l047", "ver"), POSES.celebrar],
            [fin("l047") + 10, POSES.reposo],
            [ini("l049"), POSES.brazosAbiertos],
          ])}
          mirada={luz > 0.3 && habla !== "galleta" ? { x: 1, y: -1 } : { x: 1, y: -0.4 }}
        />
        <Farolin
          x={1150}
          y={470}
          escala={0.95}
          voltear={luz > 0.05}
          brillo={(1 + 0.5 * luz) * farolillo}
          luz={paso(frame, [
            [0, "amarilla" as const],
            [pal("l048", "farolillo"), "rosa" as const],
            [fin("l049"), "amarilla" as const],
          ])}
          expresion={paso(frame, [
            [0, "feliz" as const],
            [ini("l046"), "pensando" as const],
            [ini("l047"), "sorprendido" as const],
            [ini("l048"), "riendo" as const],
            [pal("l048", "luciernagas"), "feliz" as const],
            [pal("l048", "farolillo"), "riendo" as const],
          ])}
          habla={bocaDe(escena, "farolin", frame)}
          brazos={pose(frame, [
            [0, POSES.reposo],
            [ini("l048"), POSES.explicar],
            [pal("l048", "farolillo"), POSES.celebrar],
            [fin("l048"), POSES.reposo],
          ])}
          mirada={luz > 0.05 ? { x: 0.8, y: -0.4 } : { x: 1, y: 0.3 }}
          idPrefijo="f-e06"
        />
        <LuzHistorias x={CX} y={CY} r={R} visible={luz} desde={[1150 - 30, 470 + 51]} id="e06-luz" fondo="#FFF3D6">
          {/* la línea del tiempo: dinosaurios… millones de años… personas */}
          <g opacity={tLinea}>
            <rect x={CX - R} y={CY + 90} width={2 * R} height={R} fill="#E5CFA4" />
            <Tiranosaurio x={CX - 170} y={CY + 100} escala={0.3} />
            <path d={`M ${CX - 90} ${CY + 60} L ${CX - 90 + 300 * largoLinea} ${CY + 60}`} stroke={C.contorno} strokeWidth={8} strokeLinecap="round" strokeDasharray="2 22" />
            <Persona x={CX + 230} y={CY + 100} escala={persona} />
            <g opacity={hueso}>
              <Hueso x={CX - 120} y={CY - 140} escala={0.7 * hueso} rot={-15} />
            </g>
            <g opacity={huella}>
              <HuellaDino x={CX + 140} y={CY - 70} escala={0.55 * huella} modo="icono" color="#8B5A2B" id="e06-huella" />
            </g>
          </g>
          {/* ¿cómo sonaba? Nadie lo sabe */}
          <g opacity={tRugido}>
            <rect x={CX - R} y={CY + 120} width={2 * R} height={R} fill="#9BD27A" />
            <Tiranosaurio x={CX - 40} y={CY + 170} escala={0.55} boca={tararea > 0.5 ? 0 : 0.6} tarareo={tararea} expresion={tararea > 0.5 ? "contento" : "feliz"} />
            <g transform={`translate(${CX + 150} ${CY - 170})`} opacity={1 - tararea}>
              <circle r={62} fill="#FFFFFF" stroke={C.contorno} strokeWidth={6} />
              <text y={30} textAnchor="middle" fontFamily={FUENTE_TITULO} fontWeight={800} fontSize={90} fill={C.luzRosa}>
                ?
              </text>
            </g>
            {tararea > 0.01
              ? [0, 1, 2].map((k) => {
                  const t = ((frame + k * 20) % 60) / 60;
                  return <Nota key={k} x={CX + 170 + t * 70 + k * 10} y={CY - 70 - t * 120} escala={0.8 + t * 0.4} opacidad={tararea * (1 - t)} />;
                })
              : null}
            <g opacity={lupa} transform={`translate(${CX - 150 + Math.sin(frame * 0.06) * 60} ${CY - 120}) rotate(-30)`}>
              <Lupa escala={1.4} />
            </g>
          </g>
          {/* España: miles de huellas en La Rioja */}
          <g opacity={tMapa}>
            <rect x={CX - R} y={CY - R} width={2 * R} height={2 * R} fill="#BDE7FF" />
            <MapaEspana x={CX - 210} y={CY - 175} ancho={440} rioja={rioja} huellas={huellasMapa} />
          </g>
          {/* las luciérnagas ya brillaban en tiempos de los dinosaurios */}
          <g opacity={tLuces}>
            <rect x={CX - R} y={CY - R} width={2 * R} height={2 * R} fill="#2A2170" />
            <rect x={CX - R} y={CY + 140} width={2 * R} height={R} fill="#24506A" />
            <Braquiosaurio x={CX - 60} y={CY + 230} escala={0.42} expresion="contento" />
            {Array.from({ length: 9 }, (_, i) => (
              <Lucecita key={i} x={CX - 220 + (i % 5) * 110} y={CY - 140 + Math.floor(i / 5) * 180 + (i % 2) * 40} frame={frame} fase={i * 1.7} />
            ))}
          </g>
          <g opacity={tAmbar}>
            <rect x={CX - R} y={CY - R} width={2 * R} height={2 * R} fill="#FFF3D6" />
            <Ambar x={CX} y={CY + 40} escala={1.5} brillo={farolillo > 1 ? 1.4 : 0.8} id="e06-ambar" />
          </g>
          {/* vecinos */}
          <g opacity={tVecinos}>
            <rect x={CX - R} y={CY - R} width={2 * R} height={2 * R} fill="#2A2170" />
            <rect x={CX - R} y={CY + 150} width={2 * R} height={R} fill="#24506A" />
            <Tiranosaurio x={CX - 70} y={CY + 170} escala={0.5} expresion={corazon > 0.5 ? "riendo" : "feliz"} mirada={{ x: 1, y: -0.3 }} />
            <Lucecita x={CX + 190} y={CY - 90} frame={frame} fase={0} escala={2} />
            <g transform={`translate(${CX + 150} ${CY - 200}) scale(${corazon})`}>
              <path d="M 0 30 C -50 -10 -40 -60 0 -36 C 40 -60 50 -10 0 30 Z" fill={C.luzRosa} stroke={C.contorno} strokeWidth={5} />
            </g>
          </g>
        </LuzHistorias>
        <Iris duracion={escena.duracion} entrada={14} salida={16} />
      </svg>
      <VocesEscena escena={escena} />
      <MusicaEscena pista="noche" escena={escena} volumen={0.15} ambiente="rio" />
    </AbsoluteFill>
  );
};
