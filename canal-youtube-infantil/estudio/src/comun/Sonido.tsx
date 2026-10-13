import React from "react";
import { Audio } from "@remotion/media";
import { interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { EscenaColocada } from "./tiempo";

/** Las voces de una escena, cada una en su fotograma. */
export const VocesEscena: React.FC<{ escena: EscenaColocada }> = ({ escena }) => {
  const { fps } = useVideoConfig();
  return (
    <>
      {escena.orden.map((l) => (
        <Audio key={l.id} name={`voz ${l.id}`} src={staticFile(l.archivo)} from={l.inicio} premountFor={fps} volume={1} />
      ))}
    </>
  );
};

export type Efecto = "salto" | "plof" | "susurro" | "idea" | "acierto" | "magia" | "clic" | "pop";

/** Un efecto de sonido en un fotograma de la escena. */
export const Fx: React.FC<{ efecto: Efecto; en: number; volumen?: number }> = ({ efecto, en, volumen = 0.6 }) => {
  const { fps } = useVideoConfig();
  return <Audio name={`efecto ${efecto}`} src={staticFile(`efectos/${efecto}.mp3`)} from={Math.max(0, Math.round(en))} premountFor={fps} volume={volumen} />;
};

/**
 * Música de fondo de una escena: entra y sale con fundido y baja cuando
 * alguien habla («ducking») para que la voz se entienda siempre.
 */
export const MusicaEscena: React.FC<{
  pista: "tema" | "noche" | "aventura" | "experimento" | "repaso";
  escena: EscenaColocada;
  volumen?: number;
  desde?: number;
  hasta?: number;
  ambiente?: boolean; // grillos de fondo
}> = ({ pista, escena, volumen = 0.22, desde = 0, hasta, ambiente = false }) => {
  const { fps } = useVideoConfig();
  const fin = hasta ?? escena.duracion;
  const largo = Math.max(1, fin - desde);
  return (
    <>
      <Audio
        name={`música ${pista}`}
        src={staticFile(`musica/${pista}.mp3`)}
        from={desde}
        durationInFrames={largo}
        loop
        premountFor={fps}
        volume={(f) => {
          const absoluto = f + desde;
          // distancia (en fotogramas) a la frase más cercana: 0 si alguien habla
          let lejos = 99;
          for (const l of escena.orden) {
            const d = absoluto < l.inicio ? l.inicio - absoluto : absoluto > l.fin ? absoluto - l.fin : 0;
            if (d < lejos) lejos = d;
          }
          // la música baja al 45 % cuando hablan, con una rampa de 10 fotogramas
          const ducking = 0.45 + 0.55 * Math.min(1, Math.max(0, (lejos - 2) / 10));
          const fundido = Math.min(
            interpolate(f, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            interpolate(f, [largo - 24, largo], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          );
          return volumen * fundido * ducking;
        }}
      />
      {ambiente ? (
        <Audio
          name="grillos"
          src={staticFile("efectos/grillos.mp3")}
          from={desde}
          durationInFrames={largo}
          loop
          premountFor={fps}
          volume={(f) =>
            0.05 *
            Math.min(
              interpolate(f, [0, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
              interpolate(f, [largo - 30, largo], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            )
          }
        />
      ) : null}
    </>
  );
};

/** Hook para la escena: fotograma actual y atajos de tiempo de las frases. */
export const useEscena = (escena: EscenaColocada) => {
  const frame = useCurrentFrame();
  const ini = (id: string) => escena.lineas[id].inicio;
  const fin = (id: string) => escena.lineas[id].fin;
  return { frame, ini, fin };
};
