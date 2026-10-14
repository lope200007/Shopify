import React from "react";
import { useCurrentFrame } from "remotion";
import { C } from "../marca";
import { Arbol, azar, Mata } from "./Bosque";
import { HuellaDino, mezclar } from "./Huellas";

// La orilla del río al atardecer (episodio 2). `oscurece` va de 0 (sol
// poniéndose, colores cálidos que activan) a 1 (noche, colores fríos que calman).

const CIELO_TARDE = ["#5B4FB8", "#E8799B", "#FFB36B", "#FFD98A"];
const CIELO_NOCHE = [C.nocheArriba, "#2A2170", C.nocheAbajo, "#4A3A96"];
const PARADAS = [0, 0.45, 0.8, 1];

export const CieloAtardecer: React.FC<{ oscurece?: number; alto?: number; id?: string; solX?: number }> = ({ oscurece = 0, alto = 1080, id = "cielo-tarde", solX = 1480 }) => {
  const frame = useCurrentFrame();
  const k = Math.max(0, Math.min(1, oscurece));
  const solY = 560 + k * 320;
  const r = azar(21);
  const estrellas = Array.from({ length: 90 }, () => ({ x: r() * 1920, y: r() * alto * 0.62, t: 1.5 + r() * 3, f: r() * 6.28, v: 0.6 + r() * 1.6 }));
  const nubes = [
    [300, 180, 1.1],
    [900, 120, 0.8],
    [1500, 230, 1.0],
    [2100, 150, 0.9],
  ];
  const verEstrellas = Math.max(0, Math.min(1, (k - 0.35) / 0.5));
  return (
    <g>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          {PARADAS.map((p, i) => (
            <stop key={i} offset={`${p * 100}%`} stopColor={mezclar(CIELO_TARDE[i], CIELO_NOCHE[i], k)} />
          ))}
        </linearGradient>
        <radialGradient id={`${id}-halo`}>
          <stop offset="0%" stopColor="#FFE9A8" stopOpacity={0.9} />
          <stop offset="40%" stopColor="#FFC46B" stopOpacity={0.35} />
          <stop offset="100%" stopColor="#FFC46B" stopOpacity={0} />
        </radialGradient>
      </defs>
      <rect x={-400} y={-600} width={2720} height={alto + 1200} fill={`url(#${id})`} />
      {verEstrellas > 0
        ? estrellas.map((e, i) => {
            const b = 0.45 + 0.55 * Math.max(0, Math.sin(frame * 0.05 * e.v + e.f));
            return i % 9 === 0 ? (
              <g key={i} transform={`translate(${e.x} ${e.y}) scale(${0.6 + b * 0.6})`} opacity={b * verEstrellas}>
                <path d="M 0 -9 L 2 -2 L 9 0 L 2 2 L 0 9 L -2 2 L -9 0 L -2 -2 Z" fill="#FFF6C9" />
              </g>
            ) : (
              <circle key={i} cx={e.x} cy={e.y} r={e.t * 0.6} fill="#FFFFFF" opacity={(0.35 + b * 0.5) * verEstrellas} />
            );
          })
        : null}
      {/* el sol se pone detrás de las colinas */}
      <g opacity={Math.max(0, 1 - k * 1.3)}>
        <circle cx={solX} cy={solY} r={300} fill={`url(#${id}-halo)`} />
        <circle cx={solX} cy={solY} r={92} fill="#FFE9A8" />
        <circle cx={solX} cy={solY} r={92} fill="none" stroke="#FFD27A" strokeWidth={10} opacity={0.6} />
      </g>
      {nubes.map(([nx, ny, s], i) => {
        const x = ((nx + frame * 0.12 * (1 + i * 0.2)) % 2400) - 240;
        const tono = mezclar("#FFC6D3", "#4B3F8F", k);
        const luz = mezclar("#FFF0E0", "#6B5BB0", k);
        return (
          <g key={i} transform={`translate(${x} ${ny}) scale(${s})`} opacity={0.9 - k * 0.4}>
            <ellipse cx={0} cy={0} rx={120} ry={34} fill={tono} />
            <ellipse cx={-50} cy={-20} rx={56} ry={36} fill={tono} />
            <ellipse cx={30} cy={-30} rx={66} ry={44} fill={tono} />
            <ellipse cx={20} cy={-44} rx={40} ry={16} fill={luz} opacity={0.7} />
          </g>
        );
      })}
    </g>
  );
};

