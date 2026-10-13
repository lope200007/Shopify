// Genera los subtítulos (.srt) y los capítulos de YouTube de un episodio,
// con exactamente los mismos tiempos que el vídeo (misma lógica que colocarGuion).
//   node publicar.mjs ep01
import fs from "fs";
const ep = process.argv[2] || "ep01";
const dir = `src/episodios/${ep}/`;
const g = JSON.parse(fs.readFileSync(dir + "guion.json", "utf8"));
const v = JSON.parse(fs.readFileSync(dir + "voces.json", "utf8"));
const { extra, capitulos } = JSON.parse(fs.readFileSync(dir + "escenas.json", "utf8"));
const FPS = 30, HUECO = 0.18;
const hms = (f, ms = true) => {
  const s = f / FPS, h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = Math.floor(s % 60), mil = Math.round((s - Math.floor(s)) * 1000);
  return ms ? `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")},${String(mil).padStart(3, "0")}` : `${m}:${String(sec).padStart(2, "0")}`;
};
let cursor = 0, n = 1;
const srt = [], caps = [];
for (const esc of g.escenas) {
  let t = extra[esc.id]?.antes ?? 0.4;
  caps.push(`${hms(cursor, false)} ${capitulos[esc.id]}`);
  for (const l of esc.lineas) {
    const d = v.lineas[l.id].duracion;
    const ini = cursor + Math.round(t * FPS), fin = ini + Math.round(d * FPS);
    srt.push(`${n++}\n${hms(ini)} --> ${hms(fin)}\n${l.t}\n`);
    t += d + HUECO + (l.pausa ?? 0);
  }
  cursor += Math.round((t + (extra[esc.id]?.despues ?? 0.6)) * FPS);
}
fs.mkdirSync(`../episodios/${ep}`, { recursive: true });
fs.writeFileSync(`../episodios/${ep}/subtitulos-es.srt`, srt.join("\n"));
fs.writeFileSync(`../episodios/${ep}/capitulos.txt`, caps.join("\n") + "\n");
console.log(`total ${cursor} fotogramas (${hms(cursor, false)}) · ${n - 1} subtítulos`);
console.log(caps.join("\n"));
