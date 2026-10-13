import React from "react";
import { useCurrentFrame } from "remotion";
import { C } from "../marca";
import { LunaFase } from "./Luna";

/** El gran árbol de Doña Lechuza, visto desde fuera, de noche. */
export const ArbolLechuzaFuera: React.FC<{ suelo?: number; luzVentana?: number }> = ({ suelo = 900, luzVentana = 1 }) => {
  const frame = useCurrentFrame();
  const parpadeo = 0.9 + 0.1 * Math.sin(frame * 0.3) * Math.sin(frame * 0.07);
  return (
    <g>
      {/* copa enorme */}
      <g>
        {[
          [760, 170, 210],
          [1120, 150, 230],
          [940, 60, 220],
          [600, 300, 150],
          [1300, 300, 160],
        ].map(([cx, cy, r], i) => (
          <circle key={i} cx={cx} cy={cy} r={r} fill={i % 2 ? "#2F7D5B" : "#38916A"} stroke={C.contorno} strokeWidth={6} />
        ))}
        <circle cx={950} cy={190} r={240} fill="#38916A" />
        <path d="M 760 30 Q 860 -40 980 -20" stroke="#5FBF8C" strokeWidth={22} strokeLinecap="round" fill="none" opacity={0.5} />
      </g>
      {/* tronco */}
      <path
        d={`M 760 ${suelo + 20} Q 800 600 820 330 L 1080 330 Q 1100 600 1160 ${suelo + 20} Z`}
        fill="#7A4E32"
        stroke={C.contorno}
        strokeWidth={6}
        strokeLinejoin="round"
      />
      <path d="M 860 420 Q 850 600 870 820" stroke="#5E3A24" strokeWidth={8} fill="none" opacity={0.6} />
      <path d="M 1040 380 Q 1060 560 1050 760" stroke="#5E3A24" strokeWidth={8} fill="none" opacity={0.6} />
      {/* ventana redonda */}
      <circle cx={960} cy={500} r={78} fill="#5E3A24" stroke={C.contorno} strokeWidth={6} />
      <circle cx={960} cy={500} r={62} fill="#FFD27A" opacity={luzVentana * parpadeo} />
      <circle cx={960} cy={500} r={140} fill="#FFD27A" opacity={0.18 * luzVentana} />
      <path d="M 960 438 L 960 562 M 898 500 L 1022 500" stroke="#5E3A24" strokeWidth={8} />
      {/* puerta */}
      <path d={`M 900 ${suelo + 6} L 900 760 Q 960 700 1020 760 L 1020 ${suelo + 6} Z`} fill="#5E3A24" stroke={C.contorno} strokeWidth={6} />
      <circle cx={1004} cy={830} r={7} fill={C.luzAmarilla} />
      {/* rama donde se asoma la lechuza */}
      <path d="M 1100 600 Q 1250 590 1380 560" stroke="#7A4E32" strokeWidth={34} strokeLinecap="round" fill="none" />
      <path d="M 1100 600 Q 1250 590 1380 560" stroke={C.contorno} strokeWidth={46} strokeLinecap="round" fill="none" opacity={0.0} />
      <path d="M 1300 570 q 30 -40 70 -30" stroke="#38916A" strokeWidth={18} strokeLinecap="round" fill="none" />
    </g>
  );
};

/**
 * Dentro del árbol. `lampara` 1 = encendida, 0 = apagada (todo a oscuras
 * menos la luz de Farolín, que la pinta la escena).
 */
export const InteriorArbol: React.FC<{ lampara?: number; faseVentana?: number }> = ({ lampara = 1, faseVentana = 0.75 }) => {
  const frame = useCurrentFrame();
  const llama = 0.92 + 0.08 * Math.sin(frame * 0.35) * Math.cos(frame * 0.13);
  return (
    <g>
      <defs>
        <radialGradient id="interior-luz" cx="50%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#FFE3A8" />
          <stop offset="100%" stopColor="#B9774A" />
        </radialGradient>
        <linearGradient id="interior-suelo" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8A5636" />
          <stop offset="100%" stopColor="#6B3F26" />
        </linearGradient>
      </defs>
      {/* paredes de madera (redondeadas como el hueco de un tronco) */}
      <rect x={0} y={0} width={1920} height={1080} fill="url(#interior-luz)" />
      {Array.from({ length: 9 }, (_, i) => (
        <path key={i} d={`M ${i * 240 + 40} 0 Q ${i * 240 + 70} 400 ${i * 240 + 30} 820`} stroke="#A0653F" strokeWidth={6} fill="none" opacity={0.45} />
      ))}
      <path d="M 0 0 L 0 1080 L 120 1080 Q 40 540 160 0 Z" fill="#7A4E32" opacity={0.7} />
      <path d="M 1920 0 L 1920 1080 L 1800 1080 Q 1880 540 1760 0 Z" fill="#7A4E32" opacity={0.7} />
      {/* suelo */}
      <path d="M 0 820 Q 960 780 1920 820 L 1920 1080 L 0 1080 Z" fill="url(#interior-suelo)" stroke={C.contorno} strokeWidth={6} />
      {/* ventana redonda con la noche y la luna */}
      <g>
        <circle cx={1500} cy={260} r={130} fill="#5E3A24" stroke={C.contorno} strokeWidth={6} />
        <circle cx={1500} cy={260} r={112} fill={C.nocheAbajo} />
        <circle cx={1450} cy={230} r={3} fill="#fff" />
        <circle cx={1550} cy={300} r={2.5} fill="#fff" />
        <circle cx={1530} cy={200} r={2} fill="#fff" />
        <LunaFase x={1515} y={255} r={46} fase={faseVentana} id="luna-ventana" brilloHalo={0.4} />
        <path d="M 1500 148 L 1500 372 M 1388 260 L 1612 260" stroke="#5E3A24" strokeWidth={10} />
      </g>
      {/* estantería con libros */}
      <g transform="translate(220 250)">
        <rect x={0} y={0} width={300} height={16} fill="#5E3A24" stroke={C.contorno} strokeWidth={4} />
        {[
          ["#E63946", 30, 90],
          ["#457B9D", 64, 110],
          ["#F4A261", 100, 80],
          ["#2A9D8F", 130, 100],
          ["#8E7DBE", 168, 95],
        ].map(([c, x, h], i) => (
          <rect key={i} x={x as number} y={-(h as number)} width={30} height={h as number} fill={c as string} stroke={C.contorno} strokeWidth={4} rx={4} />
        ))}
        <circle cx={250} cy={-34} r={30} fill="#9AD1F5" stroke={C.contorno} strokeWidth={4} />
        <path d="M 226 -40 Q 250 -60 274 -40" stroke="#4CAF50" strokeWidth={6} fill="none" />
      </g>
      {/* lámpara de pie */}
      <g transform="translate(1720 820)">
        <path d="M -6 0 L -6 -360 L 6 -360 L 6 0 Z" fill="#5E3A24" stroke={C.contorno} strokeWidth={4} />
        <ellipse cx={0} cy={0} rx={50} ry={12} fill="#5E3A24" stroke={C.contorno} strokeWidth={4} />
        <path d="M -70 -360 L 70 -360 L 40 -450 L -40 -450 Z" fill="#F7C873" stroke={C.contorno} strokeWidth={5} strokeLinejoin="round" />
        <circle cx={0} cy={-370} r={160} fill="#FFE3A8" opacity={0.35 * lampara * llama} />
      </g>
      {/* oscuridad cuando se apaga la lámpara */}
      <rect x={0} y={0} width={1920} height={1080} fill="#0B0820" opacity={0.86 * (1 - lampara)} />
    </g>
  );
};
