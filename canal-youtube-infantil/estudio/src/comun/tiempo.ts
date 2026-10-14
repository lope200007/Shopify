import { Easing, interpolate } from "remotion";
import { Brazos } from "../personajes/cara";

export const FPS = 30;

// ------------------------------------------------------------------ guion

export type LineaGuion = { id: string; p: string; t: string; pausa?: number };
export type EscenaGuion = { id: string; lugar: string; lineas: LineaGuion[] };
export type Guion = { id: string; titulo: string; escenas: EscenaGuion[] };
export type VozLinea = { personaje: string; texto: string; archivo: string; duracion: number; boca: number[] };
export type Voces = { lineas: Record<string, VozLinea> };

export type LineaColocada = {
  id: string;
  personaje: string;
  texto: string;
  archivo: string;
  inicio: number; // fotograma relativo al inicio de la escena
  fin: number;
  boca: number[];
};

export type EscenaColocada = {
  id: string;
  inicio: number; // fotograma absoluto
  duracion: number;
  lineas: Record<string, LineaColocada>;
  orden: LineaColocada[];
};

// Hueco entre una frase y la siguiente (turno de palabra natural).
const HUECO = 0.18;

/**
 * Coloca todas las frases en el tiempo. `antes` y `despues` añaden segundos de
 * acción sin diálogo al principio o al final de una escena (entradas, gags…).
 */
export const colocarGuion = (
  guion: Guion,
  voces: Voces,
  extra: Record<string, { antes?: number; despues?: number }> = {},
): { escenas: Record<string, EscenaColocada>; total: number } => {
  const escenas: Record<string, EscenaColocada> = {};
  let cursor = 0;
  for (const esc of guion.escenas) {
    const antes = extra[esc.id]?.antes ?? 0.4;
    const despues = extra[esc.id]?.despues ?? 0.6;
    let t = antes;
    const lineas: Record<string, LineaColocada> = {};
    const orden: LineaColocada[] = [];
    for (const l of esc.lineas) {
      const v = voces.lineas[l.id];
      if (!v) throw new Error(`Falta la voz de ${l.id}: ejecuta voces/generar_voces.py`);
      const inicio = Math.round(t * FPS);
      const fin = inicio + Math.round(v.duracion * FPS);
      const col: LineaColocada = { id: l.id, personaje: l.p, texto: l.t, archivo: v.archivo, inicio, fin, boca: v.boca };
      lineas[l.id] = col;
      orden.push(col);
      t += v.duracion + HUECO + (l.pausa ?? 0);
    }
    const duracion = Math.round((t + despues) * FPS);
    escenas[esc.id] = { id: esc.id, inicio: cursor, duracion, lineas, orden };
    cursor += duracion;
  }
  return { escenas, total: cursor };
};

/** Apertura de boca de un personaje en un fotograma (0 si no habla). */
export const bocaDe = (escena: EscenaColocada, personaje: string, frame: number): number => {
  for (const l of escena.orden) {
    if (l.personaje === personaje && frame >= l.inicio && frame < l.fin) {
      return l.boca[frame - l.inicio] ?? 0;
    }
  }
  return 0;
};

/** ¿Quién está hablando ahora? (para mirar al que habla) */
export const quienHabla = (escena: EscenaColocada, frame: number): string | null => {
  for (const l of escena.orden) {
    if (frame >= l.inicio && frame < l.fin) return l.personaje;
  }
  return null;
};

// ------------------------------------------------------------------ animación

const suave = Easing.bezier(0.45, 0, 0.25, 1);

/** Interpola un número por fotogramas clave [[fotograma, valor], ...] con suavizado. */
export const clave = (frame: number, claves: [number, number][], easing = suave): number => {
  if (claves.length === 1) return claves[0][1];
  const ordenadas = [...claves].sort((a, b) => a[0] - b[0]);
  return interpolate(
    frame,
    ordenadas.map((c) => c[0]),
    ordenadas.map((c) => c[1]),
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing },
  );
};