/** Juncos (eneas) que se mecen en la orilla. */
const Juncos: React.FC<{ x: number; y: number; s?: number; n?: number; semilla?: number }> = ({ x, y, s = 1, n = 6, semilla = 1 }) => {
  const frame = useCurrentFrame();
  const r = azar(semilla);
  const tallos = Array.from({ length: n }, () => ({ dx: (r() - 0.5) * 120, h: 150 + r() * 110, f: r() * 6.28, mazo: r() > 0.35 }));
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {tallos.map((t, i) => {
        const a = Math.sin(frame * 0.05 + t.f) * 4;
        return (
          <g key={i} transform={`translate(${t.dx} 0) rotate(${a})`}>
            <path d={`M 0 0 Q 4 ${-t.h * 0.5} 0 ${-t.h}`} stroke={C.contorno} strokeWidth={10} fill="none" strokeLinecap="round" />
            <path d={`M 0 0 Q 4 ${-t.h * 0.5} 0 ${-t.h}`} stroke="#5BAE5E" strokeWidth={5} fill="none" strokeLinecap="round" />
            {t.mazo ? <rect x={-11} y={-t.h - 6} width={22} height={58} rx={11} fill="#8B5A2B" stroke={C.contorno} strokeWidth={4} /> : null}
            <path d={`M 0 ${-t.h * 0.3} Q -40 ${-t.h * 0.55} -52 ${-t.h * 0.45}`} stroke="#4E9F57" strokeWidth={7} fill="none" strokeLinecap="round" />
          </g>
        );
      })}
    </g>
  );
};

/** Tocón (tronco cortado) donde se posa Doña Lechuza. Arriba queda en y - 120. */
export const Tocon: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -96 0 C -110 -6 -100 -20 -84 -20 L -78 -112 L 78 -112 L 84 -20 C 100 -20 110 -6 96 0 Z" fill="#8B5A2B" stroke={C.contorno} strokeWidth={6} strokeLinejoin="round" />
    <path d="M -50 -100 L -46 -30 M 10 -100 L 14 -40 M 50 -96 L 48 -50" stroke="#6B4423" strokeWidth={6} strokeLinecap="round" />
    <ellipse cx={0} cy={-112} rx={80} ry={24} fill="#E8B77C" stroke={C.contorno} strokeWidth={6} />
    <ellipse cx={0} cy={-112} rx={52} ry={15} fill="none" stroke="#C98A4B" strokeWidth={4} />
    <ellipse cx={0} cy={-112} rx={26} ry={7} fill="none" stroke="#C98A4B" strokeWidth={4} />
  </g>
);

