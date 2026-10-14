import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FUENTE_TITULO } from "../../../marca";
import { bocaDe, clave, EscenaColocada, paso, pose, quienHabla, salto } from "../../../comun/tiempo";
import { Fx, MusicaEscena, useEscena, VocesEscena } from "../../../comun/Sonido";
import { Burbuja, Iris } from "../../../comun/Rotulos";
import { MarcadorPistas } from "../../../comun/Juego";
import { HuellaDino, HuellaOsita } from "../../../escenario/Huellas";
import { Lupa } from "../../../escenario/Cosas";
import { Farolin } from "../../../personajes/Farolin";
import { Galleta } from "../../../personajes/Galleta";
import { POSES } from "../../../personajes/cara";
import { COLOR_ROCA, Orilla, usePalabra } from "../mundo";

// Puntas de los tres dedos de la huella dentro de la lupa (escala 1.25, talón en y = 150)
const PUNTAS: [number, number][] = [
  [-112, -66],
  [0, -134],
  [116, -72],
];

// Las pistas: Galleta compara su pata, cuentan los dedos con el niño
// («¡cuéntalos conmigo!») y descubren las garras. Marcador 0/3 → 2/3.
export const E02Pistas: React.FC<{ escena: EscenaColocada }> = ({ escena }) => {
  const { frame, ini, fin } = useEscena(escena);
  const pal = usePalabra(escena);
  const habla = quienHabla(escena, frame);

  // Galleta pisa con su pata al lado de la huella
  const pisa = pal("l007", "comparamos") + 6;
  const sPisa = salto(frame, pisa - 14, 30, 14);
  const pataOsita = clave(frame, [
    [pisa, 0],
    [pisa + 8, 1],
  ]);
  const exprG = paso(frame, [
    [0, "feliz" as const],
    [ini("l007"), "riendo" as const],
    [pisa, "feliz" as const],
    [pal("l008", "chiquitita"), "sorprendido" as const],
    [ini("l009"), "feliz" as const],
    [ini("l010"), "contento" as const],
    [ini("l011"), "riendo" as const],
    [fin("l011") + 4, "feliz" as const],
    [ini("l013"), "riendo" as const],
    [fin("l013") + 4, "feliz" as const],
    [ini("l015"), "riendo" as const],
  ]);
  const conLupa = frame >= pal("l009", "detectives") && frame < ini("l014") + 20;

  // lupa grande: comparar (pata de Galleta) y luego contar dedos y garras
  const lupa = clave(frame, [
    [pisa + 2, 0],
    [pisa + 14, 1],
    [ini("l014") + 10, 1],
    [ini("l014") + 24, 0],
  ]);
  const comparar = clave(frame, [
    [pal("l009", "primera") - 6, 1],
    [pal("l009", "primera") + 8, 0],
  ]);
  const zoomLupa = 1 + 0.25 * (1 - comparar);
  const pulsoChica = frame >= pal("l008", "chiquitita") && frame < pal("l008", "enorme") ? 1 + 0.15 * Math.sin((frame - pal("l008", "chiquitita")) * 0.4) : 1;
  const pulsoGrande = frame >= pal("l008", "enorme") && frame < fin("l008") + 6 ? 1 + 0.06 * Math.sin((frame - pal("l008", "enorme")) * 0.4) : 1;

  // contar los dedos al ritmo de la voz
  const numeros = [pal("l010", "uno"), pal("l010", "dos"), pal("l010", "tres")];
  const dedos = numeros.map((n) => clave(frame, [[n - 2, 0], [n + 6, 1]])) as [number, number, number];
  const garras = clave(frame, [
    [pal("l012", "puntas") - 2, 0],
    [pal("l012", "puntas") + 10, 1],
  ]);

  // marcador de pistas
  const marcador = clave(frame, [
    [pal("l009", "pistas") - 4, 0],
    [pal("l009", "pistas") + 8, 1],
  ]);
  const pista1 = fin("l011") - 8;
  const pista2 = fin("l013") - 6;
  const resaltar = frame >= pal("l009", "primera") && frame < pista1 ? 0 : frame >= ini("l012") && frame < pista2 ? 1 : null;

  // «las lechuzas se despiertan al atardecer»: la cámara se acerca a la otra orilla
  const acerca = clave(frame, [
    [pal("l014", "lechuzas") - 10, 0],
    [pal("l014", "ahora"), 1],
    [fin("l015") + 4, 1],
    [escena.duracion, 1.15],
  ]);
  const ojos = clave(frame, [
    [pal("l014", "ahora") - 4, 0],
    [pal("l014", "ahora") + 6, 1],
  ]);
  const parpadeoLechuza = (frame - pal("l014", "ahora")) % 70 < 4 ? 0.1 : 1;
  const zoom = 1 + 0.18 * Math.min(1, acerca);
  const foco: [number, number] = [1640, 470];

  return (
    <AbsoluteFill>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080">
        <g transform={`translate(${foco[0]} ${foco[1]}) scale(${zoom}) translate(${-foco[0]} ${-foco[1]})`}>
          <Orilla id="e02" camX={300} dedos={dedos} garras={garras} />
          {/* hueco de un árbol en la otra orilla: se abren dos ojos */}
          <g transform="translate(1640 470)">
            <ellipse rx={34} ry={42} fill="#2B1B12" stroke={C.contorno} strokeWidth={4} opacity={0.85} />
            <g transform={`scale(1 ${ojos * parpadeoLechuza})`}>
              <circle cx={-12} cy={-4} r={9} fill="#FFE9A8" />
              <circle cx={12} cy={-4} r={9} fill="#FFE9A8" />
              <circle cx={-12} cy={-4} r={4} fill="#2B1B12" />
              <circle cx={12} cy={-4} r={4} fill="#2B1B12" />
            </g>
          </g>
          <Galleta
            x={330}
            y={1000 + sPisa.dy}
            escala={0.95}
            expresion={exprG}
            habla={bocaDe(escena, "galleta", frame)}
            estiramiento={sPisa.estira}
            brazos={pose(frame, [
              [0, POSES.reposo],
              [ini("l007"), { a: 14, b: 150 }],
              [pal("l007", "pongo"), { a: 14, b: 60 }],
              [pisa + 10, POSES.reposo],
              [pal("l008", "enorme"), POSES.brazosAbiertos],
              [fin("l008") + 6, POSES.reposo],
              [pal("l009", "detectives"), { a: 14, b: 70 }],
              [ini("l011"), { a: 150, b: 70 }],
              [fin("l011"), { a: 14, b: 70 }],
              [ini("l013"), { a: 150, b: 70 }],
              [fin("l013"), { a: 14, b: 70 }],
              [ini("l014") + 20, POSES.reposo],
              [ini("l015"), { a: -150, b: -150 }],
            ])}
            objeto={conLupa ? <Lupa escala={0.9} rot={-30} /> : undefined}
            mirada={frame >= ini("l014") + 30 ? { x: 1, y: -0.6 } : habla === "farolin" ? { x: 1, y: -0.5 } : { x: 1, y: 0.4 }}
          />
          <Farolin
            x={clave(frame, [
              [ini("l009") - 10, 1150],
              [ini("l009") + 20, 1060],
            ])}
            y={520}
            escala={0.95}
            expresion={paso(frame, [
              [0, "feliz" as const],
              [ini("l010"), "contento" as const],
              [fin("l010") + 4, "riendo" as const],
              [ini("l012"), "pensando" as const],
              [pal("l012", "garras"), "sorprendido" as const],
              [ini("l014"), "pensando" as const],
              [pal("l014", "ahora"), "riendo" as const],
            ])}
            habla={bocaDe(escena, "farolin", frame)}
            luz={paso(frame, [
              [0, "amarilla" as const],
              [ini("l014"), "turquesa" as const],
              [fin("l014"), "amarilla" as const],
            ])}
            brazos={pose(frame, [
              [0, POSES.reposo],
              [ini("l009"), POSES.explicar],
              [ini("l010"), { a: 14, b: 120 }],
              [fin("l010"), POSES.reposo],
              [ini("l012"), POSES.señalarIzq],
              [fin("l012"), POSES.reposo],
              [pal("l014", "lechuzas"), POSES.señalar],
              [fin("l014") + 10, POSES.reposo],
            ])}
            mirada={frame >= pal("l014", "lechuzas") ? { x: 1, y: -0.4 } : habla === "galleta" ? { x: -1, y: 0.4 } : { x: -0.6, y: 0.8 }}
            idPrefijo="f-e02"
          />
        </g>
        {/* la lupa: la huella vista desde arriba */}
        <Burbuja x={960} y={340} r={250} visible={lupa}>
          <rect x={-260} y={-260} width={520} height={520} fill={COLOR_ROCA} />
          <g transform={`scale(${zoomLupa}) translate(${-60 * comparar} ${40 * (1 - comparar)})`}>
            <g transform={`translate(0 30) scale(${pulsoGrande}) translate(0 -30)`}>
              <HuellaDino x={0} y={150} escala={1.25} fondo={COLOR_ROCA} dedos={dedos} garras={garras} id="e02-lupa" />
            </g>
            <g opacity={comparar}>
              <g transform={`translate(205 120) scale(${pataOsita * pulsoChica})`}>
                <HuellaOsita x={0} y={40} escala={0.75} fondo={COLOR_ROCA} />
              </g>
            </g>
            {/* números al contar */}
            {PUNTAS.map(([px, py], i) => {
              const v = dedos[i];
              if (v <= 0.01) return null;
              return (
                <g key={i} transform={`translate(${px} ${py - 46}) scale(${0.6 + 0.4 * v})`} opacity={v}>
                  <circle r={34} fill={C.luzAmarilla} stroke={C.contorno} strokeWidth={5} />
                  <text y={17} textAnchor="middle" fontFamily={FUENTE_TITULO} fontWeight={800} fontSize={50} fill={C.texto}>
                    {i + 1}
                  </text>
                </g>
              );
            })}
          </g>
        </Burbuja>
        <MarcadorPistas pistas={[pista1, pista2, null]} visible={marcador * clave(frame, [[fin("l014"), 1], [fin("l014") + 12, 0]])} resaltar={resaltar} />
        <Iris duracion={escena.duracion} entrada={14} salida={16} centro={[1640, 470]} />
      </svg>
      <VocesEscena escena={escena} />
      <MusicaEscena pista="misterio" escena={escena} volumen={0.13} ambiente="rio" />
      <Fx efecto="plof" en={pisa - 2} volumen={0.35} />
      <Fx efecto="acierto" en={fin("l011") + 2} volumen={0.5} />
      <Fx efecto="acierto" en={fin("l013") + 2} volumen={0.5} />
    </AbsoluteFill>
  );
};
