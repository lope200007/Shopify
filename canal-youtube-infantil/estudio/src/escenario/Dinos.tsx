import React from "react";
import { useCurrentFrame } from "remotion";
import { C } from "../marca";
import { aperturaOjos, Ceja, Expresion, Mirada, Ojo } from "../personajes/cara";
import { mezclar } from "./Huellas";

// Dinosaurios del canal: simpáticos, nunca de miedo. Ojos grandes, colores
// alegres y la boca que sonríe. Todos miran a la derecha y tienen el origen
// en el suelo, bajo el cuerpo. `silueta` los pinta de un solo color (sombras).

type DinoBase = {
  x: number;
  y: number;
  escala?: number;
  voltear?: boolean;
  expresion?: Expresion;
  mirada?: Mirada;
  boca?: number; // 0..1
  paso?: number; // fase al caminar (radianes); sin valor = quieto
  semilla?: number;
  silueta?: string;
  opacidad?: number;
};

// ------------------------------------------------------------------ tiranosaurio

const T = {
  piel: "#6CC56F",
  oscuro: "#4E9F57",
  tripa: "#F3E9B5",
  manchas: "#57AD5E",
};

/** Pierna de dinosaurio con la cadera en (0,0) y el suelo en y = alto. */
const PiernaT: React.FC<{ color: string; alto?: number; contorno?: string; detalles?: boolean }> = ({ color, alto = 200, contorno = C.contorno, detalles = true }) => {
  const k = alto / 200;
  return (
    <g transform={`scale(${k})`} strokeLinejoin="round">
      <path d="M -12 95 L 48 100 L 30 186 L -14 186 Z" fill={color} stroke={contorno} strokeWidth={5} />
      <ellipse cx={12} cy={42} rx={58} ry={80} fill={color} stroke={contorno} strokeWidth={5} transform="rotate(8 12 42)" />
      <path d="M -26 200 C -26 176 40 170 82 184 C 98 190 98 200 84 200 Z" fill={color} stroke={contorno} strokeWidth={5} />
      {detalles
        ? [44, 62, 80].map((cx) => <path key={cx} d={`M ${cx - 5} 199 L ${cx + 4} 191 L ${cx + 8} 199 Z`} fill="#FFFFFF" stroke={contorno} strokeWidth={2.5} />)
        : null}
    </g>
  );
};

