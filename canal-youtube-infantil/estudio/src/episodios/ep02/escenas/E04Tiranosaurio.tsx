import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FUENTE_TEXTO, FUENTE_TITULO } from "../../../marca";
import { bocaDe, clave, EscenaColocada, paso, pose, quienHabla, salto } from "../../../comun/tiempo";
import { Fx, MusicaEscena, useEscena, VocesEscena } from "../../../comun/Sonido";
import { Iris, Rotulo } from "../../../comun/Rotulos";
import { CuentaAtras, LuzHistorias, MarcadorPistas } from "../../../comun/Juego";
import { HuellaDino } from "../../../escenario/Huellas";
import { Autobus, DienteAfilado, Etiqueta, Onomatopeya, Platano } from "../../../escenario/Cosas";
import { Braquiosaurio, Tiranosaurio } from "../../../escenario/Dinos";
import { Farolin } from "../../../personajes/Farolin";
import { Galleta } from "../../../personajes/Galleta";
import { Lechuza } from "../../../personajes/Lechuza";
import { POSES } from "../../../personajes/cara";
import { Orilla, TOCON, usePalabra } from "../mundo";

const CAMX = 300;

/** Fundido de un panel: aparece en `a` y se va en `b`. */
const panel = (frame: number, a: number, b: number, f = 8) =>
  Math.max(0, Math.min(1, Math.min((frame - a) / f + 1, (b - frame) / f + 1)));

/** El rastro visto desde arriba: huellas una detrás de otra y ninguna de manos. */
const Rastro: React.FC<{ frame: number; linea: number; manos: number; tacha: number; opciones: number; elegida: number; soloOpciones?: boolean }> = ({
  frame,
  linea,
  manos,
  tacha,
  opciones,
  elegida,
  soloOpciones = false,
}) => {
  const huellas = Array.from({ length: 6 }, (_, i) => ({ x: 360 + i * 270, y: 640 + (i % 2 ? -70 : 70), rot: 90 }));
  if (soloOpciones) return <Opciones opciones={opciones} elegida={elegida} />;
  return (
    <g>
      <rect x={0} y={0} width={2400} height={1080} fill="#E5CFA4" />
      {Array.from({ length: 75 }, (_, i) => (
        <circle key={i} cx={(i * 211) % 2400} cy={(i * 137) % 1080} r={3 + (i % 3) * 2} fill="#C9A86E" opacity={0.5} />
      ))}
      <path d="M 0 250 Q 500 230 960 270 Q 1500 300 1920 250 Q 2200 230 2400 250 L 2400 0 L 0 0 Z" fill="#4FB3E8" />
      {[0, 1, 2, 3, 4].map((i) => (
        <path key={i} d={`M ${200 + i * 380 + ((frame * 1.2) % 380)} ${150 + (i % 2) * 40} q 30 -10 60 0`} stroke="#FFFFFF" strokeWidth={6} fill="none" strokeLinecap="round" opacity={0.6} />
      ))}
      <path d="M 0 250 Q 500 230 960 270 Q 1500 300 1920 250 Q 2200 230 2400 250" stroke={C.contorno} strokeWidth={6} fill="none" />
      {/* línea del camino: una detrás de otra */}
      <path
        d={`M ${huellas.map((h) => `${h.x + 95} ${h.y + 100}`).join(" L ")}`}
        stroke={C.luzRosa}
        strokeWidth={10}
        fill="none"
        strokeDasharray="22 18"
        strokeLinecap="round"
        pathLength={100}
        strokeDashoffset={0}
        opacity={linea}
      />
      {huellas.map((h, i) => (
        <HuellaDino key={i} x={h.x} y={h.y + 100} escala={0.9} rot={h.rot} fondo="#E5CFA4" id={`e04-rastro${i}`} />
      ))}
      {/* ¿huellas de manos? No hay ninguna */}
      {manos > 0.01
        ? huellas.slice(0, 5).map((h, i) => {
            const mx = h.x + 135;
            const my = h.y + (i % 2 ? 40 : -40);
            return (
              <g key={i} opacity={manos} transform={`translate(${mx} ${my})`}>
                <circle r={46} fill="#FFFFFF" opacity={0.6} stroke={C.contorno} strokeWidth={4} strokeDasharray="10 8" />
                <text y={22} textAnchor="middle" fontFamily={FUENTE_TITULO} fontWeight={800} fontSize={64} fill="#8E7DBE">
                  ?
                </text>
                {tacha > 0.01 ? (
                  <g opacity={tacha}>
                    <path d="M -34 -34 L 34 34 M 34 -34 L -34 34" stroke="#E63946" strokeWidth={12} strokeLinecap="round" />
                  </g>
                ) : null}
              </g>
            );
          })
        : null}
    </g>
  );
};

