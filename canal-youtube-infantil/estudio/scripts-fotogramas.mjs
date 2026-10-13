// Renderiza fotogramas sueltos de una composición para revisarlos.
//   node scripts-fotogramas.mjs Episodio01 0.5 out/revision 40 180 300 ...
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "path";
import fs from "fs";

const [id, escala, carpeta, ...frames] = process.argv.slice(2);
fs.mkdirSync(carpeta, { recursive: true });
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const browserExecutable = process.env.REMOTION_CHROME || null;
const composition = await selectComposition({ serveUrl, id, browserExecutable });
for (const f of frames) {
  const output = path.join(carpeta, `${id}-${String(f).padStart(5, "0")}.png`);
  await renderStill({ composition, serveUrl, output, frame: Number(f), scale: Number(escala), browserExecutable });
  console.log("ok", output);
}
