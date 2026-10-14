import React from "react";
import { AbsoluteFill, spring, useVideoConfig } from "remotion";
import { C, FUENTE_TEXTO, FUENTE_TITULO } from "../../../marca";
import { EscenaColocada } from "../../../comun/tiempo";
import { Fx, MusicaEscena, useEscena, VocesEscena } from "../../../comun/Sonido";
import { Iris } from "../../../comun/Rotulos";
import { HuellaDino } from "../../../escenario/Huellas";
import { RelojArena } from "../../../escenario/Cosas";
import { DinoPlumas, Tiranosaurio } from "../../../escenario/Dinos";
import { Lechuza } from "../../../personajes/Lechuza";
import { COLOR_ROCA, usePalabra } from "../mundo";

const Tarjeta: React.FC<{ x: number; n: number; titulo: string; visible: number; children: React.ReactNode }> = ({ x, n, titulo, visible, children }) => (
  <g transform={`translate(${x} 560) scale(${visible}) rotate(${(1 - visible) * -8})`} opacity={Math.min(1, visible * 1.5)}>
    <rect x={-270} y={-300} width={540} height={600} rx={44} fill="#FFFFFF" stroke={C.contorno} strokeWidth={7} />
    <defs>
      <clipPath id={`rep-marco-${n}`}>
        <rect x={-240} y={-270} width={480} height={380} rx={30} />
      </clipPath>
    </defs>
    <rect x={-240} y={-270} width={480} height={380} rx={30} fill="#FFE9C2" />
    {/* el dibujo no se sale del marco aunque una cola sea larga */}
    <g clipPath={`url(#rep-marco-${n})`}>
      <g transform="translate(0 -80)">{children}</g>
    </g>
    <circle cx={-250} cy={-280} r={50} fill={C.luzAmarilla} stroke={C.contorno} strokeWidth={6} />
    <text x={-250} y={-262} textAnchor="middle" fontFamily={FUENTE_TITULO} fontWeight={800} fontSize={60} fill={C.texto}>
      {n}
    </text>
    {/* «\n» parte el título: en una línea, «Las aves vienen de los dinosaurios» se salía de la tarjeta */}
    {titulo.split("\n").map((linea, i, todas) => (
      <text key={i} x={0} y={200 + (i - (todas.length - 1) / 2) * 50} textAnchor="middle" fontFamily={FUENTE_TEXTO} fontWeight={700} fontSize={44} fill={C.texto}>
        {linea}
      </text>
    ))}
  </g>
);

// Repaso: tres ideas y nada más (recordar lo aprendido es lo que lo fija).
export const E08Repaso: React.FC<{ escena: EscenaColocada }> = ({ escena }) => {
  const { frame, ini } = useEscena(escena);
  const { fps } = useVideoConfig();
  const pal = usePalabra(escena);
  const ap = (id: string) => spring({ frame: frame - (ini(id) - 8), fps, config: { damping: 12, stiffness: 120 } });
  const giro = Math.min(360, Math.max(0, (frame - ini("l057")) * 4));

  return (
    <AbsoluteFill>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080">
        <rect x={0} y={0} width={1920} height={1080} fill="#FFF3D6" />
        {Array.from({ length: 30 }, (_, i) => (
          <circle key={i} cx={(i * 263) % 1920} cy={(i * 151) % 1080} r={10 + (i % 4) * 6} fill={[C.luzAmarilla, C.luzTurquesa, C.luzRosa][i % 3]} opacity={0.18} />
        ))}
        <text x={960} y={150} textAnchor="middle" fontFamily={FUENTE_TITULO} fontWeight={800} fontSize={96} fill={C.texto}>
          ¡Repasamos!
        </text>
        <Tarjeta x={350} n={1} titulo="Un fósil es piedra" visible={ap("l057")}>
          <rect x={-200} y={-150} width={400} height={300} rx={30} fill={COLOR_ROCA} />
          <HuellaDino x={-30} y={110} escala={0.9} fondo={COLOR_ROCA} id="rep-fosil" />
          <RelojArena x={140} y={-70} escala={0.45} giro={giro} arena={0.5 + 0.5 * Math.cos((giro / 180) * Math.PI)} />
        </Tarjeta>
        <Tarjeta x={960} n={2} titulo="Comía carne" visible={ap("l058")}>
          <rect x={-240} y={60} width={480} height={90} fill="#9BD27A" />
          <Tiranosaurio x={10} y={110} escala={0.42} paso={frame >= pal("l058", "dos") ? frame * 0.2 : undefined} />
          <HuellaDino x={-150} y={-60} escala={0.35} modo="icono" color="#8B5A2B" id="rep-icono" />
        </Tarjeta>
        <Tarjeta x={1570} n={3} titulo={"Las aves vienen\nde los dinosaurios"} visible={ap("l059")}>
          <DinoPlumas x={-85} y={120} escala={0.55} ave={0} color="#6CC56F" colorClaro="#FFE29A" />
          <path d="M -10 0 L 30 0 M 18 -14 L 32 0 L 18 14" stroke={C.contorno} strokeWidth={8} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <Lechuza x={130} y={140} escala={0.55} expresion="contento" />
        </Tarjeta>
        <Iris duracion={escena.duracion} entrada={14} salida={16} />
      </svg>
      <VocesEscena escena={escena} />
      <MusicaEscena pista="repaso" escena={escena} volumen={0.15} />
      <Fx efecto="pop" en={ini("l057") - 8} volumen={0.4} />
      <Fx efecto="pop" en={ini("l058") - 8} volumen={0.4} />
      <Fx efecto="pop" en={ini("l059") - 8} volumen={0.4} />
    </AbsoluteFill>
  );
};
