import React from "react";
import { AbsoluteFill, interpolate, spring, useVideoConfig } from "remotion";
import { C, FUENTE_TEXTO } from "../../../marca";
import { bocaDe, clave, EscenaColocada, paso, pose, quienHabla } from "../../../comun/tiempo";
import { Fx, MusicaEscena, useEscena, VocesEscena } from "../../../comun/Sonido";
import { Burbuja, Iris, Rotulo } from "../../../comun/Rotulos";
import { InteriorArbol } from "../../../escenario/Arbol";
import { BolaIluminada, LunaFase } from "../../../escenario/Luna";
import { azar } from "../../../escenario/Bosque";
import { Farolin } from "../../../personajes/Farolin";
import { Galleta } from "../../../personajes/Galleta";
import { Lechuza } from "../../../personajes/Lechuza";
import { POSES } from "../../../personajes/cara";

const SOL: [number, number] = [230, 470]; // dónde se pone Farolín cuando hace de Sol
const ORBITA = { cx: 1000, cy: 540, rx: 380, ry: 160 };

const Confeti: React.FC<{ desde: number; frame: number }> = ({ desde, frame }) => {
  const t = frame - desde;
  if (t < 0 || t > 70) return null;
  const r = azar(77);
  return (
    <g>
      {Array.from({ length: 36 }, (_, i) => {
        const x = 200 + r() * 1520;
        const v = 6 + r() * 6;
        const y = -40 + t * v + Math.sin(t * 0.2 + i) * 10;
        const c = [C.luzAmarilla, C.luzTurquesa, C.luzRosa, "#FFFFFF"][i % 4];
        return (
          <path key={i} d="M 0 -12 L 3 -3 L 12 0 L 3 3 L 0 12 L -3 3 L -12 0 L -3 -3 Z" fill={c} transform={`translate(${x} ${y}) rotate(${t * 6 + i * 20})`} opacity={1 - t / 70} />
        );
      })}
    </g>
  );
};

