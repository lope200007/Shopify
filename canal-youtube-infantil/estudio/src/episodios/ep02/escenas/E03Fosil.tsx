import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FUENTE_TITULO } from "../../../marca";
import { bocaDe, clave, EscenaColocada, paso, pose, quienHabla } from "../../../comun/tiempo";
import { Fx, MusicaEscena, useEscena, VocesEscena } from "../../../comun/Sonido";
import { Iris, Rotulo } from "../../../comun/Rotulos";
import { LuzHistorias } from "../../../comun/Juego";
import { HuellaDino, HuellaOsita, mezclar } from "../../../escenario/Huellas";
import { RelojArena } from "../../../escenario/Cosas";
import { azar } from "../../../escenario/Bosque";
import { Farolin } from "../../../personajes/Farolin";
import { Galleta } from "../../../personajes/Galleta";
import { Lechuza } from "../../../personajes/Lechuza";
import { POSES } from "../../../personajes/cara";
import { Orilla, TOCON, usePalabra } from "../mundo";

const CX = 760;
const CY = 330;
const R = 290;

const BARRO = "#8B5E3C";
const SECO = "#C49A6C";
const PIEDRA = "#B4A99D";
const ARENA = "#E8C78F";

/** Lo que cuenta la luz de las historias: así se forma una huella fósil (vista desde arriba). */
const HistoriaFosil: React.FC<{
  frame: number;
  sombra: number; // 0..1 la sombra del dinosaurio cruza
  pie: number; // 0 arriba, 1 pisando, 2 levantado
  seco: number;
  arena: number; // 0..1 la arena tapa
  piedra: number;
  lavado: number; // 0..1 el río se lleva lo de encima
  reloj: number; // visible
  giroReloj: number;
  plastilina: number; // visible (la comparación de Galleta)
  pataPlastilina: number;
  sueno: number;
}> = ({ frame, sombra, pie, seco, arena, piedra, lavado, reloj, giroReloj, plastilina, pataPlastilina, sueno }) => {
  const suelo = mezclar(mezclar(BARRO, SECO, seco), PIEDRA, piedra);
  const huella = pie >= 1;
  const r = azar(7);
  const granos = Array.from({ length: 70 }, () => ({ x: CX - R + r() * 2 * R, v: 2 + r() * 3, f: r() * 600 }));
  const grietas = [
    "M 520 420 l 60 30 l 30 -40 l 70 20",
    "M 600 560 l 40 -50 l 60 10 l 20 60",
    "M 860 400 l 50 40 l -10 60 l 60 30",
    "M 900 560 l -30 50 l 50 40",
    "M 640 250 l 50 30 l 60 -20",
  ];
  // el pie: baja (grande y difuminado arriba) y sube después de pisar
  const altura = pie < 1 ? 1 - pie : pie - 1; // 1 = lejos (arriba), 0 = pisando
  const piePos = { x: CX, y: 470 };
  return (
    <g>
      <rect x={CX - R} y={CY - R} width={2 * R} height={2 * R} fill={suelo} />
      {/* el río, arriba */}
      <path d={`M ${CX - R} 70 Q ${CX} 100 ${CX + R} 66 L ${CX + R} ${CY - R} L ${CX - R} ${CY - R} Z`} fill={mezclar("#4FB3E8", "#7FA6B8", piedra)} />
      {[0, 1, 2, 3].map((i) => (
        <path key={i} d={`M ${CX - 200 + i * 110 + ((frame * 1.5) % 110)} ${70 + (i % 2) * 14} q 20 -8 40 0`} stroke="#FFFFFF" strokeWidth={5} fill="none" strokeLinecap="round" opacity={0.6 * (1 - piedra)} />
      ))}
      {/* brillos del barro mojado */}
      {[
        [600, 300, 40],
        [880, 340, 30],
        [700, 560, 36],
        [930, 520, 24],
      ].map(([x, y, w], i) => (
        <ellipse key={i} cx={x} cy={y} rx={w} ry={w * 0.3} fill="#FFFFFF" opacity={0.18 * (1 - seco)} />
      ))}
      {/* grietas al secarse */}
      {grietas.map((d, i) => (
        <path key={i} d={d} stroke={mezclar(SECO, "#5A3E2B", 0.6)} strokeWidth={4} fill="none" strokeLinejoin="round" strokeDasharray="400" strokeDashoffset={400 * (1 - seco)} opacity={1 - piedra * 0.6} />
      ))}
      {huella ? <HuellaDino x={piePos.x} y={piePos.y + 110} escala={1} fondo={suelo} id="e03-huella" /> : null}
      {/* la sombra del dinosaurio que pasa */}
      {sombra > 0 && sombra < 1 ? (
        <g transform={`translate(${CX - 520 + sombra * 1040} ${CY + 40}) rotate(-8)`} opacity={0.28 * Math.sin(sombra * Math.PI)}>
          <ellipse rx={260} ry={80} fill="#2B2140" />
          <ellipse cx={260} cy={-10} rx={90} ry={50} fill="#2B2140" />
          <path d="M -250 -30 Q -420 -20 -520 30 Q -400 20 -250 30 Z" fill="#2B2140" />
        </g>
      ) : null}
      {/* el pie del dinosaurio, visto desde arriba */}
      {pie > 0 && pie < 2 ? (
        <g opacity={Math.min(1, (1 - altura) * 3)}>
          <ellipse cx={piePos.x} cy={piePos.y + 40} rx={120 * (1 - altura * 0.4)} ry={70 * (1 - altura * 0.4)} fill="#2B2140" opacity={0.3 * (1 - altura)} />
          <g transform={`translate(${piePos.x} ${piePos.y + 110 - altura * 60}) scale(${1 + altura * 0.8}) translate(${-piePos.x} ${-(piePos.y + 110)})`}>
            <HuellaDino x={piePos.x} y={piePos.y + 110} escala={1.12} modo="icono" color={C.contorno} id="e03-pie-borde" />
            <HuellaDino x={piePos.x} y={piePos.y + 106} escala={1.05} modo="icono" color="#6CC56F" colorGarras="#FFF6DD" id="e03-pie" />
            {[
              [-34, -60],
              [0, -120],
              [36, -64],
            ].map(([dx, dy], i) => (
              <ellipse key={i} cx={piePos.x + dx} cy={piePos.y + 106 + dy} rx={9} ry={6} fill="#57AD5E" />
            ))}
            <circle cx={piePos.x} cy={piePos.y + 66} r={58} fill="#57AD5E" stroke={C.contorno} strokeWidth={5} />
            <circle cx={piePos.x - 16} cy={piePos.y + 52} r={16} fill="#6CC56F" />
          </g>
        </g>
      ) : null}
      {/* la arena lo va tapando (y el río se la lleva al final) */}
      {arena > 0 ? (
        <g>
          <defs>
            <linearGradient id="e03-lavado" x1="0" y1="0" x2="1" y2="0">
              <stop offset={`${Math.max(0, lavado * 120 - 20)}%`} stopColor="#FFFFFF" stopOpacity={0} />
              <stop offset={`${Math.min(100, lavado * 120)}%`} stopColor="#FFFFFF" stopOpacity={1} />
            </linearGradient>
            <mask id="e03-mascara">
              <rect x={CX - R} y={CY - R} width={2 * R} height={2 * R} fill="url(#e03-lavado)" />
            </mask>
          </defs>
          <g mask={lavado > 0 ? "url(#e03-mascara)" : undefined}>
            <rect x={CX - R} y={80} width={2 * R} height={2 * R} fill={mezclar(ARENA, PIEDRA, piedra * 0.9)} opacity={Math.min(1, arena)} />
            {Array.from({ length: 40 }, (_, i) => (
              <circle key={i} cx={CX - R + ((i * 97) % (2 * R))} cy={120 + ((i * 53) % 480)} r={4} fill={mezclar("#C9A06A", "#8E847A", piedra)} opacity={0.6 * Math.min(1, arena)} />
            ))}
          </g>
          {/* granos cayendo mientras tapa */}
          {arena < 1
            ? granos.map((g, i) => {
                const y = CY - R + ((frame * g.v + g.f) % (2 * R));
                return <circle key={i} cx={g.x} cy={y} r={4} fill="#D9B377" opacity={0.8 * Math.sin(Math.min(1, arena) * Math.PI)} />;
              })
            : null}
        </g>
      ) : null}
      {lavado > 0 && lavado < 1 ? <rect x={CX - R + lavado * 2 * R - 60} y={CY - R} width={70} height={2 * R} fill="#4FB3E8" opacity={0.5 * Math.sin(lavado * Math.PI)} /> : null}
      {/* el paso de muchísimo tiempo */}
      {reloj > 0.01 ? (
        <g opacity={reloj}>
          <circle cx={CX} cy={CY} r={120} fill="#FFFFFF" opacity={0.7} />
          <RelojArena x={CX} y={CY} escala={0.85 * reloj} giro={giroReloj} arena={0.5 + 0.5 * Math.cos((giroReloj / 180) * Math.PI)} />
        </g>
      ) : null}
      {/* la comparación de Galleta: la pata en la plastilina */}
      {plastilina > 0.01 ? (
        <g opacity={plastilina}>
          <rect x={CX - R} y={CY - R} width={2 * R} height={2 * R} fill="#FFF3D6" />
          <rect x={CX - 210} y={CY - 130} width={420} height={300} rx={50} fill="#FF9EC4" stroke={C.contorno} strokeWidth={6} />
          <path d={`M ${CX - 200} ${CY - 40} Q ${CX} ${CY - 100} ${CX + 200} ${CY - 30}`} stroke="#7FD3E6" strokeWidth={34} fill="none" strokeLinecap="round" opacity={0.85} />
          <path d={`M ${CX - 200} ${CY + 70} Q ${CX} ${CY + 20} ${CX + 200} ${CY + 90}`} stroke="#FFD23F" strokeWidth={30} fill="none" strokeLinecap="round" opacity={0.85} />
          <g opacity={pataPlastilina}>
            <HuellaOsita x={CX} y={CY + 80} escala={1.6} fondo="#FF9EC4" />
          </g>
          {sueno > 0.01
            ? [0, 1, 2].map((k) => {
                const t = ((frame + k * 18) % 54) / 54;
                return (
                  <text key={k} x={CX + 150 + t * 60} y={CY - 150 - t * 90} fontFamily={FUENTE_TITULO} fontWeight={800} fontSize={44 + t * 20} fill="#8E7DBE" opacity={sueno * (1 - t)}>
                    z
                  </text>
                );
              })
            : null}
        </g>
      ) : null}
    </g>
  );
};