/** Arbusto grande y frondoso. `sacudida` lo mueve (alguien escondido dentro). */
export const Arbusto: React.FC<{ x: number; y: number; s?: number; sacudida?: number; tono?: string }> = ({ x, y, s = 1, sacudida = 0, tono = "#4FA866" }) => {
  const frame = useCurrentFrame();
  const t = sacudida * Math.sin(frame * 1.6) * 6;
  const claro = mezclar(tono, "#FFFFFF", 0.25);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g transform={`rotate(${t * 0.4} 0 0) translate(${t} 0)`}>
        {[
          [-110, -70, 80],
          [100, -74, 84],
          [-40, -130, 96],
          [50, -140, 92],
          [0, -60, 110],
        ].map(([cx, cy, r], i) => (
          <circle key={i} cx={cx} cy={cy} r={r} fill={tono} stroke={C.contorno} strokeWidth={6} />
        ))}
        {[
          [-110, -70, 80],
          [100, -74, 84],
          [-40, -130, 96],
          [50, -140, 92],
          [0, -60, 110],
        ].map(([cx, cy, r], i) => (
          <circle key={`r${i}`} cx={cx} cy={cy} r={r - 3} fill={tono} />
        ))}
        <path d="M -80 -180 Q -40 -214 10 -206" stroke={claro} strokeWidth={14} fill="none" strokeLinecap="round" opacity={0.6} />
        {[
          [-120, -40],
          [-30, -170],
          [80, -110],
          [130, -40],
          [10, -40],
        ].map(([bx, by], i) => (
          <circle key={`b${i}`} cx={bx} cy={by} r={9} fill="#FF7EB6" stroke={C.contorno} strokeWidth={3} />
        ))}
      </g>
    </g>
  );
};

/** Flor alta (para que Farolín revolotee). */
const Flor: React.FC<{ x: number; y: number; s?: number; color?: string }> = ({ x, y, s = 1, color = "#FF9EC4" }) => {
  const frame = useCurrentFrame();
  const a = Math.sin(frame * 0.04 + x) * 3;
  return (
    <g transform={`translate(${x} ${y}) scale(${s}) rotate(${a})`}>
      <path d="M 0 0 Q 8 -80 0 -170" stroke={C.contorno} strokeWidth={10} fill="none" strokeLinecap="round" />
      <path d="M 0 0 Q 8 -80 0 -170" stroke="#5BAE5E" strokeWidth={5} fill="none" strokeLinecap="round" />
      <path d="M 2 -70 Q 36 -96 52 -80 Q 30 -60 2 -70 Z" fill="#6FD08C" stroke={C.contorno} strokeWidth={3.5} />
      {Array.from({ length: 6 }, (_, i) => (
        <ellipse key={i} cx={0} cy={-200} rx={14} ry={26} fill={color} stroke={C.contorno} strokeWidth={3.5} transform={`rotate(${i * 60} 0 -176)`} />
      ))}
      <circle cx={0} cy={-176} r={14} fill={C.luzAmarilla} stroke={C.contorno} strokeWidth={3.5} />
    </g>
  );
};

/**
 * La orilla: colinas, árboles al otro lado, el río y la arena de este lado.
 * `camX` mueve la cámara con paralaje. Las cosas de primer plano están en
 * «coordenadas de mundo» (x de 0 a ~2600).
 */
