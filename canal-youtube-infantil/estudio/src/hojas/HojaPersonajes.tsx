import React from "react";
import { AbsoluteFill } from "remotion";
import { C, cargarFuentes, FUENTE_TEXTO, FUENTE_TITULO } from "../marca";
import { Farolin } from "../personajes/Farolin";
import { Galleta } from "../personajes/Galleta";
import { Lechuza } from "../personajes/Lechuza";
import { Expresion, POSES } from "../personajes/cara";

cargarFuentes();

const Etiqueta: React.FC<{ x: number; y: number; texto: string; sub?: string }> = ({ x, y, texto, sub }) => (
  <g>
    <text x={x} y={y} textAnchor="middle" fontFamily={FUENTE_TITULO} fontWeight={800} fontSize={46} fill={C.texto}>
      {texto}
    </text>
    {sub ? (
      <text x={x} y={y + 34} textAnchor="middle" fontFamily={FUENTE_TEXTO} fontWeight={500} fontSize={24} fill="#5A4E73">
        {sub}
      </text>
    ) : null}
  </g>
);

// Hoja de personajes: los tres en grande y una fila de expresiones.
export const HojaPersonajes: React.FC = () => {
  const expresiones: Expresion[] = ["feliz", "contento", "sorprendido", "preocupado", "pensando", "riendo"];
  return (
    <AbsoluteFill style={{ backgroundColor: "#FFF6E5" }}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080">
        <rect x={0} y={0} width={1920} height={1080} fill="#FFF6E5" />
        <text x={960} y={78} textAnchor="middle" fontFamily={FUENTE_TITULO} fontWeight={800} fontSize={64} fill={C.texto}>
          Farolín y Galleta · personajes
        </text>

        {/* grandes */}
        <Farolin x={330} y={420} escala={1.55} expresion="feliz" brazos={POSES.saludo} saludando luz="amarilla" parpadea={false} />
        <Etiqueta x={330} y={620} texto="Farolín" sub="luciérnaga · curioso y prudente" />

        <Galleta x={960} y={590} escala={1.2} expresion="riendo" brazos={POSES.celebrar} parpadea={false} />
        <Etiqueta x={960} y={650} texto="Galleta" sub="osita · valiente e impulsiva" />

        <Lechuza x={1600} y={590} escala={1.22} expresion="feliz" alaB={60} parpadea={false} />
        <Etiqueta x={1600} y={650} texto="Doña Lechuza" sub="la sabia: «vamos a comprobarlo»" />

        {/* fila de expresiones de Farolín, con su luz */}
        {expresiones.map((e, i) => (
          <g key={e}>
            <Farolin
              x={150 + i * 140}
              y={860}
              escala={0.62}
              expresion={e}
              luz={e === "pensando" ? "turquesa" : e === "preocupado" ? "azul" : e === "riendo" ? "rosa" : "amarilla"}
              semilla={i + 5}
              idPrefijo={`f${i}`}
              parpadea={false}
            />
            <text x={150 + i * 140} y={1010} textAnchor="middle" fontFamily={FUENTE_TEXTO} fontSize={22} fill="#5A4E73">
              {e}
            </text>
          </g>
        ))}

        {/* fila de expresiones de Galleta */}
        {expresiones.map((e, i) => (
          <g key={e}>
            <Galleta x={1010 + i * 150} y={990} escala={0.42} expresion={e} semilla={i + 9} parpadea={false} />
            <text x={1010 + i * 150} y={1030} textAnchor="middle" fontFamily={FUENTE_TEXTO} fontSize={22} fill="#5A4E73">
              {e}
            </text>
          </g>
        ))}
      </svg>
    </AbsoluteFill>
  );
};
