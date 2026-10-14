import React from "react";
import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import { cargarFuentes } from "../../marca";
import { colocarGuion, Guion, Voces } from "../../comun/tiempo";
import guionJson from "./guion.json";
import vocesJson from "./voces.json";
import escenasJson from "./escenas.json";
import { E01Gancho } from "./escenas/E01Gancho";
import { E02Pistas } from "./escenas/E02Pistas";
import { E03Fosil } from "./escenas/E03Fosil";
import { E04Tiranosaurio } from "./escenas/E04Tiranosaurio";
import { E05Pregunta } from "./escenas/E05Pregunta";
import { E06Datos } from "./escenas/E06Datos";
import { E07Secreto } from "./escenas/E07Secreto";
import { E08Repaso } from "./escenas/E08Repaso";
import { E09Final } from "./escenas/E09Final";

cargarFuentes();

// Márgenes de cada escena (en escenas.json, que también usa el generador de subtítulos)
const EXTRA = escenasJson.extra;

export const LINEA_TIEMPO = colocarGuion(guionJson as Guion, vocesJson as unknown as Voces, EXTRA);

const ESCENAS: [string, string, React.FC<{ escena: ReturnType<typeof colocarGuion>["escenas"][string] }>][] = [
  ["e01_gancho", "1 · Gancho", E01Gancho],
  ["e02_pistas", "2 · Las pistas", E02Pistas],
  ["e03_fosil", "3 · El fósil", E03Fosil],
  ["e04_tiranosaurio", "4 · El tiranosaurio", E04Tiranosaurio],
  ["e05_pregunta", "5 · Te toca a ti", E05Pregunta],
  ["e06_datos", "6 · Datos curiosos", E06Datos],
  ["e07_secreto", "7 · El secreto", E07Secreto],
  ["e08_repaso", "8 · Repaso", E08Repaso],
  ["e09_final", "9 · Final", E09Final],
];

export const Episodio02: React.FC = () => {
  const { fps } = useVideoConfig();
  const e = LINEA_TIEMPO.escenas;
  return (
    <AbsoluteFill style={{ backgroundColor: "#140F3D" }}>
      {ESCENAS.map(([id, nombre, Escena]) => (
        <Sequence key={id} name={nombre} from={e[id].inicio} durationInFrames={e[id].duracion} premountFor={fps}>
          <Escena escena={e[id]} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
