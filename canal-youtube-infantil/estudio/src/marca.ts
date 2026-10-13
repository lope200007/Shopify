import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Nombre del canal y de los personajes en un solo sitio: si Pablo cambia
// el nombre, se cambia aquí y en los textos de los guiones.
export const CANAL = "Farolín y Galleta";

// Paleta. Los colores de la luz de Farolín cuentan la historia:
// amarillo = normal, turquesa = «¡se me ha encendido una idea!».
export const C = {
  contorno: "#2B2140",
  luzAmarilla: "#FFD23F",
  luzTurquesa: "#3BCEAC",
  luzRosa: "#FF7EB6",
  luzAzul: "#6EB8FF",
  coral: "#FF6B4A",
  coralOscuro: "#E2492D",
  marino: "#2D2F7A",
  alas: "#CDEFFF",
  caramelo: "#C98A4B",
  carameloOscuro: "#A86C33",
  crema: "#F7DDB5",
  rosaMejillas: "#FF8FA3",
  pañuelo: "#E63946",
  bolso: "#7A4A26",
  lechuza: "#E2B66E",
  lechuzaOscuro: "#C8924A",
  caraLechuza: "#FFF7EC",
  nocheArriba: "#140F3D",
  nocheAbajo: "#3B2C85",
  verdeBosque: "#2F7D5B",
  verdeOscuro: "#1E5A44",
  verdeClaro: "#57B77A",
  blanco: "#FFFFFF",
  texto: "#2B2140",
} as const;

export const LUCES = {
  amarilla: C.luzAmarilla,
  turquesa: C.luzTurquesa,
  rosa: C.luzRosa,
  azul: C.luzAzul,
} as const;

export type Luz = keyof typeof LUCES;

// Las familias se cargan con su nombre tal cual; para usarlas en CSS/SVG van
// entre comillas: «Baloo 2» lleva un número y sin comillas el navegador la ignora.
const FAMILIA_TITULO = "Baloo 2";
const FAMILIA_TEXTO = "Fredoka";
export const FUENTE_TITULO = `"${FAMILIA_TITULO}", "Fredoka", sans-serif`;
export const FUENTE_TEXTO = `"${FAMILIA_TEXTO}", sans-serif`;

let fuentesCargadas: Promise<unknown> | null = null;

export const cargarFuentes = () => {
  if (!fuentesCargadas) {
    fuentesCargadas = Promise.all([
      loadFont({
        family: FAMILIA_TITULO,
        url: staticFile("fuentes/Baloo2.ttf"),
        weight: "400 800",
      }),
      loadFont({
        family: FAMILIA_TEXTO,
        url: staticFile("fuentes/Fredoka.ttf"),
        weight: "300 700",
      }),
    ]);
  }
  return fuentesCargadas;
};