export const Tiranosaurio: React.FC<DinoBase & { tarareo?: number }> = ({
  x,
  y,
  escala = 1,
  voltear = false,
  expresion = "feliz",
  mirada = { x: 0.6, y: 0 },
  boca = 0,
  paso,
  semilla = 4,
  silueta,
  opacidad = 1,
  tarareo = 0,
}) => {
  const frame = useCurrentFrame();
  const apertura = aperturaOjos(frame, semilla);
  const anda = paso !== undefined;
  const pA = anda ? Math.sin(paso) * 20 : 0;
  const bote = anda ? Math.abs(Math.cos(paso)) * -7 : Math.sin(frame * 0.08 + semilla) * 2;
  const cola = Math.sin(frame * 0.07 + semilla) * 3 + (anda ? Math.sin(paso) * 4 : 0);
  const piel = silueta ?? T.piel;
  const oscuro = silueta ?? T.oscuro;
  const cont = silueta ?? C.contorno;
  const det = !silueta;
  const mandibula = Math.max(0, Math.min(1, boca)) * 24;

  // cuerpo, cuello y cola en una sola silueta: primero el contorno, luego el relleno
  const Silueta: React.FC<{ fill: string; stroke: string; sw: number }> = ({ fill, stroke, sw }) => (
    <g fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round">
      <path d="M -60 -318 C -170 -318 -300 -280 -410 -238 C -300 -222 -170 -200 -70 -186 Z" transform={`rotate(${cola} -60 -250)`} />
      <ellipse cx={20} cy={-250} rx={168} ry={112} transform="rotate(-12 20 -250)" />
      <ellipse cx={168} cy={-332} rx={74} ry={56} transform="rotate(-38 168 -332)" />
    </g>
  );

  return (
    <g transform={`translate(${x} ${y}) scale(${escala * (voltear ? -1 : 1)} ${escala})`} opacity={opacidad}>
      {det ? <ellipse cx={0} cy={4} rx={200} ry={18} fill="#000000" opacity={0.15} /> : null}
      {/* pierna de atrás y brazo de atrás */}
      <g transform={`translate(-14 ${-200 + bote}) rotate(${-pA})`}>
        <PiernaT color={oscuro} contorno={cont} detalles={det} />
      </g>
      <g transform={`translate(0 ${bote})`}>
        <path d="M 190 -262 L 214 -236 L 232 -244" stroke={cont} strokeWidth={20} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M 190 -262 L 214 -236 L 232 -244" stroke={oscuro} strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <Silueta fill="none" stroke={cont} sw={10} />
        <Silueta fill={piel} stroke="none" sw={0} />
        {det ? (
          <>
            {/* tripa */}
            <path d="M -20 -168 C 40 -150 150 -170 205 -230 C 215 -260 205 -290 190 -300 C 150 -250 60 -200 -40 -192 Z" fill={T.tripa} opacity={0.95} />
            {/* manchas del lomo */}
            {[
              [-40, -330, 24, 12],
              [45, -344, 20, 11],
              [-150, -294, 18, 10],
              [-255, -262, 14, 8],
              [-330, -240, 10, 6],
            ].map(([cx, cy, rx, ry], i) => (
              <ellipse key={i} cx={cx} cy={cy} rx={rx} ry={ry} fill={T.manchas} transform={`rotate(-12 ${cx} ${cy})`} />
            ))}
          </>
        ) : null}

        {/* cabeza: interior de la boca, mandíbula, cráneo */}
        {det ? <ellipse cx={252} cy={-344} rx={84} ry={4 + 34 * (mandibula / 24)} fill="#7A1F2B" /> : null}
        <g transform={`rotate(${mandibula} 168 -350)`}>
          {det
            ? [212, 240, 268, 296].map((tx) => <path key={tx} d={`M ${tx} -350 L ${tx + 8} -366 L ${tx + 16} -350 Z`} fill="#FFFFFF" stroke={cont} strokeWidth={2.5} strokeLinejoin="round" />)
            : null}
          <path d="M 165 -352 L 322 -352 C 336 -350 338 -330 324 -322 C 280 -304 210 -302 175 -316 C 160 -322 158 -340 165 -352 Z" fill={piel} stroke={cont} strokeWidth={5} strokeLinejoin="round" />
          {det ? <path d="M 190 -322 C 230 -312 280 -314 318 -326" stroke={T.tripa} strokeWidth={8} fill="none" strokeLinecap="round" opacity={0.9} /> : null}
        </g>
        <path
          d="M 140 -395 C 140 -450 190 -478 250 -476 C 312 -474 352 -448 356 -410 C 360 -380 350 -356 326 -352 L 170 -348 C 150 -352 140 -370 140 -395 Z"
          fill={piel}
          stroke={cont}
          strokeWidth={5}
          strokeLinejoin="round"
        />
        {det ? (
          <>
            {/* dientes de arriba: asoman un poco aunque tenga la boca cerrada */}
            {[200, 228, 256, 284, 310].map((tx, i) => (
              <path
                key={tx}
                d={`M ${tx} -351 L ${tx + 8} ${-351 + (i % 2 ? 11 : 15) * (0.55 + 0.45 * (mandibula / 24))} L ${tx + 16} -351 Z`}
                fill="#FFFFFF"
                stroke={cont}
                strokeWidth={2.5}
                strokeLinejoin="round"
              />
            ))}
            <path d="M 172 -352 Q 160 -360 166 -372" stroke={cont} strokeWidth={4} fill="none" strokeLinecap="round" />
            <ellipse cx={338} cy={-430} rx={7} ry={4} fill={cont} transform="rotate(-20 338 -430)" />
            <ellipse cx={300} cy={-384} rx={16 + tarareo * 10} ry={9 + tarareo * 8} fill={C.rosaMejillas} opacity={0.5 + tarareo * 0.2} />
            {tarareo > 0.02 ? <ellipse cx={312} cy={-372} rx={24 * tarareo} ry={18 * tarareo} fill={piel} stroke={cont} strokeWidth={4} /> : null}
            <Ojo cx={262} cy={-420} rx={26} ry={30} expresion={expresion} mirada={mirada} apertura={apertura} lado={1} />
            <Ceja cx={262} cy={-462} ancho={34} expresion={expresion} lado={1} grosor={6} />
            <path d="M 175 -440 Q 210 -470 255 -468" stroke="#FFFFFF" strokeWidth={8} fill="none" strokeLinecap="round" opacity={0.3} />
          </>
        ) : null}
        {/* bracito de delante, con dos deditos */}
        <path d="M 180 -258 L 206 -226 L 230 -232" stroke={cont} strokeWidth={22} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M 180 -258 L 206 -226 L 230 -232" stroke={piel} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </g>
      {/* pierna de delante */}
      <g transform={`translate(30 ${-200 + bote}) rotate(${pA})`}>
        <PiernaT color={piel} contorno={cont} detalles={det} />
      </g>
    </g>
  );
};