export const E04Experimento: React.FC<{ escena: EscenaColocada }> = ({ escena }) => {
  const { frame, ini, fin } = useEscena(escena);
  const { fps } = useVideoConfig();
  const habla = quienHabla(escena, frame);

  // --- lámpara: se apaga a mitad de l027 y se enciende al celebrar
  const apaga = ini("l027") + Math.round((fin("l027") - ini("l027")) * 0.55);
  const enciende = ini("l040") + 16;
  const lampara =
    frame < enciende
      ? interpolate(frame, [apaga, apaga + 6], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
      : interpolate(frame, [enciende, enciende + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // --- Farolín: vuela a su sitio de Sol y brilla mucho
  const fx = clave(frame, [
    [fin("l023"), 640],
    [fin("l023") + 26, SOL[0]],
  ]);
  const fy = clave(frame, [
    [fin("l023"), 470],
    [fin("l023") + 26, SOL[1]],
  ]);
  const brillo = clave(frame, [
    [ini("l024") - 18, 1],
    [ini("l024") + 2, 1.6],
  ]);
  const exprF = paso(frame, [
    [0, "feliz" as const],
    [ini("l020"), "sorprendido" as const],
    [ini("l021"), "feliz" as const],
    [ini("l022"), "sorprendido" as const],
    [ini("l024"), "riendo" as const],
    [fin("l024"), "feliz" as const],
    [ini("l028"), "sorprendido" as const],
    [fin("l028"), "feliz" as const],
    [ini("l039"), "riendo" as const],
    [ini("l039") + 40, "feliz" as const],
    [ini("l040"), "contento" as const],
  ]);
  const luzF = paso(frame, [
    [0, "amarilla" as const],
    [ini("l039") - 18, "turquesa" as const],
    [fin("l040"), "amarilla" as const],
  ]);
  const brazosF = pose(frame, [
    [0, POSES.reposo],
    [ini("l022"), POSES.manosCara],
    [fin("l022"), POSES.reposo],
    [ini("l024"), POSES.celebrar],
    [fin("l024") + 10, POSES.reposo],
    [ini("l039"), POSES.celebrar],
    [fin("l039"), POSES.reposo],
  ]);

  // --- la pelota (la luna)
  const pelotaVisible = spring({ frame: frame - (ini("l025") + 20), fps, config: { damping: 12 } });
  const theta = clave(frame, [
    [fin("l032") + 4, 0],
    [ini("l033") - 2, 90],
    [fin("l034") + 4, 90],
    [ini("l035") - 2, 180],
    [fin("l036") + 4, 180],
    [ini("l037") + 12, 270],
    [fin("l038"), 315],
    [fin("l039"), 360],
  ]);
  const enOrbita = frame >= ini("l030");
  const llevar = clave(frame, [
    [ini("l030"), 0],
    [ini("l030") + 30, 1],
  ]);
  const rad = (theta * Math.PI) / 180;
  const ox = ORBITA.cx + ORBITA.rx * Math.cos(rad);
  const oy = ORBITA.cy + ORBITA.ry * Math.sin(rad);
  const bx = enOrbita ? interpolate(llevar, [0, 1], [1420, ox]) : 1420;
  const by = enOrbita ? interpolate(llevar, [0, 1], [640, oy]) : 640;
  const profundidad = enOrbita ? 1 + 0.15 * Math.sin(rad) * llevar : 1;
  const angLuz = (Math.atan2(SOL[1] - by, SOL[0] - bx) * 180) / Math.PI;
  const orbitaVisible = clave(frame, [
    [ini("l030") + 20, 0],
    [ini("l030") + 40, 1],
    [fin("l039"), 1],
    [fin("l039") + 20, 0],
  ]);
  // lo que ve Galleta desde la Tierra: llena cuando la pelota está al otro lado del Sol
  const faseVista = 0.5 + theta / 360;
  const burbuja = spring({ frame: frame - (fin("l030") + 2), fps, config: { damping: 13 } }) *
    interpolate(frame, [fin("l040") - 6, fin("l040") + 6], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // --- Galleta (la Tierra) mira a la pelota
  const mirarPelota = enOrbita && frame >= ini("l030") + 20;
  const exprG = paso(frame, [
    [0, "feliz" as const],
    [ini("l025"), "sorprendido" as const],
    [ini("l026"), "riendo" as const],
    [fin("l026"), "feliz" as const],
    [ini("l031"), "feliz" as const],
    [ini("l033"), "sorprendido" as const],
    [ini("l035"), "preocupado" as const],
    [ini("l037"), "sorprendido" as const],
    [fin("l037"), "feliz" as const],
    [ini("l040"), "riendo" as const],
  ]);
  const brazosG = pose(frame, [
    [0, POSES.reposo],
    [ini("l026"), POSES.celebrar],
    [fin("l026"), POSES.reposo],
    [ini("l037"), POSES.brazosAbiertos],
    [fin("l037"), POSES.reposo],
    [ini("l040"), POSES.celebrar],
  ]);

  // --- Doña Lechuza
  const exprL = paso(frame, [
    [0, "feliz" as const],
    [ini("l040"), "contento" as const],
  ]);
  const alaL = clave(frame, [
    [ini("l021"), 10],
    [fin("l021") - 14, 10],
    [fin("l021") - 4, 100],
    [ini("l023") + 50, 100],
    [fin("l023"), 20],
    [ini("l025"), 20],
    [ini("l025") + 12, 70],
    [ini("l030"), 70],
    [ini("l030") + 20, 55],
    [fin("l039"), 55],
    [ini("l040"), 120],
  ]);

  const rayos = clave(frame, [
    [ini("l024"), 0],
    [ini("l024") + 14, 1],
    [fin("l039"), 1],
    [fin("l039") + 14, 0],
  ]);

  // oscuridad con el «agujero» de luz de Farolín
  const oscuridad = 1 - lampara;

  const rotulo = (t: string, id: string, x: number, y: number, color: string = C.luzAmarilla, tam = 62) => (
    <Rotulo texto={t} x={x} y={y} desde={ini(id) + 4} hasta={fin(id) + 26} fondo={color} tam={tam} />
  );

  return (
    <AbsoluteFill>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080">
        <defs>
          <radialGradient id="oscuro-e04" gradientUnits="userSpaceOnUse" cx={fx} cy={fy} r={1500}>
            <stop offset="0%" stopColor="#0B0820" stopOpacity={0} />
            <stop offset="18%" stopColor="#0B0820" stopOpacity={0.1} />
            <stop offset="45%" stopColor="#0B0820" stopOpacity={0.45} />
            <stop offset="100%" stopColor="#0B0820" stopOpacity={0.75} />
          </radialGradient>
        </defs>
        <InteriorArbol lampara={1} faseVentana={0.75} />
        <Lechuza
          x={1590}
          y={850}
          escala={1}
          voltear
          expresion={exprL}
          habla={bocaDe(escena, "lechuza", frame)}
          alaB={alaL}
          mirada={habla === "galleta" ? { x: 1, y: 0.4 } : { x: 0.6, y: 0.2 }}
        />
        <Galleta
          x={1000}
          y={850}
          escala={1}
          expresion={exprG}
          habla={bocaDe(escena, "galleta", frame)}
          brazos={brazosG}
          mirada={mirarPelota ? { x: Math.cos(rad), y: Math.sin(rad) * 0.9 } : habla === "lechuza" ? { x: 1, y: 0 } : { x: -0.6, y: 0 }}
        />
        {/* la habitación se oscurece: solo queda la luz de Farolín */}
        <rect x={0} y={0} width={1920} height={1080} fill="url(#oscuro-e04)" opacity={oscuridad} />

        {/* órbita punteada alrededor de Galleta */}
        <ellipse
          cx={ORBITA.cx}
          cy={ORBITA.cy}
          rx={ORBITA.rx}
          ry={ORBITA.ry}
          fill="none"
          stroke="#FFFFFF"
          strokeWidth={5}
          strokeDasharray="4 22"
          strokeLinecap="round"
          opacity={orbitaVisible * 0.7}
        />
        {/* la pelota-luna: siempre con la mitad que mira a Farolín iluminada */}
        <g transform={`translate(${bx} ${by}) scale(${pelotaVisible * profundidad}) translate(${-bx} ${-by})`}>
          {lampara > 0.5 ? (
            // con la lámpara encendida, la luz llega de todas partes: se ve entera
            <g>
              <circle cx={bx} cy={by} r={46} fill="#FFFBEA" stroke={C.contorno} strokeWidth={4} />
              <ellipse cx={bx - 14} cy={by - 16} rx={14} ry={9} fill="#FFFFFF" />
            </g>
          ) : (
            <BolaIluminada x={bx} y={by} r={46} angLuz={angLuz} id="pelota" />
          )}
        </g>
        {/* etiquetas «con luz» / «a oscuras» */}
        {frame >= ini("l028") && frame < fin("l029") ? (
          <g opacity={clave(frame, [[ini("l028"), 0], [ini("l028") + 10, 1], [fin("l029") - 8, 1], [fin("l029"), 0]])}>
            <text x={bx - 70} y={by - 70} textAnchor="end" fontFamily={FUENTE_TEXTO} fontWeight={700} fontSize={40} fill={C.luzAmarilla}>
              con luz
            </text>
            <text x={bx + 70} y={by - 70} fontFamily={FUENTE_TEXTO} fontWeight={700} fontSize={40} fill="#B9B4E8">
              a oscuras
            </text>
          </g>
        ) : null}

        {/* rayos de sol: Farolín hace de Sol */}
        <g transform={`translate(${fx + 20} ${fy - 20}) rotate(${frame * 0.5}) scale(${rayos})`} opacity={rayos}>
          {Array.from({ length: 14 }, (_, i) => (
            <path key={i} d="M -14 -150 L 0 -215 L 14 -150 Z" fill={C.luzAmarilla} stroke={C.contorno} strokeWidth={4} strokeLinejoin="round" transform={`rotate(${(i * 360) / 14})`} opacity={0.9} />
          ))}
        </g>
        <Farolin
          x={fx}
          y={fy}
          escala={1.2}
          expresion={exprF}
          habla={bocaDe(escena, "farolin", frame)}
          luz={luzF}
          brillo={brillo}
          brazos={brazosF}
          mirada={frame > fin("l023") ? { x: 1, y: 0 } : { x: 0.8, y: 0.2 }}
          idPrefijo="f-e04"
        />

        {/* lo que ve Galleta */}
        <Burbuja x={1540} y={300} r={150} visible={burbuja} titulo="Lo que ve Galleta">
          <circle r={150} fill="#140F3D" />
          <circle cx={-80} cy={-60} r={3} fill="#FFFFFF" />
          <circle cx={70} cy={80} r={2.5} fill="#FFFFFF" />
          <circle cx={90} cy={-90} r={2} fill="#FFFFFF" />
          <LunaFase x={0} y={0} r={100} fase={faseVista} id="luna-burbuja" brilloHalo={0.5} />
        </Burbuja>

        {rotulo("Sol", "l024", SOL[0], 760, C.luzAmarilla, 66)}
        {rotulo("Luna", "l025", 1420, 760, "#FFFFFF", 54)}
        {rotulo("Tierra", "l025", 1000, 990, C.luzTurquesa, 58)}
        {rotulo("Luna llena", "l032", 1540, 625)}
        {rotulo("Menguante", "l034", 1540, 625)}
        {rotulo("Luna nueva", "l036", 1540, 625)}
        {rotulo("Creciente", "l038", 1540, 625)}
        <Confeti desde={ini("l040")} frame={frame} />
        <Iris duracion={escena.duracion} entrada={16} salida={16} />
      </svg>
      <VocesEscena escena={escena} />
      <MusicaEscena pista="experimento" escena={escena} volumen={0.14} />
      <Fx efecto="magia" en={ini("l024") - 18} volumen={0.4} />
      <Fx efecto="pop" en={ini("l025") + 20} volumen={0.3} />
      <Fx efecto="clic" en={apaga} volumen={0.6} />
      <Fx efecto="susurro" en={fin("l032") + 6} volumen={0.25} />
      <Fx efecto="susurro" en={fin("l034") + 6} volumen={0.25} />
      <Fx efecto="susurro" en={fin("l036") + 6} volumen={0.25} />
      <Fx efecto="idea" en={ini("l039") - 18} volumen={0.45} />
      <Fx efecto="acierto" en={fin("l040") + 2} volumen={0.5} />
      <Fx efecto="clic" en={enciende} volumen={0.5} />
    </AbsoluteFill>
  );
};