// Doña Lechuza llega volando: es una huella fósil. Con la luz de las
// historias de Farolín vemos cómo se forma: barro → se seca → arena → piedra.
export const E03Fosil: React.FC<{ escena: EscenaColocada }> = ({ escena }) => {
  const { frame, ini, fin } = useEscena(escena);
  const pal = usePalabra(escena);
  const habla = quienHabla(escena, frame);
  const camX = 300;

  // Doña Lechuza vuela hasta el tocón
  const llega = 44;
  const lx = clave(frame, [
    [0, 2150],
    [llega, TOCON.x - camX],
  ]);
  const ly = clave(frame, [
    [0, 160],
    [llega, TOCON.arriba],
  ]);
  const volando = frame < llega;
  const aleteo = volando ? 60 + 50 * Math.sin(frame * 0.9) : 0;
  const aterriza = frame >= llega && frame < llega + 10 ? 1 - 0.12 * Math.sin(((frame - llega) / 10) * Math.PI) : 1;

  // la luz de las historias
  const luz = clave(frame, [
    [pal("l020", "historias") - 2, 0],
    [pal("l020", "historias") + 22, 1],
    [fin("l025") + 2, 1],
    [fin("l025") + 18, 0],
  ]);
  const fxF = clave(frame, [
    [pal("l020", "farolin") - 4, 1060],
    [pal("l020", "ilumina") + 10, 1150],
  ]);
  const fyF = clave(frame, [
    [pal("l020", "farolin") - 4, 520],
    [pal("l020", "ilumina") + 10, 470],
  ]);
  const vueltaF = frame >= pal("l020", "ilumina");
  const farol: [number, number] = [fxF + (vueltaF ? -30 : 30), fyF + 51];

  // la historia, sincronizada con lo que cuenta Doña Lechuza
  const sombra = clave(frame, [
    [pal("l021", "dinosaurio") - 14, 0],
    [pal("l021", "piso") + 10, 1],
  ]);
  const pie = clave(frame, [
    [pal("l021", "piso") - 14, 0],
    [pal("l021", "piso"), 1],
    [pal("l021", "piso") + 8, 1],
    [pal("l021", "barro") + 24, 2],
  ]);
  const seco = clave(frame, [
    [pal("l022", "seco") - 4, 0],
    [pal("l022", "seco") + 24, 1],
  ]);
  const arena = clave(frame, [
    [pal("l022", "arena") - 6, 0],
    [fin("l022") + 6, 1.05],
  ]);
  const reloj = clave(frame, [
    [ini("l023") - 4, 0],
    [ini("l023") + 10, 1],
    [pal("l023", "convirtio") - 6, 1],
    [pal("l023", "convirtio") + 6, 0],
  ]);
  const giroReloj = clave(frame, [
    [ini("l023") + 6, 0],
    [pal("l023", "convirtio") - 2, 540],
  ]);
  const piedra = clave(frame, [
    [pal("l023", "convirtio"), 0],
    [pal("l023", "piedra") + 6, 1],
  ]);
  const lavado = clave(frame, [
    [pal("l023", "piedra") + 8, 0],
    [pal("l023", "fosil") - 2, 1],
  ]);
  const plastilina = clave(frame, [
    [pal("l024", "como") - 6, 0],
    [pal("l024", "como") + 6, 1],
    [fin("l024") + 6, 1],
    [ini("l025") + 8, 0],
  ]);
  const pataPlastilina = clave(frame, [
    [pal("l024", "pata") - 2, 0],
    [pal("l024", "pata") + 8, 1],
  ]);
  const sueno = clave(frame, [
    [pal("l024", "esperar") - 4, 0],
    [pal("l024", "esperar") + 8, 1],
  ]);

  return (
    <AbsoluteFill>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080">
        <Orilla
          id="e03"
          camX={camX}
          brillo={clave(frame, [
            [pal("l018", "piedra") - 4, 0],
            [pal("l018", "piedra") + 8, 1],
            [fin("l018") + 10, 0],
          ])}
          dedos={[
            clave(frame, [[pal("l017", "tres") - 2, 0], [pal("l017", "tres") + 6, 1], [pal("l017", "garras"), 1], [pal("l017", "garras") + 10, 0]]),
            clave(frame, [[pal("l017", "tres"), 0], [pal("l017", "tres") + 8, 1], [pal("l017", "garras"), 1], [pal("l017", "garras") + 10, 0]]),
            clave(frame, [[pal("l017", "tres") + 2, 0], [pal("l017", "tres") + 10, 1], [pal("l017", "garras"), 1], [pal("l017", "garras") + 10, 0]]),
          ]}
          garras={clave(frame, [
            [pal("l017", "garras") - 2, 0],
            [pal("l017", "garras") + 8, 1],
            [fin("l017") + 16, 0],
          ])}
        />
        <Galleta
          x={330}
          y={1000}
          escala={0.95}
          expresion={paso(frame, [
            [0, "sorprendido" as const],
            [llega + 4, "riendo" as const],
            [ini("l017"), "feliz" as const],
            [ini("l018"), "sorprendido" as const],
            [fin("l018") + 6, "feliz" as const],
            [ini("l021"), "sorprendido" as const],
            [ini("l022"), "feliz" as const],
            [ini("l024"), "riendo" as const],
            [pal("l024", "esperar"), "contento" as const],
            [ini("l025"), "riendo" as const],
          ])}
          habla={bocaDe(escena, "galleta", frame)}
          brazos={pose(frame, [
            [0, POSES.reposo],
            [llega + 4, POSES.saludo],
            [ini("l016") + 40, POSES.reposo],
            [ini("l017"), POSES.señalar],
            [fin("l017"), POSES.reposo],
            [pal("l024", "pata"), { a: 14, b: 40 }],
            [pal("l024", "esperar"), { a: -60, b: -60 }],
            [ini("l025"), POSES.celebrar],
            [fin("l025") + 10, POSES.reposo],
          ])}
          mirada={luz > 0.3 ? { x: 1, y: -1 } : habla === "lechuza" || volando ? { x: 1, y: -0.4 } : { x: 1, y: 0.3 }}
        />
        <g transform={`translate(${lx} ${ly}) scale(${2 - aterriza} ${aterriza}) translate(${-lx} ${-ly})`}>
        <Lechuza
          x={lx}
          y={ly}
          escala={0.85}
          expresion={paso(frame, [
            [0, "feliz" as const],
            [ini("l018"), "sorprendido" as const],
            [pal("l018", "es", 1), "feliz" as const],
            [ini("l025"), "riendo" as const],
          ])}
          habla={bocaDe(escena, "lechuza", frame)}
          alaA={volando ? aleteo : pose(frame, [[0, { a: 0, b: 0 }], [ini("l020"), { a: 0, b: 0 }], [pal("l020", "ilumina"), { a: 0, b: 0 }]]).a}
          alaB={volando ? aleteo : pose(frame, [
            [0, { a: 0, b: 0 }],
            [ini("l016"), { a: 0, b: 95 }],
            [ini("l016") + 36, { a: 0, b: 0 }],
            [pal("l020", "farolin"), { a: 0, b: 80 }],
            [pal("l020", "historias") + 10, { a: 0, b: 0 }],
            [ini("l025"), { a: 0, b: 100 }],
            [fin("l025"), { a: 0, b: 0 }],
          ]).b}
          voltear
          inclinacion={volando ? -10 : habla === "galleta" ? -6 : 0}
          mirada={luz > 0.3 ? { x: 0.8, y: -0.8 } : habla === "farolin" ? { x: 0.6, y: -0.6 } : { x: 0.8, y: 0.3 }}
        />
        </g>
        <Farolin
          x={fxF}
          y={fyF}
          escala={0.95}
          expresion={paso(frame, [
            [0, "feliz" as const],
            [ini("l019"), "pensando" as const],
            [ini("l020"), "feliz" as const],
            [ini("l021"), "sorprendido" as const],
            [ini("l022"), "feliz" as const],
            [ini("l024"), "riendo" as const],
          ])}
          habla={bocaDe(escena, "farolin", frame)}
          luz="amarilla"
          brillo={1 + 0.5 * luz}
          brazos={pose(frame, [
            [0, POSES.reposo],
            [llega + 4, POSES.saludo],
            [ini("l016") + 40, POSES.reposo],
            [ini("l019"), POSES.pensar],
            [fin("l019"), POSES.reposo],
          ])}
          voltear={vueltaF}
          mirada={vueltaF ? { x: 0.8, y: -0.4 } : habla === "lechuza" ? { x: 1, y: 0.4 } : { x: -0.5, y: 0.6 }}
          idPrefijo="f-e03"
        />
        <LuzHistorias x={CX} y={CY} r={R} visible={luz} desde={farol} id="e03-luz">
          <HistoriaFosil
            frame={frame}
            sombra={sombra}
            pie={pie}
            seco={seco}
            arena={arena}
            piedra={piedra}
            lavado={lavado}
            reloj={reloj}
            giroReloj={giroReloj}
            plastilina={plastilina}
            pataPlastilina={pataPlastilina}
            sueno={sueno}
          />
        </LuzHistorias>
        <Rotulo texto="¡Fósil!" x={1240} y={180} desde={pal("l018", "fosil") - 4} hasta={fin("l018") + 20} fondo={C.luzAmarilla} tam={84} />
        <Rotulo texto="¡Fósil!" x={CX} y={CY + R - 20} desde={pal("l023", "fosil") - 4} hasta={ini("l024") - 4} fondo={C.luzAmarilla} tam={84} />
        <Iris duracion={escena.duracion} entrada={14} salida={16} centro={[960, 560]} />
      </svg>
      <VocesEscena escena={escena} />
      <MusicaEscena pista="aventura" escena={escena} volumen={0.12} hasta={pal("l020", "historias")} ambiente="rio" />
      <MusicaEscena pista="experimento" escena={escena} volumen={0.15} desde={pal("l020", "historias") - 4} />
      <Fx efecto="susurro" en={2} volumen={0.3} />
      <Fx efecto="plof" en={llega} volumen={0.22} />
      <Fx efecto="magia" en={fin("l020") + 2} volumen={0.4} />
      <Fx efecto="pum" en={pal("l021", "piso")} volumen={0.28} />
      <Fx efecto="acierto" en={fin("l023") + 2} volumen={0.45} />
      <Fx efecto="plof" en={pal("l024", "pata") + 4} volumen={0.18} />
    </AbsoluteFill>
  );
};