// ------------------------------------------------------------------ braquiosaurio

const B = {
  piel: "#86A9E8",
  oscuro: "#6487CC",
  tripa: "#DDE8FB",
  manchas: "#7298DB",
};

export const Braquiosaurio: React.FC<DinoBase & { cuello?: number; glup?: number }> = ({
  x,
  y,
  escala = 1,
  voltear = false,
  expresion = "feliz",
  mirada = { x: 0.6, y: 0 },
  boca = 0,
  paso,
  semilla = 6,
  silueta,
  opacidad = 1,
  cuello = 0,
  glup = -1,
}) => {
  const frame = useCurrentFrame();
  const apertura = aperturaOjos(frame, semilla);
  const anda = paso !== undefined;
  const pA = anda ? Math.sin(paso) * 10 : 0;
  const piel = silueta ?? B.piel;
  const oscuro = silueta ?? B.oscuro;
  const cont = silueta ?? C.contorno;
  const det = !silueta;
  const giro = cuello + Math.sin(frame * 0.05 + semilla) * 1.5;

  // bulto que baja por el cuello cuando traga (glup: 0 = cabeza, 1 = cuerpo)
  const g = Math.max(0, Math.min(1, glup));
  const bx = 300 + (160 - 300) * g;
  const by = -730 + (-330 - -730) * g;

  const Pata: React.FC<{ x0: number; ancho: number; color: string; dx?: number }> = ({ x0, ancho, color, dx = 0 }) => (
    <g>
      <path
        d={`M ${x0 - 8} -250 C ${x0 - 14} -170 ${x0 + 4 + dx} -110 ${x0 + 2 + dx} -40 C ${x0 - 4 + dx} -14 ${x0 - 10 + dx} 0 ${x0 + 4 + dx} 0 L ${x0 + ancho + 4 + dx} 0 C ${x0 + ancho + 16 + dx} 0 ${x0 + ancho + 10 + dx} -16 ${x0 + ancho + 4 + dx} -40 C ${x0 + ancho + 2 + dx} -110 ${x0 + ancho + 16} -170 ${x0 + ancho + 10} -250 Z`}
        fill={color}
        stroke={cont}
        strokeWidth={5}
        strokeLinejoin="round"
      />
      {det
        ? [0.25, 0.5, 0.75].map((k) => (
            <path key={k} d={`M ${x0 + dx + ancho * k - 6} -2 Q ${x0 + dx + ancho * k} -14 ${x0 + dx + ancho * k + 6} -2`} fill="#FFFFFF" stroke={cont} strokeWidth={2.5} />
          ))
        : null}
    </g>
  );

  const Cuerpo: React.FC<{ fill: string; stroke: string; sw: number }> = ({ fill, stroke, sw }) => (
    <g fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round">
      <path d="M -150 -300 C -250 -290 -330 -240 -400 -170 C -320 -200 -240 -215 -150 -220 Z" transform={`rotate(${Math.sin(frame * 0.06 + semilla) * 3} -150 -260)`} />
      <ellipse cx={0} cy={-270} rx={195} ry={115} transform="rotate(-14 0 -270)" />
      <g transform={`rotate(${giro} 170 -310)`}>
        <path d="M 110 -340 C 170 -470 210 -620 266 -744 L 334 -726 C 284 -610 246 -460 222 -286 Z" />
        {glup >= 0 ? <ellipse cx={bx - 26} cy={by + 6} rx={30} ry={26} /> : null}
        <ellipse cx={318} cy={-758} rx={60} ry={34} transform="rotate(-8 318 -758)" />
        <ellipse cx={300} cy={-786} rx={30} ry={22} />
      </g>
    </g>
  );

  return (
    <g transform={`translate(${x} ${y}) scale(${escala * (voltear ? -1 : 1)} ${escala})`} opacity={opacidad}>
      {det ? <ellipse cx={0} cy={4} rx={230} ry={18} fill="#000000" opacity={0.15} /> : null}
      <g transform={`rotate(${-pA} 160 -250)`}>
        <Pata x0={118} ancho={56} color={oscuro} />
      </g>
      <g transform={`rotate(${pA} -90 -250)`}>
        <Pata x0={-112} ancho={60} color={oscuro} />
      </g>
      <Cuerpo fill="none" stroke={cont} sw={10} />
      <Cuerpo fill={piel} stroke="none" sw={0} />
      {det ? (
        <>
          <ellipse cx={20} cy={-212} rx={140} ry={58} fill={B.tripa} transform="rotate(-12 20 -212)" opacity={0.95} />
          {[
            [-60, -350, 24, 12],
            [30, -372, 22, 11],
            [-150, -322, 18, 10],
            [-250, -262, 12, 7],
          ].map(([cx, cy, rx, ry], i) => (
            <ellipse key={i} cx={cx} cy={cy} rx={rx} ry={ry} fill={B.manchas} transform={`rotate(-14 ${cx} ${cy})`} />
          ))}
          <g transform={`rotate(${giro} 170 -310)`}>
            {[0.2, 0.42, 0.64].map((k) => {
              const px = 300 + (160 - 300) * k;
              const py = -730 + (-330 - -730) * k;
              return <ellipse key={k} cx={px - 18} cy={py} rx={12} ry={8} fill={B.manchas} transform={`rotate(-62 ${px - 18} ${py})`} />;
            })}
            {/* boca: se abre un poco para comer; dientes en forma de cuchara */}
            {boca > 0.05 ? (
              <g>
                <path d={`M 338 -744 L 374 -750 L 372 ${-742 + boca * 14} Z`} fill="#7A1F2B" stroke={cont} strokeWidth={3} strokeLinejoin="round" />
                {[346, 356, 366].map((tx) => (
                  <rect key={tx} x={tx - 3} y={-750} width={7} height={8} rx={3.5} fill="#FFFFFF" stroke={cont} strokeWidth={1.5} />
                ))}
              </g>
            ) : (
              <path d="M 340 -746 Q 358 -740 374 -750" stroke={cont} strokeWidth={4} fill="none" strokeLinecap="round" />
            )}
            <ellipse cx={366} cy={-772} rx={4} ry={3} fill={cont} />
            <ellipse cx={344} cy={-752} rx={10} ry={6} fill={C.rosaMejillas} opacity={0.5} />
            <Ojo cx={314} cy={-770} rx={12} ry={14} expresion={expresion} mirada={mirada} apertura={apertura} lado={1} grosor={3} />
            <Ceja cx={314} cy={-791} ancho={18} expresion={expresion} lado={1} grosor={4} />
          </g>
        </>
      ) : null}
      <g transform={`rotate(${pA} 160 -250)`}>
        <Pata x0={140} ancho={58} color={piel} dx={4} />
      </g>
      <g transform={`rotate(${-pA} -90 -250)`}>
        <Pata x0={-136} ancho={66} color={piel} dx={-4} />
      </g>
    </g>
  );
};

