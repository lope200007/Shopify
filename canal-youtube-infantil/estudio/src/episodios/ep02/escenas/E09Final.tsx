import React from "react";
import { AbsoluteFill, interpolate, spring, useVideoConfig } from "remotion";
import { C, FUENTE_TEXTO, FUENTE_TITULO } from "../../../marca";
import { bocaDe, clave, EscenaColocada, paso, pose, quienHabla } from "../../../comun/tiempo";
import { Fx, MusicaEscena, useEscena, VocesEscena } from "../../../comun/Sonido";
import { Iris, Logo, Rotulo } from "../../../comun/Rotulos";
import { HuellaDino } from "../../../escenario/Huellas";
import { Insignia } from "../../../escenario/Cosas";
import { Gallina, Paloma } from "../../../escenario/Dinos";
import { Farolin } from "../../../personajes/Farolin";
import { Galleta } from "../../../personajes/Galleta";
import { Lechuza } from "../../../personajes/Lechuza";
import { POSES } from "../../../personajes/cara";
import { Orilla, TOCON, usePalabra } from "../mundo";

const CAMX = 300;

/** Confeti suave (sin destellos): papelitos que caen despacio. */
const Confeti: React.FC<{ desde: number; frame: number }> = ({ desde, frame }) => {
  const t = frame - desde;
  if (t < 0 || t > 120) return null;
  return (
    <g opacity={interpolate(t, [90, 120], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>
      {Array.from({ length: 36 }, (_, i) => {
        const x = (i * 157) % 1920;
        const y = -40 + t * (4 + (i % 5)) + ((i * 37) % 200);
        const color = [C.luzAmarilla, C.luzTurquesa, C.luzRosa, C.luzAzul][i % 4];
        return <rect key={i} x={x + Math.sin((t + i * 7) * 0.1) * 20} y={y} width={18} height={10} rx={3} fill={color} transform={`rotate(${(t * 6 + i * 40) % 360} ${x} ${y})`} />;
      })}
    </g>
  );
};

// Final: «ya sabes leer huellas» (recompensa de identidad), un reto para hacer
// con un mayor y la pregunta de las estrellas, que se contará «muy pronto».
export const E09Final: React.FC<{ escena: EscenaColocada }> = ({ escena }) => {
  const { frame, ini, fin } = useEscena(escena);
  const { fps } = useVideoConfig();
  const pal = usePalabra(escena);
  const habla = quienHabla(escena, frame);

  const oscurece = clave(frame, [
    [0, 0.8],
    [pal("l063", "estrellas"), 0.85],
    [pal("l063", "estrellas") + 30, 1],
  ]);
  const insignia = spring({ frame: frame - (pal("l060", "sabes") - 4), fps, config: { damping: 10, stiffness: 120 } });
  const quitaInsignia = clave(frame, [
    [fin("l060") + 6, 1],
    [fin("l060") + 18, 0],
  ]);
  const reto = clave(frame, [
    [ini("l061") - 6, 0],
    [ini("l061") + 8, 1],
    [fin("l062") + 10, 1],
    [fin("l062") + 22, 0],
  ]);
  const paloma = clave(frame, [
    [pal("l061", "paloma") - 4, 0],
    [pal("l061", "paloma") + 8, 1],
  ]);
  const gallina = clave(frame, [
    [pal("l061", "gallina") - 4, 0],
    [pal("l061", "gallina") + 8, 1],
  ]);
  const patas = clave(frame, [
    [pal("l061", "patas") - 4, 0],
    [pal("l061", "patas") + 8, 1],
  ]);
  const pregunta = clave(frame, [
    [pal("l061", "cuantos") - 4, 0],
    [pal("l061", "cuantos") + 8, 1],
  ]);
  const pista = clave(frame, [
    [pal("l062", "dinosaurio") - 6, 0],
    [pal("l062", "dinosaurio") + 6, 1],
  ]);
  const estrellas = clave(frame, [
    [pal("l063", "caen") - 4, 0],
    [pal("l063", "caen") + 10, 1],
  ]);
  const final = interpolate(frame, [ini("l065") - 10, ini("l065") + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const miranCielo = frame >= ini("l063") && frame < ini("l065");

  return (
    <AbsoluteFill>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080">
        <Orilla id="e09" camX={CAMX} oscurece={oscurece} />
        {/* la pregunta de las estrellas */}
        <g opacity={estrellas}>
          {[
            [420, 140],
            [760, 90],
            [1180, 160],
            [1520, 110],
          ].map(([x, y], i) => {
            const b = 0.6 + 0.4 * Math.sin(frame * 0.08 + i);
            return (
              <g key={i} transform={`translate(${x} ${y}) scale(${2.2 * b})`}>
                <path d="M 0 -9 L 2 -2 L 9 0 L 2 2 L 0 9 L -2 2 L -9 0 L -2 -2 Z" fill="#FFF6C9" />
              </g>
            );
          })}
          <g transform="translate(960 230)">
            <circle r={64} fill="#FFFFFF" stroke={C.contorno} strokeWidth={6} />
            <text y={30} textAnchor="middle" fontFamily={FUENTE_TITULO} fontWeight={800} fontSize={90} fill={C.luzAzul}>
              ?
            </text>
          </g>
        </g>
        <Lechuza
          x={TOCON.x - CAMX}
          y={TOCON.arriba}
          escala={0.85}
          voltear
          expresion={paso(frame, [
            [0, "riendo" as const],
            [ini("l061"), "feliz" as const],
            [ini("l063"), "pensando" as const],
            [ini("l064"), "contento" as const],
          ])}
          habla={bocaDe(escena, "lechuza", frame)}
          alaA={frame >= pal("l060", "sabes") && frame < fin("l060") ? 80 : 0}
          alaB={frame >= pal("l060", "sabes") && frame < fin("l060") ? 80 : miranCielo ? 60 : 0}
          inclinacion={miranCielo ? -8 : 0}
          mirada={miranCielo ? { x: 0.6, y: -1 } : habla === "galleta" ? { x: 1, y: 0.4 } : { x: 0.8, y: 0 }}
        />
        <Galleta
          x={330}
          y={1000}
          escala={0.95}
          expresion={paso(frame, [
            [0, "riendo" as const],
            [ini("l061"), "feliz" as const],
            [ini("l062"), "riendo" as const],
            [ini("l063"), "sorprendido" as const],
            [ini("l064"), "pensando" as const],
            [ini("l065"), "riendo" as const],
          ])}
          habla={bocaDe(escena, "galleta", frame)}
          brazos={pose(frame, [
            [0, POSES.celebrar],
            [fin("l060") + 6, POSES.reposo],
            [ini("l062"), { a: 14, b: 150 }],
            [fin("l062") + 6, POSES.reposo],
            [ini("l064"), POSES.pensar],
            [ini("l065"), POSES.celebrar],
          ])}
          mirada={miranCielo ? { x: 0.6, y: -1 } : { x: 1, y: -0.4 }}
        />
        <Farolin
          x={1060}
          y={520}
          escala={0.95}
          expresion={paso(frame, [
            [0, "riendo" as const],
            [ini("l061"), "feliz" as const],
            [ini("l063"), "pensando" as const],
            [ini("l064"), "riendo" as const],
          ])}
          habla={bocaDe(escena, "farolin", frame)}
          luz={paso(frame, [
            [0, "rosa" as const],
            [ini("l061"), "amarilla" as const],
            [fin("l063"), "turquesa" as const],
            [ini("l065"), "rosa" as const],
          ])}
          brazos={pose(frame, [
            [0, POSES.celebrar],
            [fin("l060") + 6, POSES.reposo],
            [ini("l061"), POSES.explicar],
            [fin("l061"), POSES.reposo],
            [ini("l064"), POSES.señalar],
            [ini("l065"), POSES.celebrar],
          ])}
          mirada={miranCielo ? { x: 0.3, y: -1 } : { x: -0.8, y: 0.3 }}
          idPrefijo="f-e09"
        />
        {/* ¡ya sabes leer huellas! */}
        <g opacity={quitaInsignia}>
          {/* a la izquierda de Farolín: en el centro le tapaba */}
          <Insignia x={700} y={330} escala={0.95 * insignia} texto="¡Ya lees huellas!" rot={(1 - insignia) * -20} />
        </g>
        <Confeti desde={pal("l060", "sabes")} frame={frame} />
        {/* el reto: mírale las patas a una paloma o a una gallina */}
        {reto > 0.01 ? (
          <g opacity={reto} transform={`translate(960 340) scale(${0.9 + 0.1 * reto}) translate(-960 -340)`}>
            <rect x={540} y={110} width={840} height={470} rx={44} fill="#FFFFFF" stroke={C.contorno} strokeWidth={7} />
            <rect x={570} y={430} width={780} height={20} rx={10} fill="#E5CFA4" />
            <g opacity={paloma}>
              <Paloma x={760} y={440} escala={1.5} />
            </g>
            <g opacity={gallina}>
              <Gallina x={1110} y={440} escala={1.3} />
            </g>
            {patas > 0.01
              ? [760, 1110].map((x) => <ellipse key={x} cx={x} cy={430} rx={110} ry={44} fill="none" stroke={C.luzRosa} strokeWidth={9} strokeDasharray="20 14" opacity={patas} />)
              : null}
            <g opacity={pregunta} transform="translate(960 200)">
              <circle r={52} fill={C.luzAmarilla} stroke={C.contorno} strokeWidth={6} />
              <text y={24} textAnchor="middle" fontFamily={FUENTE_TITULO} fontWeight={800} fontSize={74} fill={C.texto}>
                ?
              </text>
            </g>
            <g opacity={pista} transform="translate(960 520)">
              {/* icono y texto separados: antes la huella pisaba la «c» */}
              <rect x={-225} y={-44} width={450} height={80} rx={40} fill="#FFF3D6" stroke={C.contorno} strokeWidth={5} />
              <HuellaDino x={-172} y={26} escala={0.28} modo="icono" color="#8B5A2B" id="e09-pista" />
              <text x={-128} y={14} textAnchor="start" fontFamily={FUENTE_TEXTO} fontWeight={700} fontSize={36} fill={C.texto}>
                como el dinosaurio
              </text>
            </g>
          </g>
        ) : null}
        <Rotulo texto="¡Reto!" x={360} y={200} desde={ini("l061") - 8} hasta={fin("l061") + 10} fondo={C.luzRosa} tam={84} />
        <Rotulo texto="Muy pronto" x={1400} y={420} desde={pal("l064", "pronto") - 6} hasta={ini("l065") - 6} fondo={C.luzTurquesa} tam={64} />
        {/* cierre */}
        <g opacity={final}>
          <rect x={0} y={0} width={1920} height={1080} fill="#140F3D" opacity={0.6} />
          <Logo x={960} y={430} escala={1.1} />
          <text x={960} y={700} textAnchor="middle" fontFamily={FUENTE_TITULO} fontWeight={800} fontSize={72} fill={C.luzAmarilla} stroke={C.contorno} strokeWidth={10} paintOrder="stroke">
            ¡Aprender es una aventura!
          </text>
          <text x={960} y={800} textAnchor="middle" fontFamily={FUENTE_TEXTO} fontWeight={600} fontSize={42} fill="#FFFFFF">
            Muy pronto: ¿por qué no se caen las estrellas?
          </text>
        </g>
        <Iris duracion={escena.duracion} entrada={14} salida={24} />
      </svg>
      <VocesEscena escena={escena} />
      <MusicaEscena pista="noche" escena={escena} volumen={0.14} hasta={ini("l065") - 8} ambiente="grillos" />
      <MusicaEscena pista="tema" escena={escena} volumen={0.35} desde={ini("l065") - 10} />
      <Fx efecto="acierto" en={fin("l060") + 2} volumen={0.45} />
      <Fx efecto="idea" en={fin("l063") + 2} volumen={0.35} />
    </AbsoluteFill>
  );
};
