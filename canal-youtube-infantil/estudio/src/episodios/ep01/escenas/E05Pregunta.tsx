import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { C, FUENTE_TITULO } from "../../../marca";
import { bocaDe, clave, EscenaColocada, paso, pose } from "../../../comun/tiempo";
import { Fx, MusicaEscena, useEscena, VocesEscena } from "../../../comun/Sonido";
import { Iris, Rotulo } from "../../../comun/Rotulos";
import { CieloNoche } from "../../../escenario/Bosque";
import { LunaFase } from "../../../escenario/Luna";
import { Farolin } from "../../../personajes/Farolin";
import { Galleta } from "../../../personajes/Galleta";
import { POSES } from "../../../personajes/cara";

/** Cuenta atrás 3-2-1 para que el niño conteste en voz alta. */
const CuentaAtras: React.FC<{ desde: number; hasta: number; frame: number }> = ({ desde, hasta, frame }) => {
  if (frame < desde || frame >= hasta) return null;
  const largo = hasta - desde;
  const k = (frame - desde) / largo;
  const numero = 3 - Math.floor(k * 3);
  const local = ((frame - desde) % (largo / 3)) / (largo / 3);
  const s = interpolate(local, [0, 0.15, 1], [0.6, 1.1, 1]);
  return (
    <g transform={`translate(960 560)`}>
      <circle r={130} fill="none" stroke="#FFFFFF" strokeWidth={14} opacity={0.25} />
      <circle
        r={130}
        fill="none"
        stroke={C.luzAmarilla}
        strokeWidth={14}
        strokeDasharray={`${2 * Math.PI * 130 * (1 - k)} 9999`}
        transform="rotate(-90)"
        strokeLinecap="round"
      />
      <text y={60} textAnchor="middle" fontFamily={FUENTE_TITULO} fontWeight={800} fontSize={170} fill="#FFFFFF" transform={`scale(${s})`}>
        {numero}
      </text>
    </g>
  );
};

export const E05Pregunta: React.FC<{ escena: EscenaColocada }> = ({ escena }) => {
  const { frame, ini, fin } = useEscena(escena);
  const fase = clave(frame, [
    [fin("l042") + 10, 0.5],
    [ini("l043") + 40, 0.0],
  ]);
  const cuenta1: [number, number] = [fin("l041") + 4, ini("l042") - 2];
  const cuenta2: [number, number] = [fin("l043") + 4, ini("l044") - 2];
  const enCuenta = (frame >= cuenta1[0] && frame < cuenta1[1]) || (frame >= cuenta2[0] && frame < cuenta2[1]);
  const lunaX = enCuenta ? 960 : 960;
  const lunaOpacidad = enCuenta ? 0.35 : 1;

  return (
    <AbsoluteFill>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080">
        <CieloNoche />
        <g opacity={lunaOpacidad}>
          <LunaFase x={lunaX} y={500} r={230} fase={fase} id="luna-e05" brilloHalo={0.9} />
        </g>
        <text x={960} y={140} textAnchor="middle" fontFamily={FUENTE_TITULO} fontWeight={800} fontSize={84} fill="#FFFFFF" stroke={C.contorno} strokeWidth={10} paintOrder="stroke" opacity={frame >= ini("l041") ? 1 : 0}>
          ¡Te toca a ti!
        </text>
        <CuentaAtras desde={cuenta1[0]} hasta={cuenta1[1]} frame={frame} />
        <CuentaAtras desde={cuenta2[0]} hasta={cuenta2[1]} frame={frame} />
        <Galleta
          x={260}
          y={1080}
          escala={0.85}
          expresion={paso(frame, [[0, "feliz" as const], [ini("l042"), "riendo" as const], [fin("l042") + 20, "feliz" as const]])}
          habla={bocaDe(escena, "galleta", frame)}
          brazos={pose(frame, [[0, POSES.reposo], [ini("l042"), POSES.celebrar], [fin("l042") + 20, POSES.reposo]])}
          mirada={{ x: 1, y: -0.6 }}
        />
        <Farolin
          x={1680}
          y={820}
          escala={1.1}
          expresion={paso(frame, [[0, "feliz" as const], [ini("l044"), "riendo" as const]])}
          habla={bocaDe(escena, "farolin", frame)}
          brazos={pose(frame, [[0, POSES.reposo], [ini("l044"), POSES.celebrar]])}
          mirada={{ x: -1, y: -0.5 }}
          voltear
          idPrefijo="f-e05"
        />
        <Rotulo texto="¡Luna llena!" x={960} y={900} desde={ini("l042")} hasta={fin("l042") + 30} fondo={C.luzAmarilla} tam={80} />
        <Rotulo texto="¡Luna nueva!" x={960} y={900} desde={ini("l044")} hasta={escena.duracion} fondo={C.luzTurquesa} tam={80} />
        <Iris duracion={escena.duracion} entrada={14} salida={16} />
      </svg>
      <VocesEscena escena={escena} />
      <MusicaEscena pista="repaso" escena={escena} volumen={0.13} />
      <Fx efecto="acierto" en={fin("l042") + 2} volumen={0.5} />
      <Fx efecto="acierto" en={fin("l044") + 2} volumen={0.5} />
    </AbsoluteFill>
  );
};