// ------------------------------------------------------------------ de dinosaurio a ave

/**
 * Dinosaurio pequeño con plumas. `ave` va de 0 (dinosaurio: hocico con
 * dientes, cola larga, bracitos con garras) a 1 (pájaro: pico, cola corta y
 * alas). Sirve para enseñar, generación a generación, cómo cambió.
 */
export const DinoPlumas: React.FC<DinoBase & { ave?: number; color?: string; colorClaro?: string }> = ({
  x,
  y,
  escala = 1,
  voltear = false,
  expresion = "feliz",
  mirada = { x: 0.5, y: 0 },
  paso,
  semilla = 8,
  silueta,
  opacidad = 1,
  ave = 0,
  color = "#F28C38",
  colorClaro = "#FFD08A",
}) => {
  const frame = useCurrentFrame();
  const apertura = aperturaOjos(frame, semilla);
  const anda = paso !== undefined;
  const pA = anda ? Math.sin(paso) * 22 : 0;
  const bote = anda ? Math.abs(Math.cos(paso)) * -5 : 0;
  const piel = silueta ?? color;
  const cont = silueta ?? C.contorno;
  const det = !silueta;
  const largoCola = 210 - 130 * ave;
  const hocico = 62 - 28 * ave; // de hocico largo a pico corto
  const ala = 0.55 + 0.6 * ave;
  const colaPlumas = Array.from({ length: 5 }, (_, i) => i);

  const Pata: React.FC<{ ang: number; tono: string }> = ({ ang, tono }) => (
    <g transform={`rotate(${ang} 0 -62)`}>
      <path d="M 0 -62 L 6 -26 L -2 0" stroke={cont} strokeWidth={13} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 0 -62 L 6 -26 L -2 0" stroke={tono} strokeWidth={7} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {[
        [-2, 0, 26, 0],
        [-2, 0, 18, -8],
        [-2, 0, -14, -4],
      ].map(([x1, y1, x2, y2], i) => (
        <path key={i} d={`M ${x1} ${y1} L ${x2} ${y2}`} stroke={cont} strokeWidth={7} strokeLinecap="round" />
      ))}
    </g>
  );

  return (
    <g transform={`translate(${x} ${y}) scale(${escala * (voltear ? -1 : 1)} ${escala})`} opacity={opacidad}>
      {det ? <ellipse cx={0} cy={3} rx={70} ry={9} fill="#000000" opacity={0.15} /> : null}
      <Pata ang={-pA} tono={silueta ?? "#E07A2E"} />
      <g transform={`translate(0 ${bote})`}>
        {/* cola: larga con plumas (dinosaurio) o corta en abanico (pájaro) */}
        <g transform={`rotate(${Math.sin(frame * 0.09 + semilla) * 4} -40 -100)`}>
          <path
            d={`M -40 -118 C ${-40 - largoCola * 0.5} -128 ${-40 - largoCola * 0.85} -122 ${-40 - largoCola} -110 C ${-40 - largoCola * 0.85} -98 ${-40 - largoCola * 0.5} -86 -40 -82 Z`}
            fill={piel}
            stroke={cont}
            strokeWidth={5}
            strokeLinejoin="round"
          />
          {det
            ? colaPlumas.map((i) => {
                const k = 0.45 + i * 0.13;
                const px = -40 - largoCola * k;
                return <path key={i} d={`M ${px} -112 q -16 -18 -34 -10 q 12 12 30 22 Z`} fill={colorClaro} stroke={cont} strokeWidth={3} strokeLinejoin="round" />;
              })
            : null}
        </g>
        {/* cuerpo */}
        <ellipse cx={0} cy={-102} rx={64} ry={48} fill={piel} stroke={cont} strokeWidth={5} />
        {det ? <ellipse cx={14} cy={-86} rx={40} ry={26} fill={colorClaro} /> : null}
        {/* cuello y cabeza */}
        <path d="M 30 -132 C 46 -160 60 -176 76 -184 L 98 -160 C 80 -150 64 -136 54 -112 Z" fill={piel} stroke={cont} strokeWidth={5} strokeLinejoin="round" />
        <ellipse cx={84} cy={-176} rx={34} ry={30} fill={piel} stroke={cont} strokeWidth={5} />
        {/* hocico con dientecitos, que se convierte en pico */}
        <path
          d={`M 104 -186 C ${110 + hocico * 0.4} -190 ${104 + hocico} -180 ${104 + hocico} -170 C ${100 + hocico} -160 ${110 + hocico * 0.3} -158 104 -160 Z`}
          fill={mezclar(silueta ?? color, silueta ?? "#FFC23D", ave)}
          stroke={cont}
          strokeWidth={4}
          strokeLinejoin="round"
        />
        {det ? <path d={`M 106 -168 L ${100 + hocico} -170`} stroke={cont} strokeWidth={3.5} strokeLinecap="round" opacity={0.8} /> : null}
        {det && ave < 0.7
          ? [0.3, 0.5, 0.7, 0.88].map((k) => (
              <path key={k} d={`M ${104 + hocico * k - 4} -169 L ${104 + hocico * k} -159 L ${104 + hocico * k + 4} -169 Z`} fill="#FFFFFF" stroke={cont} strokeWidth={1.5} opacity={1 - ave / 0.7} />
            ))
          : null}
        {/* cresta de plumas */}
        {det
          ? [
              [70, -204, -30],
              [80, -208, -10],
              [90, -206, 10],
            ].map(([cx, cy, r], i) => <ellipse key={i} cx={cx} cy={cy} rx={6} ry={16} fill={colorClaro} stroke={cont} strokeWidth={3} transform={`rotate(${r} ${cx} ${cy})`} />)
          : null}
        {det ? (
          <>
            <Ojo cx={88} cy={-182} rx={11} ry={12} expresion={expresion} mirada={mirada} apertura={apertura} lado={1} grosor={3} />
            <ellipse cx={100} cy={-164} rx={7} ry={4} fill={C.rosaMejillas} opacity={0.5} />
          </>
        ) : null}
        {/* brazo con plumas → ala */}
        <g transform={`translate(18 -112) rotate(${-15 + Math.sin(frame * 0.12 + semilla) * 4})`}>
          <path d={`M 0 0 C ${-40 * ala} ${10 * ala} ${-70 * ala} ${40 * ala} ${-80 * ala} ${60 * ala} C ${-50 * ala} ${54 * ala} ${-20 * ala} ${40 * ala} 8 ${20 * ala} Z`} fill={silueta ?? mezclar(color, "#C4621F", 0.35)} stroke={cont} strokeWidth={4} strokeLinejoin="round" />
          {det && ave < 0.6
            ? [0, 1].map((i) => <path key={i} d={`M ${6 + i * 6} ${18 * ala} l 6 10`} stroke={cont} strokeWidth={4} strokeLinecap="round" opacity={1 - ave / 0.6} />)
            : null}
        </g>
      </g>
      <Pata ang={pA} tono={silueta ?? "#F29B4B"} />
    </g>
  );
};

