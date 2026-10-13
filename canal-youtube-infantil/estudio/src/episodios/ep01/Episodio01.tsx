import React from "react";
import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import { cargarFuentes } from "../../marca";
import { colocarGuion, Guion, Voces } from "../../comun/tiempo";
import guionJson from "./guion.json";
import vocesJson from "./voces.json";
import escenasJson from "./escenas.json";
import { E01Gancho } from "./escenas/E01Gancho";
import { E02Plan } from "./escenas/E02Plan";
import { E03Arbol } from "./escenas/E03Arbol";
import { E04Experimento } from "./escenas/E04Experimento";
import { E05Pregunta } from "./escenas/E05Pregunta";
import { E06Datos } from "./escenas/E06Datos";
import { E07Repaso } from "./escenas/E07Repaso";
import { E08Final } from "./escenas/E08Final";

cargarFuentes();

// Márgenes de cada escena (en escenas.json, que también usa el generador de subtítulos)
const EXTRA = escenasJson.extra;

export const LINEA_TIEMPO = colocarGuion(guionJson as Guion, vocesJson as unknown as Voces, EXTRA);

export const Episodio01: React.FC = () => {
  const { fps } = useVideoConfig();
  const e = LINEA_TIEMPO.escenas;
  return (
    <AbsoluteFill style={{ backgroundColor: "#140F3D" }}>
      <Sequence name="1 · Gancho" from={e.e01_gancho.inicio} durationInFrames={e.e01_gancho.duracion} premountFor={fps}>
        <E01Gancho escena={e.e01_gancho} />
      </Sequence>
      <Sequence name="2 · El plan" from={e.e02_plan.inicio} durationInFrames={e.e02_plan.duracion} premountFor={fps}>
        <E02Plan escena={e.e02_plan} />
      </Sequence>
      <Sequence name="3 · El árbol" from={e.e03_arbol.inicio} durationInFrames={e.e03_arbol.duracion} premountFor={fps}>
        <E03Arbol escena={e.e03_arbol} />
      </Sequence>
      <Sequence name="4 · El experimento" from={e.e04_experimento.inicio} durationInFrames={e.e04_experimento.duracion} premountFor={fps}>
        <E04Experimento escena={e.e04_experimento} />
      </Sequence>
      <Sequence name="5 · Te toca a ti" from={e.e05_pregunta.inicio} durationInFrames={e.e05_pregunta.duracion} premountFor={fps}>
        <E05Pregunta escena={e.e05_pregunta} />
      </Sequence>
      <Sequence name="6 · Datos curiosos" from={e.e06_datos.inicio} durationInFrames={e.e06_datos.duracion} premountFor={fps}>
        <E06Datos escena={e.e06_datos} />
      </Sequence>
      <Sequence name="7 · Repaso" from={e.e07_repaso.inicio} durationInFrames={e.e07_repaso.duracion} premountFor={fps}>
        <E07Repaso escena={e.e07_repaso} />
      </Sequence>
      <Sequence name="8 · Final" from={e.e08_final.inicio} durationInFrames={e.e08_final.duracion} premountFor={fps}>
        <E08Final escena={e.e08_final} />
      </Sequence>
    </AbsoluteFill>
  );
};