export const OrillaRio: React.FC<{
  camX?: number;
  oscurece?: number;
  suelo?: number;
  sacudidaArbusto?: number;
  conTocon?: boolean;
  conArbusto?: boolean;
  conFlor?: boolean;
}> = ({ camX = 0, oscurece = 0, suelo = 900, sacudidaArbusto = 0, conTocon = true, conArbusto = true, conFlor = true }) => {
  const frame = useCurrentFrame();
  const k = Math.max(0, Math.min(1, oscurece));
  const tinte = (c: string, f = 0.55) => mezclar(c, "#241C5A", k * f);
  const rioY = 640;
  const r = azar(33);
  const ondas = Array.from({ length: 26 }, () => ({ x: r() * 2600, y: rioY - 26 + r() * 64, l: 30 + r() * 60, v: 0.4 + r() * 0.8 }));
  return (
    <g>
      {/* colinas lejanas */}
      <g transform={`translate(${-camX * 0.15} 0)`}>
        <path d="M -400 600 Q 0 430 420 560 Q 800 420 1200 540 Q 1650 430 2100 560 Q 2500 470 2900 560 L 2900 760 L -400 760 Z" fill={tinte("#A88BC9", 0.7)} />
        <path d="M -400 620 Q 200 520 640 600 Q 1100 510 1500 600 Q 1900 520 2400 610 L 2900 610 L 2900 760 L -400 760 Z" fill={tinte("#8A70B8", 0.7)} />
      </g>
      {/* árboles de la otra orilla */}
      <g transform={`translate(${-camX * 0.35} 0)`}>
        {[-80, 160, 520, 760, 1180, 1420, 1700, 2000, 2280, 2560].map((ax, i) => (
          <Arbol key={i} x={ax} y={rioY - 30 + (i % 3) * 6} s={0.5 + (i % 3) * 0.08} tono={tinte(i % 2 ? "#5E9C82" : "#6FAE8C")} tonoClaro={tinte("#9FD6B4")} tronco={tinte("#6B4A3A")} />
        ))}
        <path d="M -400 600 Q 400 590 1200 604 Q 2000 592 2900 600 L 2900 640 L -400 640 Z" fill={tinte("#7FBF7A")} />
      </g>
      {/* el río */}
      <g transform={`translate(${-camX * 0.6} 0)`}>
        <path d={`M -400 ${rioY - 34} Q 600 ${rioY - 44} 1300 ${rioY - 30} Q 2100 ${rioY - 20} 2900 ${rioY - 36} L 2900 ${rioY + 70} Q 2000 ${rioY + 84} 1300 ${rioY + 66} Q 500 ${rioY + 54} -400 ${rioY + 72} Z`} fill={tinte("#4FB3E8", 0.75)} />
        {ondas.map((o, i) => {
          const x = ((o.x + frame * o.v * 1.2) % 2800) - 200;
          return <path key={i} d={`M ${x} ${o.y} q ${o.l / 2} -8 ${o.l} 0`} stroke="#FFFFFF" strokeWidth={5} fill="none" strokeLinecap="round" opacity={0.55 - k * 0.3} />;
        })}
        {/* reflejo del sol */}
        {[0, 1, 2, 3].map((i) => (
          <rect key={`s${i}`} x={1480 + camX * 0.6 - camX * 0.0 - 60 + i * 8 + Math.sin(frame * 0.1 + i) * 10} y={rioY - 20 + i * 18} width={120 - i * 22} height={7} rx={3.5} fill="#FFE9A8" opacity={(0.8 - i * 0.12) * Math.max(0, 1 - k * 1.4)} />
        ))}
      </g>
      {/* esta orilla: arena mojada, arena y hierba */}
      <path d={`M -400 ${rioY + 60} Q 400 ${rioY + 50} 1200 ${rioY + 66} Q 2000 ${rioY + 80} 2900 ${rioY + 58} L 2900 1400 L -400 1400 Z`} fill={tinte("#C9A06A")} />
      <path d={`M -400 ${rioY + 90} Q 500 ${rioY + 78} 1300 ${rioY + 96} Q 2100 ${rioY + 110} 2900 ${rioY + 88} L 2900 1400 L -400 1400 Z`} fill={tinte("#EBC98F")} stroke={C.contorno} strokeWidth={5} />
      <path d={`M -400 ${suelo + 60} Q 600 ${suelo + 30} 1200 ${suelo + 70} Q 1900 ${suelo + 100} 2900 ${suelo + 50} L 2900 1400 L -400 1400 Z`} fill={tinte("#7CC46A")} stroke={C.contorno} strokeWidth={5} />
      <g transform={`translate(${-camX} 0)`}>
        <Juncos x={120} y={suelo - 80} s={1} semilla={4} />
        <Juncos x={560} y={suelo - 96} s={0.85} n={5} semilla={8} />
        <Juncos x={2250} y={suelo - 70} s={1.1} semilla={12} />
        {conFlor ? <Flor x={1760} y={suelo + 10} s={1.1} /> : null}
        {conFlor ? <Flor x={1810} y={suelo + 20} s={0.8} color="#FFD23F" /> : null}
        <Mata x={-20} y={suelo + 40} s={1.1} tono={tinte("#4FA866")} />
        {conTocon ? <Tocon x={1560} y={suelo + 10} /> : null}
        {conArbusto ? <Arbusto x={1980} y={suelo + 30} s={1.05} sacudida={sacudidaArbusto} tono={tinte("#4FA866")} /> : null}
        {[300, 700, 1400, 1800, 2400].map((gx, i) => (
          <path key={i} d={`M ${gx} ${suelo + 70} l -8 -26 l 8 14 l 6 -30 l 4 30 l 10 -20 l -6 32 Z`} fill="#6FD08C" stroke={C.contorno} strokeWidth={3} strokeLinejoin="round" />
        ))}
      </g>
      {/* cae la noche sobre el paisaje (los personajes van encima y siguen viéndose bien) */}
      {k > 0 ? <rect x={-400} y={300} width={2720} height={1100} fill="#1A1450" opacity={k * 0.3} /> : null}
    </g>
  );
};