// ------------------------------------------------------------------ aves de hoy

export const Gallina: React.FC<DinoBase> = ({ x, y, escala = 1, voltear = false, expresion = "feliz", mirada = { x: 0.5, y: 0 }, paso, semilla = 9, opacidad = 1 }) => {
  const frame = useCurrentFrame();
  const apertura = aperturaOjos(frame, semilla);
  const anda = paso !== undefined;
  const pA = anda ? Math.sin(paso) * 24 : 0;
  const cabeceo = anda ? Math.sin(paso * 2) * 6 : Math.sin(frame * 0.1) * 2;
  const Pata: React.FC<{ ang: number; dx: number }> = ({ ang, dx }) => (
    <g transform={`translate(${dx} 0) rotate(${ang} 0 -48)`}>
      <path d="M 0 -48 L 0 -2" stroke={C.contorno} strokeWidth={12} strokeLinecap="round" />
      <path d="M 0 -48 L 0 -2" stroke="#F5A623" strokeWidth={6} strokeLinecap="round" />
      {[
        [26, 0],
        [16, -6],
        [-12, -2],
      ].map(([x2, y2], i) => (
        <path key={i} d={`M 0 -2 L ${x2} ${y2}`} stroke={C.contorno} strokeWidth={6} strokeLinecap="round" />
      ))}
    </g>
  );
  return (
    <g transform={`translate(${x} ${y}) scale(${escala * (voltear ? -1 : 1)} ${escala})`} opacity={opacidad}>
      <ellipse cx={0} cy={3} rx={64} ry={9} fill="#000000" opacity={0.15} />
      <Pata ang={-pA} dx={-8} />
      {/* cola */}
      <path d="M -50 -96 C -80 -130 -86 -160 -70 -168 C -50 -150 -40 -126 -28 -104 Z" fill="#FFFFFF" stroke={C.contorno} strokeWidth={5} strokeLinejoin="round" />
      <ellipse cx={0} cy={-84} rx={62} ry={48} fill="#FFFFFF" stroke={C.contorno} strokeWidth={5} />
      <path d="M -26 -96 C -10 -74 30 -70 44 -86 C 30 -60 -10 -58 -26 -96 Z" fill="#EDE7F6" stroke={C.contorno} strokeWidth={3.5} strokeLinejoin="round" />
      <g transform={`rotate(${cabeceo} 40 -110)`}>
        <path d="M 30 -112 C 38 -134 46 -146 56 -150 L 70 -128 C 62 -120 56 -110 54 -96 Z" fill="#FFFFFF" stroke={C.contorno} strokeWidth={5} strokeLinejoin="round" />
        <circle cx={58} cy={-148} r={26} fill="#FFFFFF" stroke={C.contorno} strokeWidth={5} />
        {/* cresta y barbilla */}
        <path d="M 42 -170 q 4 -16 12 -6 q 4 -16 12 -4 q 8 -12 10 4 q -14 4 -34 6 Z" fill="#E63946" stroke={C.contorno} strokeWidth={3.5} strokeLinejoin="round" />
        <path d="M 78 -138 L 98 -132 L 78 -126 Z" fill="#FFC23D" stroke={C.contorno} strokeWidth={3.5} strokeLinejoin="round" />
        <ellipse cx={76} cy={-118} rx={6} ry={10} fill="#E63946" stroke={C.contorno} strokeWidth={3} />
        <Ojo cx={64} cy={-154} rx={8} ry={9} expresion={expresion} mirada={mirada} apertura={apertura} lado={1} grosor={3} />
      </g>
      <Pata ang={pA} dx={10} />
    </g>
  );
};

