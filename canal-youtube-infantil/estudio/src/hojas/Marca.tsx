import React from "react";
import { AbsoluteFill } from "remotion";
import { C, cargarFuentes, FUENTE_TEXTO, FUENTE_TITULO } from "../marca";
import { CieloNoche, BosqueNoche, LucesFlotantes } from "../escenario/Bosque";
import { LunaFase } from "../escenario/Luna";
import { Farolin } from "../personajes/Farolin";
import { Galleta } from "../personajes/Galleta";
import { Lechuza } from "../personajes/Lechuza";
import { POSES } from "../personajes/cara";
import { Logo } from "../comun/Rotulos";
import { HuellaDino } from "../escenario/Huellas";

cargarFuentes();

/**
 * Miniatura del episodio 1 (1280×720, se renderiza al 150 %).
 * Enseña lo que pasa en el vídeo (la media luna con el trozo «que falta»),
 * una cara con emoción clara y dos palabras. La esquina de abajo a la
 * derecha queda libre: ahí YouTube pone la duración.
 */
export const Miniatura01: React.FC = () => (
  <AbsoluteFill>
    <svg width={1280} height={720} viewBox="0 0 1280 720">
      <CieloNoche alto={720} estrellas={70} />
      <LunaFase x={940} y={320} r={250} fase={0.75} id="mini-luna" brilloHalo={0.9} />
      <circle cx={940} cy={320} r={250} fill="none" stroke="#FFF4C2" strokeWidth={10} strokeDasharray="30 20" opacity={0.95} />
      <Galleta x={290} y={960} escala={1.2} expresion="sorprendido" brazos={POSES.manosCara} mirada={{ x: 1, y: -0.9 }} parpadea={false} />
      <Farolin x={575} y={560} escala={0.85} expresion="sorprendido" luz="amarilla" brillo={1.2} mirada={{ x: 1, y: -0.6 }} parpadea={false} idPrefijo="mini-f" />
      <g transform="translate(40 0)">
        {["¿SE", "ROMPE?"].map((t, i) => (
          <text key={t} x={0} y={150 + i * 135} fontFamily={FUENTE_TITULO} fontWeight={800} fontSize={142} fill={C.luzAmarilla} stroke={C.contorno} strokeWidth={18} paintOrder="stroke" strokeLinejoin="round">
            {t}
          </text>
        ))}
      </g>
    </svg>
  </AbsoluteFill>
);

/**
 * Miniatura del episodio 2 (1280×720, al 150 %). Contraste de tamaño: la
 * huella gigante y Galleta pequeñita a su lado, con cara de sorpresa. Es lo
 * que pasa en el vídeo (la encuentran junto al río). Tres palabras y la
 * esquina de abajo a la derecha libre para la duración.
 */
export const Miniatura02: React.FC = () => (
  <AbsoluteFill>
    <svg width={1280} height={720} viewBox="0 0 1280 720">
      <defs>
        <radialGradient id="mini2-luz" cx="62%" cy="45%" r="60%">
          <stop offset="0%" stopColor="#FFE9B0" />
          <stop offset="55%" stopColor="#E9C994" />
          <stop offset="100%" stopColor="#C9A06A" />
        </radialGradient>
      </defs>
      <rect width={1280} height={720} fill="url(#mini2-luz)" />
      {Array.from({ length: 40 }, (_, i) => (
        <circle key={i} cx={(i * 211) % 1280} cy={(i * 137) % 720} r={3 + (i % 3) * 2} fill="#B8935F" opacity={0.45} />
      ))}
      <HuellaDino x={860} y={650} escala={2.2} fondo="#E9C994" id="mini2-huella" />
      <Galleta x={500} y={705} escala={0.78} expresion="sorprendido" brazos={POSES.manosCara} mirada={{ x: 1, y: -0.6 }} parpadea={false} />
      <Farolin x={1110} y={210} escala={0.72} expresion="sorprendido" luz="amarilla" brillo={1.3} mirada={{ x: -0.8, y: 0.8 }} voltear parpadea={false} idPrefijo="mini2-f" />
      <g transform="translate(36 0)">
        {["¿DE QUIÉN", "ES?"].map((t, i) => (
          <text key={t} x={0} y={140 + i * 128} fontFamily={FUENTE_TITULO} fontWeight={800} fontSize={124} fill={C.luzAmarilla} stroke={C.contorno} strokeWidth={17} paintOrder="stroke" strokeLinejoin="round">
            {t}
          </text>
        ))}
      </g>
    </svg>
  </AbsoluteFill>
);

/** Foto de perfil del canal (800×800; YouTube la recorta en círculo). */
export const Avatar: React.FC = () => (
  <AbsoluteFill>
    <svg width={800} height={800} viewBox="0 0 800 800">
      <defs>
        <radialGradient id="avatar-fondo" cx="50%" cy="40%">
          <stop offset="0%" stopColor="#4A3AA8" />
          <stop offset="100%" stopColor={C.nocheArriba} />
        </radialGradient>
      </defs>
      <rect width={800} height={800} fill="url(#avatar-fondo)" />
      {[
        [130, 170, 5],
        [660, 140, 4],
        [600, 640, 5],
        [170, 600, 4],
        [700, 420, 3],
        [100, 400, 3],
      ].map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill="#FFFFFF" opacity={0.8} />
      ))}
      <Farolin x={400} y={500} escala={2.6} expresion="feliz" luz="amarilla" brillo={1.3} volando={false} parpadea={false} brazos={POSES.saludo} idPrefijo="avatar-f" />
    </svg>
  </AbsoluteFill>
);

/**
 * Banner del canal (2560×1440). Lo imprescindible va en la zona segura
 * central de 1546×423 (lo único que se ve en el móvil); los personajes
 * de los lados solo se ven en ordenador y tele.
 */
export const Banner: React.FC = () => (
  <AbsoluteFill>
    <svg width={2560} height={1440} viewBox="0 0 2560 1440">
      <rect x={0} y={0} width={2560} height={1440} fill={C.nocheArriba} />
      <g transform="scale(1.3333 1.3333)">
        <CieloNoche alto={1080} estrellas={110} />
        <BosqueNoche suelo={1000} />
        <LucesFlotantes n={16} y0={600} alto={350} />
      </g>
      <LunaFase x={2050} y={420} r={110} fase={0.5} id="banner-luna" brilloHalo={0.8} />
      {/* zona segura: 1546×423 en el centro (507..2053, 508..931) */}
      <Logo x={1280} y={700} escala={1.05} />
      <text x={1280} y={905} textAnchor="middle" fontFamily={FUENTE_TEXTO} fontWeight={700} fontSize={56} fill="#FFFFFF" stroke={C.contorno} strokeWidth={8} paintOrder="stroke">
        ¡Aprender es una aventura!
      </text>
      <Farolin x={640} y={720} escala={1.6} expresion="riendo" luz="amarilla" brillo={1.2} brazos={POSES.saludo} saludando={false} parpadea={false} idPrefijo="banner-f" />
      <Galleta x={1930} y={1040} escala={1.15} expresion="riendo" brazos={POSES.celebrar} parpadea={false} />
      <Lechuza x={300} y={1180} escala={0.95} expresion="feliz" parpadea={false} />
    </svg>
  </AbsoluteFill>
);
