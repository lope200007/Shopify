import React from "react";
import { AbsoluteFill, spring, useVideoConfig } from "remotion";
import { C, FUENTE_TITULO } from "../../../marca";
import { bocaDe, clave, EscenaColocada, paso, pose, quienHabla } from "../../../comun/tiempo";
import { Fx, MusicaEscena, useEscena, VocesEscena } from "../../../comun/Sonido";
import { Burbuja, Iris, Rotulo } from "../../../comun/Rotulos";
import { LuzHistorias } from "../../../comun/Juego";
import { HuellaDino, HuellaGallina, mezclar } from "../../../escenario/Huellas";
import { Braquiosaurio, DinoPlumas, Gallina, Tiranosaurio } from "../../../escenario/Dinos";
import { Farolin } from "../../../personajes/Farolin";
import { Galleta } from "../../../personajes/Galleta";
import { Lechuza } from "../../../personajes/Lechuza";
import { POSES } from "../../../personajes/cara";
import { COLOR_ROCA, Orilla, TOCON, usePalabra } from "../mundo";

const CAMX = 300;
const CX = 760;
const CY = 330;
const R = 290;
const LX = TOCON.x - CAMX;

// De dinosaurio (verde) a pájaro (naranja), generación a generación
const GENERACIONES = [0, 0.3, 0.6, 0.85, 1];
const colorGeneracion = (ave: number) => mezclar("#6CC56F", "#F28C38", ave);

