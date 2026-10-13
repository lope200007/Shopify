import React from "react";
import { AbsoluteFill, spring, useVideoConfig } from "remotion";
import { C, FUENTE_TEXTO, FUENTE_TITULO } from "../../../marca";
import { EscenaColocada } from "../../../comun/tiempo";
import { Fx, MusicaEscena, useEscena, VocesEscena } from "../../../comun/Sonido";
import { Iris } from "../../../comun/Rotulos";
import { BolaIluminada, LunaFase } from "../../../escenario/Luna";
import { Sol, Tierra } from "../../../escenario/Espacio";

const Tarjeta: React.FC<{ x: number; n: number; titulo: string; visible: number; children: React.ReactNode }> = ({ x, n, titulo, visible, children }) => (
  <g transform={`translate(${x} 560) scale(${visible}) rotate(${(1 - visible) * -8})`} opacity={Math.min(1, visible * 1.5)}>
    <rect x={-270} y={-300} width={540} height={600} rx={44} fill="#FFFFFF" stroke={C.contorno} strokeWidth={7} />
    <rect x={-240} y={-270} width={480} height={380} rx={30} fill="#1A1450" />
    <g transform="translate(0 -80)">{children}</g>
    <circle cx={-250} cy={-280} r={50} fill={C.luzAmarilla} stroke={C.contorno} strokeWidth={6} />
    <text x={-250} y={-262} textAnchor="middle" fontFamily={FUENTE_TITULO} fontWeight={800} fontSize={60} fill={C.texto}>
      {n}
    </text>
    <text x={0} y={200} textAnchor="middle" fontFamily={FUENTE_TEXTO} fontWeight={700} fontSize={44} fill={C.texto}>
      {titulo}
    </text>
  </g>
);

export const E07Repaso: React.FC<{ escena: EscenaColocada }> = ({ escena }) => {
  const { frame, ini } = useEscena(escena);
  const { fps } = useVideoConfig();
  const ap = (id: string) => spring({ frame: frame - (ini(id) - 8), fps, config: { damping: 12, stiffness: 120 } });
  const giro = (frame / 90) * 2 * Math.PI;

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
        <Tarjeta x={350} n={1} titulo="La ilumina el Sol" visible={ap("l055")}>
          <Sol x={-120} y={0} r={60} cara={false} />
          <BolaIluminada x={110} y={0} r={70} angLuz={180} id="rep-bola" />
        </Tarjeta>
        <Tarjeta x={960} n={2} titulo="Da vueltas a la Tierra" visible={ap("l056")}>
          <ellipse cx={0} cy={0} rx={170} ry={70} fill="none" stroke="#FFFFFF" strokeWidth={4} strokeDasharray="4 16" strokeLinecap="round" opacity={0.7} />
          <Tierra x={0} y={0} r={62} id="rep-tierra" giro={frame / 300} />
          <circle cx={170 * Math.cos(giro)} cy={70 * Math.sin(giro)} r={22} fill="#F3EEDB" stroke={C.contorno} strokeWidth={4} />
        </Tarjeta>
        <Tarjeta x={1570} n={3} titulo="¡Nunca se rompe!" visible={ap("l057")}>
          <LunaFase x={-140} y={0} r={58} fase={0.5} id="rep-llena" brilloHalo={0.3} />
          <LunaFase x={0} y={0} r={58} fase={0.75} id="rep-cuarto" brilloHalo={0.3} />
          <LunaFase x={140} y={0} r={58} fase={0.0} id="rep-nueva" brilloHalo={0.3} />
        </Tarjeta>
        <Iris duracion={escena.duracion} entrada={14} salida={16} />
      </svg>
      <VocesEscena escena={escena} />
      <MusicaEscena pista="repaso" escena={escena} volumen={0.15} />
      <Fx efecto="pop" en={ini("l055") - 8} volumen={0.4} />
      <Fx efecto="pop" en={ini("l056") - 8} volumen={0.4} />
      <Fx efecto="pop" en={ini("l057") - 8} volumen={0.4} />
    </AbsoluteFill>
  );
};