export const Paloma: React.FC<DinoBase> = ({ x, y, escala = 1, voltear = false, expresion = "feliz", mirada = { x: 0.5, y: 0 }, paso, semilla = 10, opacidad = 1 }) => {
  const frame = useCurrentFrame();
  const apertura = aperturaOjos(frame, semilla);
  const anda = paso !== undefined;
  const pA = anda ? Math.sin(paso) * 22 : 0;
  const cabeceo = anda ? Math.sin(paso * 2) * 8 : Math.sin(frame * 0.09) * 2;
  const Pata: React.FC<{ ang: number; dx: number }> = ({ ang, dx }) => (
    <g transform={`translate(${dx} 0) rotate(${ang} 0 -34)`}>
      <path d="M 0 -34 L 0 -2" stroke={C.contorno} strokeWidth={11} strokeLinecap="round" />
      <path d="M 0 -34 L 0 -2" stroke="#F26B6B" strokeWidth={5} strokeLinecap="round" />
      {[
        [24, 0],
        [15, -6],
        [-12, -2],
      ].map(([x2, y2], i) => (
        <path key={i} d={`M 0 -2 L ${x2} ${y2}`} stroke={C.contorno} strokeWidth={5.5} strokeLinecap="round" />
      ))}
    </g>
  );
  return (
    <g transform={`translate(${x} ${y}) scale(${escala * (voltear ? -1 : 1)} ${escala})`} opacity={opacidad}>
      <ellipse cx={0} cy={3} rx={58} ry={8} fill="#000000" opacity={0.15} />
      <Pata ang={-pA} dx={-8} />
      <path d="M -40 -70 L -100 -58 L -96 -44 L -36 -50 Z" fill="#8A86B5" stroke={C.contorno} strokeWidth={4.5} strokeLinejoin="round" />
      <ellipse cx={0} cy={-64} rx={56} ry={38} fill="#ABA8D1" stroke={C.contorno} strokeWidth={5} />
      <path d="M -40 -76 C -10 -96 34 -88 40 -66 C 20 -50 -20 -48 -40 -76 Z" fill="#9591C2" stroke={C.contorno} strokeWidth={3.5} />
      <path d="M -30 -70 l 30 -4 M -24 -62 l 30 -4" stroke="#5E5A8C" strokeWidth={5} strokeLinecap="round" />
      <g transform={`rotate(${cabeceo} 36 -90)`}>
        <path d="M 22 -86 C 30 -106 38 -116 48 -120 L 62 -98 C 54 -92 48 -82 46 -70 Z" fill="#7FC8A9" stroke={C.contorno} strokeWidth={5} strokeLinejoin="round" />
        <path d="M 28 -92 C 36 -100 44 -104 52 -104" stroke="#B48CD8" strokeWidth={8} strokeLinecap="round" opacity={0.8} />
        <circle cx={52} cy={-122} r={20} fill="#ABA8D1" stroke={C.contorno} strokeWidth={5} />
        <path d="M 68 -124 L 84 -118 L 68 -114 Z" fill="#4A4060" stroke={C.contorno} strokeWidth={3} strokeLinejoin="round" />
        <ellipse cx={68} cy={-126} rx={4} ry={3} fill="#FFFFFF" />
        <Ojo cx={56} cy={-128} rx={7} ry={8} expresion={expresion} mirada={mirada} apertura={apertura} lado={1} grosor={3} />
      </g>
      <Pata ang={pA} dx={10} />
    </g>
  );
};