/** Valor discreto vigente: el último cuyo fotograma ya ha llegado. */
export function paso<T>(frame: number, pasos: [number, T][]): T {
  let actual = pasos[0][1];
  for (const [f, v] of pasos) {
    if (frame >= f) actual = v;
  }
  return actual;
}

/** Cambia de pose con una transición corta (8 fotogramas) entre ángulos. */
export const pose = (frame: number, pasos: [number, Brazos][], transicion = 8): Brazos => {
  let previa = pasos[0][1];
  let actual = pasos[0][1];
  let desde = -9999;
  for (const [f, b] of pasos) {
    if (frame >= f) {
      previa = actual;
      actual = b;
      desde = f;
    }
  }
  const k = interpolate(frame - desde, [0, transicion], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.34, 1.4, 0.64, 1), // un pelín de rebote
  });
  return { a: previa.a + (actual.a - previa.a) * k, b: previa.b + (actual.b - previa.b) * k };
};

/** Salto con anticipación, vuelo y aplastamiento al caer (principios de Disney). */
export const salto = (
  frame: number,
  inicio: number,
  altura: number,
  duracion = 26,
): { dy: number; estira: number } => {
  const f = frame - inicio;
  if (f < -6 || f > duracion + 10) return { dy: 0, estira: 1 };
  if (f < 0) {
    // anticipación: se agacha
    const k = (f + 6) / 6;
    return { dy: 0, estira: 1 - 0.12 * Math.sin(k * Math.PI * 0.5) };
  }
  if (f <= duracion) {
    const k = f / duracion;
    const dy = -4 * altura * k * (1 - k);
    const estira = 1 + 0.12 * Math.cos(k * Math.PI) * (k < 0.5 ? 1 : -1) * 0.8;
    return { dy, estira: Math.max(0.9, estira) };
  }
  // aterrizaje: aplasta y recupera
  const k = (f - duracion) / 10;
  return { dy: 0, estira: 1 - 0.16 * Math.sin(k * Math.PI) * (1 - k) };
};

export const seg = (s: number) => Math.round(s * FPS);

// ------------------------------------------------------------------ palabras

/** Momento de cada palabra de cada frase (voces/palabras.py), en fotogramas. */
export type Palabras = Record<string, [string, number, number][]>;

// Whisper escribe a veces los números con cifras («3») y otras con letras.
const NUMEROS: Record<string, string> = { "1": "uno", "2": "dos", "3": "tres", "4": "cuatro", "5": "cinco", "60": "sesenta" };

const normaliza = (s: string) => {
  const limpia = s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zñ0-9]/g, "");
  return NUMEROS[limpia] ?? limpia;
};

/**
 * Fotograma (relativo a la escena) en que empieza una palabra de una frase.
 * `n` elige la enésima vez que aparece. Si no la encuentra, avisa con un error
 * en vez de colocar la animación en un sitio cualquiera.
 */
/** Parecido entre dos palabras (1 = iguales), por distancia de edición. */
const parecido = (a: string, b: string): number => {
  const d: number[][] = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
  }
  return 1 - d[a.length][b.length] / Math.max(a.length, b.length, 1);
};

export const momentoPalabra = (escena: EscenaColocada, palabras: Palabras, id: string, buscada: string, n = 0, alFinal = false): number => {
  const linea = escena.lineas[id];
  const lista = palabras[id];
  if (!linea || !lista) throw new Error(`No hay palabras para ${id}`);
  const objetivo = normaliza(buscada);
  let vista = 0;
  for (const [p, ini, fin] of lista) {
    // Whisper a veces escribe distinto la misma palabra («Brachiosaurio»):
    // vale si empieza igual o si se parece mucho
    const oida = normaliza(p);
    const umbral = objetivo.length >= 8 ? 0.75 : 0.8;
    if (oida.startsWith(objetivo) || (objetivo.length >= 5 && parecido(oida, objetivo) >= umbral)) {
      if (vista === n) return linea.inicio + (alFinal ? fin : ini);
      vista++;
    }
  }
  throw new Error(`No encuentro «${buscada}» en ${id}`);
};