// El secreto increíble: las aves vienen de los dinosaurios, así que Doña
// Lechuza es pariente del tiranosaurio. El mejor momento, guardado para el final.
export const E07Secreto: React.FC<{ escena: EscenaColocada }> = ({ escena }) => {
  const { frame, ini, fin } = useEscena(escena);
  const { fps } = useVideoConfig();
  const pal = usePalabra(escena);
  const habla = quienHabla(escena, frame);

  const redoble = fin("l050") + 2;
  const tachan = redoble + 45;
  const foco = clave(frame, [
    [pal("l050", "secreto") - 4, 0],
    [pal("l050", "secreto") + 10, 1],
    [tachan + 6, 1],
    [tachan + 20, 0],
  ]);

  // historia: los grandes desaparecen; los pequeños con plumas se convierten en aves
  const luz = clave(frame, [
    [tachan + 4, 0],
    [tachan + 20, 1],
    [fin("l051") + 6, 1],
    [ini("l052") + 10, 0],
  ]);
  const grandes = clave(frame, [
    [pal("l051", "desaparecieron"), 1],
    [pal("l051", "tiempo"), 0.12],
  ]);
  const apareceGen = [
    pal("l051", "pequenos"),
    pal("l051", "hijos"),
    pal("l051", "nietos"),
    pal("l051", "bisnietos"),
    pal("l051", "aves"),
  ];
  const plumas = clave(frame, [
    [pal("l051", "plumas") - 2, 0],
    [pal("l051", "plumas") + 8, 1],
    [pal("l051", "plumas") + 30, 0],
  ]);

  // la sombra de Doña Lechuza se convierte en la de un tiranosaurio
  const sombra = clave(frame, [
    [pal("l053", "pariente") - 10, 0],
    [pal("l053", "pariente") + 4, 1],
    [fin("l054") + 6, 1],
    [fin("l054") + 18, 0],
  ]);
  const aDino = clave(frame, [
    [pal("l053", "dinosaurios") - 4, 0],
    [pal("l053", "dinosaurios") + 10, 1],
  ]);
  const juntos = clave(frame, [
    [pal("l053", "aves") - 4, 0],
    [pal("l053", "aves") + 10, 1],
  ]);

  // la gallina y su huella
  const gallinaX = clave(frame, [
    [ini("l055") - 30, -120],
    [pal("l055", "gallina") + 10, 600],
  ]);
  const andaGallina = frame < pal("l055", "gallina") + 10;
  const lupa = clave(frame, [
    [pal("l055", "tres") - 8, 0],
    [pal("l055", "tres") + 4, 1],
  ]);
  const dedos = clave(frame, [
    [pal("l055", "tres"), 0],
    [pal("l055", "tres") + 10, 1],
  ]);
  const igual = clave(frame, [
    [pal("l055", "como") - 4, 0],
    [pal("l055", "como") + 8, 1],
  ]);

  return (
    <AbsoluteFill>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080">
        <defs>
          <filter id="e07-silueta">
            <feColorMatrix type="matrix" values="0 0 0 0 0.17  0 0 0 0 0.13  0 0 0 0 0.25  0 0 0 1 0" />
          </filter>
        </defs>
        <Orilla id="e07" camX={CAMX} oscurece={0.6 + 0.15 * (frame / escena.duracion)} />
        {/* la pantalla de sombras, detrás de Doña Lechuza */}
        <LuzHistorias x={LX - 20} y={430} r={270} visible={sombra} desde={[1060 + 30, 470 + 51]} id="e07-sombras" fondo="#FFE9C2">
          <g opacity={1 - juntos}>
            <g opacity={1 - aDino} filter="url(#e07-silueta)">
              <Lechuza x={LX - 20} y={650} escala={0.95} alaA={30} alaB={30} />
            </g>
            <g opacity={aDino}>
              <Tiranosaurio x={LX - 60} y={650} escala={0.6} silueta="#2B2140" />
            </g>
          </g>
          <g opacity={juntos}>
            <Tiranosaurio x={LX - 150} y={650} escala={0.42} expresion="riendo" />
            <Lechuza x={LX + 120} y={650} escala={0.6} expresion="riendo" alaB={60} />
            <g transform={`translate(${LX - 10} 280) scale(${juntos})`}>
              <path d="M 0 30 C -50 -10 -40 -60 0 -36 C 40 -60 50 -10 0 30 Z" fill={C.luzRosa} stroke={C.contorno} strokeWidth={5} />
            </g>
          </g>
        </LuzHistorias>
        <Lechuza
          x={LX}
          y={TOCON.arriba}
          escala={0.85}
          voltear
          expresion={paso(frame, [
            [0, "feliz" as const],
            [redoble, "contento" as const],
            [ini("l051"), "feliz" as const],
            [pal("l052", "es"), "sorprendido" as const],
            [ini("l053"), "riendo" as const],
            [pal("l053", "aves"), "feliz" as const],
            [ini("l054"), "riendo" as const],
            [ini("l055"), "feliz" as const],
          ])}
          habla={bocaDe(escena, "lechuza", frame)}
          alaA={frame >= ini("l053") && frame < fin("l054") + 10 ? 70 : 0}
          alaB={frame >= ini("l053") && frame < fin("l054") + 10 ? 70 : habla === "lechuza" ? 30 + 20 * Math.sin(frame * 0.18) : 0}
          inclinacion={frame >= ini("l054") && frame < fin("l054") + 10 ? 8 : 0}
          mirada={habla === "galleta" || habla === "farolin" ? { x: 1, y: 0.2 } : frame >= ini("l055") ? { x: 1, y: 0.8 } : { x: 0.9, y: -0.2 }}
        />
        <Galleta
          x={330}
          y={1000}
          escala={0.95}
          expresion={paso(frame, [
            [0, "feliz" as const],
            [pal("l050", "secreto"), "sorprendido" as const],
            [ini("l051"), "feliz" as const],
            [pal("l051", "aves"), "sorprendido" as const],
            [ini("l052"), "pensando" as const],
            [pal("l052", "usted"), "sorprendido" as const],
            [ini("l053"), "riendo" as const],
            [ini("l055"), "feliz" as const],
            [pal("l055", "como"), "sorprendido" as const],
          ])}
          habla={bocaDe(escena, "galleta", frame)}
          brazos={pose(frame, [
            [0, POSES.reposo],
            [redoble, POSES.manosCara],
            [tachan, POSES.reposo],
            [pal("l052", "usted"), POSES.señalar],
            [ini("l053"), POSES.celebrar],
            [fin("l054") + 10, POSES.reposo],
          ])}
          mirada={luz > 0.3 ? { x: 1, y: -1 } : frame >= ini("l055") ? { x: 1, y: 0.6 } : { x: 1, y: -0.4 }}
        />
        <LuzHistorias x={CX} y={CY} r={R} visible={luz} desde={[1060 - 30, 470 + 51]} id="e07-luz" fondo="#FFF3D6">
          <rect x={CX - R} y={CY + 120} width={2 * R} height={R} fill="#9BD27A" />
          <g opacity={grandes}>
            <Braquiosaurio x={CX + 40} y={CY + 150} escala={0.4} />
            <Tiranosaurio x={CX - 170} y={CY + 150} escala={0.38} />
          </g>
          {GENERACIONES.map((ave, i) => {
            const s = spring({ frame: frame - apareceGen[i], fps, config: { damping: 11, stiffness: 160 } });
            if (frame < apareceGen[i]) return null;
            const x = CX - 236 + i * 118;
            return (
              <g key={i}>
                {i > 0 ? <path d={`M ${x - 76} ${CY + 40} l 26 0 m -10 -10 l 10 10 l -10 10`} stroke={C.contorno} strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={s} /> : null}
                <g transform={`translate(${x} ${CY + 130}) scale(${s}) translate(${-x} ${-(CY + 130)})`}>
                  {i === 0 && plumas > 0.01 ? <circle cx={x} cy={CY + 60} r={70} fill={C.luzAmarilla} opacity={0.5 * plumas} /> : null}
                  <DinoPlumas x={x} y={CY + 130} escala={0.48} ave={ave} color={colorGeneracion(ave)} colorClaro={mezclar("#FFE29A", "#FFD08A", ave)} />
                </g>
              </g>
            );
          })}
        </LuzHistorias>
        {/* Farolín va delante de su propia burbuja: si no, el borde le tapa media cara */}
        <Farolin
          x={1060}
          y={470}
          escala={0.95}
          voltear={luz > 0.05}
          brillo={1 + 0.4 * Math.max(luz, sombra)}
          luz={paso(frame, [
            [0, "amarilla" as const],
            [ini("l054"), "rosa" as const],
            [fin("l054") + 10, "amarilla" as const],
          ])}
          expresion={paso(frame, [
            [0, "feliz" as const],
            [pal("l050", "secreto"), "sorprendido" as const],
            [ini("l051"), "feliz" as const],
            [ini("l053"), "sorprendido" as const],
            [ini("l054"), "riendo" as const],
            [ini("l055"), "feliz" as const],
          ])}
          habla={bocaDe(escena, "farolin", frame)}
          brazos={pose(frame, [
            [0, POSES.reposo],
            [ini("l054"), POSES.celebrar],
            [fin("l054") + 10, POSES.reposo],
          ])}
          mirada={luz > 0.05 ? { x: 0.8, y: -0.4 } : { x: 1, y: 0.4 }}
          idPrefijo="f-e07"
        />
        {/* la gallina pasa y deja sus huellas */}
        {frame >= ini("l055") - 30 ? (
          <g>
            {[0, 1, 2, 3, 4, 5].map((k) => {
              const hx = -60 + k * 120;
              return hx < gallinaX - 40 ? <HuellaGallina key={k} x={hx} y={1052 + (k % 2) * 14} escala={0.42} rot={90} aplastar={0.6} color="#B5651D" /> : null;
            })}
            <Gallina x={gallinaX} y={1050} escala={0.8} paso={andaGallina ? frame * 0.35 : undefined} />
          </g>
        ) : null}
        <Burbuja x={960} y={330} r={250} visible={lupa}>
          <rect x={-260} y={-260} width={520} height={520} fill={COLOR_ROCA} />
          <g transform="translate(-100 0)">
            <HuellaDino x={0} y={150} escala={1.05} fondo={COLOR_ROCA} dedos={[dedos, dedos, dedos]} id="e07-lupa-dino" />
          </g>
          <HuellaGallina x={150} y={80} escala={0.8} dedos={dedos} color="#8B5A2B" />
          <g opacity={igual}>
            <circle cx={60} cy={-20} r={34} fill="#FFFFFF" stroke={C.contorno} strokeWidth={5} />
            <text x={60} y={0} textAnchor="middle" fontFamily={FUENTE_TITULO} fontWeight={800} fontSize={60} fill={C.texto}>
              =
            </text>
          </g>
        </Burbuja>
        {/* foco sobre Doña Lechuza mientras suena el redoble */}
        {foco > 0.01 ? (
          <g>
            <defs>
              <mask id="e07-foco">
                <rect x={0} y={0} width={1920} height={1080} fill="#FFFFFF" />
                <ellipse cx={LX} cy={TOCON.arriba - 170} rx={210} ry={250} fill="#000000" />
              </mask>
            </defs>
            <rect x={0} y={0} width={1920} height={1080} fill="#140F3D" opacity={0.6 * foco} mask="url(#e07-foco)" />
          </g>
        ) : null}
        {frame >= tachan && frame < tachan + 30
          ? [0, 1, 2, 3, 4, 5, 6, 7].map((k) => {
              const a = (k / 8) * Math.PI * 2;
              const t = (frame - tachan) / 30;
              return (
                <path
                  key={k}
                  transform={`translate(${LX + Math.cos(a) * (120 + t * 120)} ${TOCON.arriba - 180 + Math.sin(a) * (120 + t * 120)}) scale(${2 * (1 - t)})`}
                  d="M 0 -9 L 2 -2 L 9 0 L 2 2 L 0 9 L -2 2 L -9 0 L -2 -2 Z"
                  fill={C.luzAmarilla}
                />
              );
            })
          : null}
        <Rotulo texto="¡Dinosauria!" x={1240} y={170} desde={pal("l054", "dinosauria") - 4} hasta={fin("l054") + 24} fondo={C.luzRosa} tam={80} />
        <Iris duracion={escena.duracion} entrada={14} salida={16} />
      </svg>
      <VocesEscena escena={escena} />
      <MusicaEscena pista="experimento" escena={escena} volumen={0.13} hasta={redoble} ambiente="grillos" />
      <MusicaEscena pista="experimento" escena={escena} volumen={0.15} desde={tachan + 10} />
      <Fx efecto="redoble" en={redoble} volumen={0.5} />
      <Fx efecto="acierto" en={fin("l055") + 4} volumen={0.45} />
    </AbsoluteFill>
  );
};