/** ¿Sobre cuántas patas andaba? Dos carteles: uno de dos patas y otro de cuatro. */
const Opciones: React.FC<{ opciones: number; elegida: number }> = ({ opciones, elegida }) => {
  if (opciones <= 0.01) return null;
  return (
    <g opacity={opciones}>
      {[0, 1].map((i) => {
        const bien = i === 0 && elegida > 0;
        const x = i === 0 ? 690 : 1230;
        return (
          <g key={i} transform={`translate(${x} 930) scale(${bien ? 1 + 0.1 * elegida : 1})`}>
            <rect x={-200} y={-150} width={400} height={200} rx={40} fill={bien ? C.luzTurquesa : "#FFFFFF"} stroke={C.contorno} strokeWidth={6} />
            {i === 0 ? (
              <Tiranosaurio x={-70} y={30} escala={0.22} silueta="#5A4A3C" />
            ) : (
              <Braquiosaurio x={-60} y={30} escala={0.19} silueta="#5A4A3C" />
            )}
            <text x={130} y={22} textAnchor="middle" fontFamily={FUENTE_TITULO} fontWeight={800} fontSize={110} fill={C.texto}>
              {i === 0 ? 2 : 4}
            </text>
          </g>
        );
      })}
    </g>
  );
};

// La tercera pista (el rastro: anda sobre dos patas) y el resultado: un
// dinosaurio carnívoro del grupo del tiranosaurio. Tan largo como un autobús,
// dientes como plátanos… y rugimos todos juntos.
export const E04Tiranosaurio: React.FC<{ escena: EscenaColocada }> = ({ escena }) => {
  const { frame, ini, fin } = useEscena(escena);
  const pal = usePalabra(escena);
  const habla = quienHabla(escena, frame);

  // tramos
  const tRastro = panel(frame, pal("l027", "mirad") - 4, pal("l028", "como") - 2);
  // Galleta contesta «¡sobre dos patas!» y se ilumina el cartel bueno
  const elegida = clave(frame, [
    [pal("l028", "dos") - 2, 0],
    [pal("l028", "dos") + 6, 1],
  ]);
  const tBus = panel(frame, ini("l031") - 6, ini("l033") - 4);
  const tDientes = panel(frame, ini("l033") - 4, fin("l034") + 6);
  const enOrilla = 1 - Math.max(tRastro, tBus, tDientes);

  // pistas
  const pista3 = fin("l028") - 6;
  const resaltar =
    frame < pista3
      ? 2
      : frame >= ini("l029") && frame < pal("l029", "garras")
        ? 0
        : frame >= pal("l029", "garras") && frame < pal("l029", "dos")
          ? 1
          : frame >= pal("l029", "dos") && frame < pal("l029", "era")
            ? 2
            : null;
  const marcador = clave(frame, [
    [fin("l029"), 1],
    [fin("l029") + 12, 0],
  ]);

  // rastro
  const linea = clave(frame, [
    [pal("l027", "una") - 4, 0],
    [pal("l027", "otra") + 4, 1],
  ]);
  const manos = clave(frame, [
    [pal("l027", "no") - 4, 0],
    [pal("l027", "no") + 6, 1],
  ]);
  const tacha = clave(frame, [
    [pal("l027", "manos") - 2, 0],
    [pal("l027", "manos") + 8, 1],
  ]);
  const opciones = clave(frame, [
    [pal("l027", "sobre") - 4, 0],
    [pal("l027", "sobre") + 8, 1],
  ]);
  const cuenta: [number, number] = [fin("l027") + 4, ini("l028") - 2];
  const camRastro = clave(frame, [
    [pal("l027", "mirad"), 0],
    [pal("l027", "manos"), 180],
  ]);

  // proyección del tiranosaurio
  const luz = clave(frame, [
    [pal("l029", "era") - 4, 0],
    [pal("l029", "era") + 18, 1],
    [fin("l030") + 2, 1],
    [ini("l031") - 6, 0],
  ]);
  const silueta = clave(frame, [
    [pal("l029", "tiranosaurio") - 4, 1],
    [pal("l029", "tiranosaurio") + 10, 0],
  ]);

  // rugido
  const rugido = fin("l035") + 6;
  const hipo1 = fin("l035") + 46;
  const hipo2 = fin("l036") + 4;
  const sHipo1 = salto(frame, hipo1, 40, 10);
  const sHipo2 = salto(frame, hipo2, 40, 10);
  const numero = (palabra: string, n: number) => clave(frame, [[pal("l035", palabra, n) - 2, 0], [pal("l035", palabra, n) + 4, 1], [pal("l035", palabra, n) + 14, 1], [pal("l035", palabra, n) + 20, 0]]);
  const enRugido = frame >= rugido && frame < rugido + 40;

  const exprG = paso(frame, [
    [0, "feliz" as const],
    [ini("l028"), "riendo" as const],
    [fin("l028") + 10, "feliz" as const],
    [ini("l030"), "sorprendido" as const],
    [pal("l030", "famosisimo"), "riendo" as const],
    [fin("l030") + 6, "feliz" as const],
    [ini("l035"), "feliz" as const],
    [rugido, "riendo" as const],
    [hipo1, "sorprendido" as const],
    [ini("l036"), "contento" as const],
    [pal("l036", "hipo"), "riendo" as const],
  ]);

  return (
    <AbsoluteFill>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080">
        {/* -------- la orilla -------- */}
        <g opacity={enOrilla}>
          <Orilla id="e04" camX={CAMX} rastro={clave(frame, [[ini("l028"), 0], [ini("l028") + 20, 1]])} />
          <Lechuza
            x={TOCON.x - CAMX}
            y={TOCON.arriba}
            escala={0.85}
            voltear
            expresion={paso(frame, [
              [0, "feliz" as const],
              [rugido, "riendo" as const],
              [ini("l036"), "riendo" as const],
            ])}
            habla={enRugido ? 0.9 : bocaDe(escena, "lechuza", frame)}
            alaA={enRugido ? 90 : frame >= pal("l035", "rugir") ? 40 : 0}
            alaB={enRugido ? 90 : frame >= pal("l035", "rugir") ? 40 : habla === "lechuza" ? 30 + 20 * Math.sin(frame * 0.2) : 0}
            mirada={habla === "galleta" ? { x: 1, y: 0.4 } : { x: 0.8, y: 0 }}
          />
          <Galleta
            x={clave(frame, [
              [pal("l028", "como") - 2, 330],
              [pal("l028", "pista") + 4, 430],
            ])}
            y={1000 + sHipo1.dy + sHipo2.dy - (frame > pal("l028", "como") - 2 && frame < pal("l028", "pista") + 4 ? Math.abs(Math.sin(frame * 0.5)) * 18 : 0)}
            escala={0.95}
            expresion={exprG}
            habla={enRugido ? 0.9 : bocaDe(escena, "galleta", frame)}
            estiramiento={sHipo1.estira * sHipo2.estira}
            brazos={pose(frame, [
              [0, POSES.reposo],
              [ini("l028"), { a: 14, b: 150 }],
              [fin("l028") + 10, POSES.reposo],
              [ini("l030"), POSES.manosCara],
              [pal("l030", "famosisimo"), POSES.celebrar],
              [fin("l030") + 6, POSES.reposo],
              [pal("l035", "rugir"), { a: 120, b: 120 }],
              [hipo1, POSES.manosCara],
              [pal("l036", "hipo"), POSES.manosCara],
              [fin("l036") + 14, POSES.reposo],
            ])}
            mirada={luz > 0.3 ? { x: 1, y: -1 } : habla === "lechuza" ? { x: 1, y: -0.4 } : { x: 1, y: 0 }}
          />
          <Farolin
            x={1060}
            y={clave(frame, [
              [pal("l029", "era") - 10, 520],
              [pal("l029", "era") + 10, 470],
              [fin("l030"), 470],
              [fin("l030") + 20, 520],
            ])}
            escala={0.95}
            expresion={paso(frame, [
              [0, "pensando" as const],
              [ini("l027"), "feliz" as const],
              [ini("l030"), "sorprendido" as const],
              [ini("l035"), "riendo" as const],
              [pal("l035", "rujis"), "feliz" as const],
              [rugido, "riendo" as const],
            ])}
            habla={enRugido ? 0.9 : bocaDe(escena, "farolin", frame)}
            luz={paso(frame, [
              [0, "amarilla" as const],
              [rugido, "rosa" as const],
              [ini("l036"), "amarilla" as const],
            ])}
            brillo={1 + 0.5 * luz}
            voltear={luz > 0.05}
            brazos={pose(frame, [
              [0, POSES.pensar],
              [fin("l026"), POSES.reposo],
              [pal("l035", "rugir"), { a: 120, b: 120 }],
              [fin("l035") + 40, POSES.celebrar],
              [ini("l036"), POSES.reposo],
            ])}
            mirada={luz > 0.05 ? { x: 0.8, y: -0.5 } : habla === "lechuza" ? { x: 1, y: 0.3 } : { x: -0.8, y: 0.4 }}
            idPrefijo="f-e04"
          />
          <LuzHistorias x={700} y={330} r={280} visible={luz} desde={[1060 - 30, 470 + 51]} id="e04-luz" fondo="#FFE9C2">
            <rect x={420} y={470} width={560} height={200} fill="#9BD27A" />
            <Tiranosaurio x={680} y={540} escala={0.62} paso={frame * 0.18} silueta={silueta > 0.5 ? "#2B2140" : undefined} expresion={frame >= pal("l030", "famosisimo") ? "riendo" : "feliz"} />
            {frame >= pal("l030", "famosisimo")
              ? [0, 1, 2, 3, 4].map((k) => {
                  const a = (k / 5) * Math.PI * 2 + frame * 0.05;
                  return <path key={k} transform={`translate(${700 + Math.cos(a) * 220} ${330 + Math.sin(a) * 200}) scale(1.6)`} d="M 0 -9 L 2 -2 L 9 0 L 2 2 L 0 9 L -2 2 L -9 0 L -2 -2 Z" fill={C.luzAmarilla} stroke={C.contorno} strokeWidth={1.5} />;
                })
              : null}
          </LuzHistorias>
          <Etiqueta x={700} y={660} texto="Tiranosaurio" visible={clave(frame, [[pal("l029", "tiranosaurio") - 2, 0], [pal("l029", "tiranosaurio") + 8, 1], [fin("l030"), 1], [fin("l030") + 8, 0]])} fondo={C.luzAmarilla} />
          <MarcadorPistas pistas={[-100, -100, pista3]} visible={marcador} resaltar={resaltar} />
          {/* a la de tres */}
          {[
            ["1", "uno", 0],
            ["2", "dos", 0],
            ["3", "tres", 1],
          ].map(([t, p, n], i) => (
            <Onomatopeya key={i} x={760 + i * 200} y={330} texto={t as string} tam={190} visible={numero(p as string, n as number)} rot={0} />
          ))}
          <Onomatopeya x={760} y={300} texto="¡GRRRAAAR!" tam={170} color={C.coral} visible={clave(frame, [[rugido - 2, 0], [rugido + 6, 1], [rugido + 34, 1], [rugido + 42, 0]])} temblor={5} />
          <Onomatopeya x={520} y={560} texto="¡hip!" tam={90} color={C.luzTurquesa} visible={clave(frame, [[hipo1 - 1, 0], [hipo1 + 4, 1], [hipo1 + 26, 1], [hipo1 + 32, 0]])} rot={8} />
          <Onomatopeya x={540} y={560} texto="¡hip!" tam={80} color={C.luzTurquesa} visible={clave(frame, [[hipo2 - 1, 0], [hipo2 + 4, 1], [hipo2 + 24, 1], [hipo2 + 30, 0]])} rot={-6} />
        </g>

        {/* -------- el rastro, desde arriba -------- */}
        {tRastro > 0.01 ? (
          <g opacity={tRastro}>
            <g transform={`translate(${-camRastro} 0)`}>
              <Rastro frame={frame} linea={linea} manos={manos} tacha={tacha} opciones={0} elegida={0} />
            </g>
            <Rastro frame={frame} linea={0} manos={0} tacha={0} opciones={opciones} elegida={elegida} soloOpciones />
            <CuentaAtras desde={cuenta[0]} hasta={cuenta[1]} x={960} y={520} r={110} />
          </g>
        ) : null}

        {/* -------- tan largo como un autobús -------- */}
        {tBus > 0.01 ? (
          <g opacity={tBus}>
            <rect x={0} y={0} width={1920} height={1080} fill="#FFF3D6" />
            <rect x={0} y={560} width={1920} height={14} fill="#E5CFA4" />
            <rect x={0} y={940} width={1920} height={14} fill="#E5CFA4" />
            <Tiranosaurio
              x={clave(frame, [
                [ini("l031"), -500],
                [pal("l031", "tiranosaurio") + 20, 1000],
              ])}
              y={566}
              escala={0.85}
              paso={frame < pal("l031", "tiranosaurio") + 20 ? frame * 0.25 : undefined}
              expresion={frame >= ini("l032") ? "riendo" : "feliz"}
            />
            <Autobus
              x={clave(frame, [
                [pal("l031", "autobus") - 10, 2000],
                [pal("l031", "autobus") + 10, 1000 - 410 * 0.85],
              ])}
              y={946}
              largo={766 * 0.85}
            />
            {/* mismo largo: líneas de medir */}
            {(() => {
              const v = clave(frame, [
                [ini("l032") - 4, 0],
                [ini("l032") + 8, 1],
              ]);
              const x1 = 1000 - 410 * 0.85;
              const x2 = 1000 + 356 * 0.85;
              return (
                <g opacity={v}>
                  {[x1, x2].map((x) => (
                    <path key={x} d={`M ${x} 180 L ${x} 960`} stroke={C.luzRosa} strokeWidth={8} strokeDasharray="18 14" />
                  ))}
                  <path d={`M ${x1 + 10} 200 L ${x2 - 10} 200`} stroke={C.contorno} strokeWidth={8} />
                  <path d={`M ${x1 + 30} 180 L ${x1 + 6} 200 L ${x1 + 30} 220 M ${x2 - 30} 180 L ${x2 - 6} 200 L ${x2 - 30} 220`} stroke={C.contorno} strokeWidth={8} fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </g>
              );
            })()}
            <Rotulo texto="¡Como un autobús!" x={420} y={140} desde={ini("l032") - 4} hasta={ini("l033") + 10} fondo={C.luzAmarilla} tam={70} />
          </g>
        ) : null}

        {/* -------- dientes como plátanos -------- */}
        {tDientes > 0.01 ? (
          <g opacity={tDientes}>
            <rect x={0} y={0} width={1920} height={1080} fill="#FFE9C2" />
            <Tiranosaurio x={760} y={1500} escala={2.4} boca={clave(frame, [[pal("l033", "dientes") - 6, 0.1], [pal("l033", "dientes") + 6, 0.85]])} expresion="feliz" mirada={{ x: -0.4, y: 0.3 }} />
            {(() => {
              const v = clave(frame, [
                [pal("l033", "algunos") - 4, 0],
                [pal("l033", "algunos") + 8, 1],
              ]);
              const b = clave(frame, [
                [pal("l033", "platanos") - 4, 0],
                [pal("l033", "platanos") + 8, 1],
              ]);
              return (
                <g>
                  <g transform={`translate(330 470) scale(${v})`}>
                    <circle r={210} fill="#FFFFFF" stroke={C.contorno} strokeWidth={6} />
                    <DienteAfilado x={-90} y={110} escala={1} rot={0} />
                    <g opacity={b}>
                      <text x={10} y={20} textAnchor="middle" fontFamily={FUENTE_TITULO} fontWeight={800} fontSize={90} fill={C.texto}>
                        =
                      </text>
                      <Platano x={100} y={0} escala={1.05} rot={-75} />
                    </g>
                  </g>
                  {/* con fondo: sin él, la cola del tiranosaurio cruzaba las letras */}
                  <g opacity={b}>
                    <rect x={100} y={705} width={460} height={78} rx={39} fill="#FFFFFF" stroke={C.contorno} strokeWidth={5} />
                    <text x={330} y={760} textAnchor="middle" fontFamily={FUENTE_TEXTO} fontWeight={700} fontSize={50} fill={C.texto}>
                      ¡como un plátano!
                    </text>
                  </g>
                </g>
              );
            })()}
            {/* Galleta asoma con hambre */}
            {frame >= ini("l034") - 10 ? (
              <g>
                <Galleta
                  x={clave(frame, [
                    [ini("l034") - 10, -200],
                    [ini("l034") + 6, 260],
                  ])}
                  y={1150}
                  escala={0.9}
                  expresion={paso(frame, [
                    [0, "riendo" as const],
                    [pal("l034", "hambre"), "contento" as const],
                  ])}
                  habla={bocaDe(escena, "galleta", frame)}
                  brazos={{ a: -30, b: -30 }}
                  mirada={{ x: 1, y: -0.5 }}
                />
                <g opacity={clave(frame, [[pal("l034", "hambre") - 4, 0], [pal("l034", "hambre") + 6, 1]])} transform="translate(720 800)">
                  <circle cx={-80} cy={110} r={14} fill="#FFFFFF" stroke={C.contorno} strokeWidth={4} />
                  <circle cx={-50} cy={70} r={22} fill="#FFFFFF" stroke={C.contorno} strokeWidth={4} />
                  <ellipse cx={40} cy={-10} rx={120} ry={84} fill="#FFFFFF" stroke={C.contorno} strokeWidth={5} />
                  <Platano x={40} y={-10} escala={0.7} rot={-10} />
                </g>
              </g>
            ) : null}
          </g>
        ) : null}
        <Iris duracion={escena.duracion} entrada={14} salida={16} />
      </svg>
      <VocesEscena escena={escena} />
      <MusicaEscena pista="misterio" escena={escena} volumen={0.12} hasta={ini("l029")} ambiente="rio" />
      <MusicaEscena pista="aventura" escena={escena} volumen={0.15} desde={ini("l029") - 4} />
      <Fx efecto="acierto" en={fin("l028") + 2} volumen={0.5} />
      <Fx efecto="rugido" en={rugido} volumen={0.45} />
      <Fx efecto="hipo" en={hipo1} volumen={0.8} />
      <Fx efecto="hipo" en={hipo2} volumen={0.8} />
    </AbsoluteFill>
  );
};