/**
 * La losa de piedra con la huella gigante, tumbada en el suelo (perspectiva).
 * `huellaEscala` 1.5 hace la huella más grande que la cabeza de Galleta.
 */
export const RocaHuella: React.FC<{
  x: number;
  y: number;
  escala?: number;
  dedos?: [number, number, number];
  garras?: number;
  brillo?: number; // destello alrededor de la huella (cuando se descubre)
  rastro?: number; // 0..1 otras huellas que se van viendo detrás
  oscurece?: number;
  id: string;
}> = ({ x, y, escala = 1, dedos, garras = 0, brillo = 0, rastro = 0, oscurece = 0, id }) => {
  const frame = useCurrentFrame();
  const roca = mezclar("#CDBFAF", "#4A4370", oscurece * 0.45);
  const borde = mezclar("#9E8C7A", "#2F2A55", oscurece * 0.45);
  return (
    <g transform={`translate(${x} ${y}) scale(${escala})`}>
      <path d="M -440 22 C -446 -28 -386 -70 -250 -80 C -100 -92 120 -96 300 -80 C 426 -68 456 -24 446 22 C 444 60 372 92 210 100 C 40 108 -210 106 -340 90 C -410 82 -436 62 -440 22 Z" fill={borde} stroke={C.contorno} strokeWidth={6} />
      <path d="M -430 0 C -436 -44 -380 -84 -250 -94 C -100 -106 120 -110 300 -94 C 420 -82 450 -40 440 0 C 434 40 360 66 200 72 C 40 80 -200 78 -330 64 C -400 56 -426 36 -430 0 Z" fill={roca} stroke={C.contorno} strokeWidth={6} />
      <path d="M -300 -40 l 40 10 l 20 -14 M 260 30 l 36 -12 l 24 10 M -120 50 l 30 -6" stroke={borde} strokeWidth={4} fill="none" strokeLinecap="round" />
      {[
        [-360, -20, 26, 10],
        [380, -30, 20, 8],
        [330, 40, 16, 6],
      ].map(([cx, cy, rx, ry], i) => (
        <ellipse key={i} cx={cx} cy={cy} rx={rx} ry={ry} fill="#7CB86A" opacity={0.8} />
      ))}
      {brillo > 0.01 ? <ellipse cx={0} cy={-6} rx={190 + brillo * 30} ry={86 + brillo * 14} fill="#FFF3B0" opacity={0.45 * brillo * (0.8 + 0.2 * Math.sin(frame * 0.2))} /> : null}
      {rastro > 0.01
        ? [
            [-270, -40, 0.5],
            [-380, -70, 0.36],
          ].map(([hx, hy, s], i) => <HuellaDino key={i} x={hx} y={hy} escala={s * 1.45} aplastar={0.6} fondo={roca} id={`${id}-r${i}`} opacidad={Math.min(1, rastro * 2 - i * 0.5)} />)
        : null}
      <HuellaDino x={-6} y={62} escala={1.45} aplastar={0.6} fondo={roca} dedos={dedos} garras={garras} id={`${id}-h`} />
    </g>
  );
};
