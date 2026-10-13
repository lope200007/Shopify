// Renderiza imágenes fijas de marca: node scripts-stills.mjs carpeta Id:escala Id:escala ...
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "path";
import fs from "fs";
const [carpeta, ...pedidos] = process.argv.slice(2);
fs.mkdirSync(carpeta, { recursive: true });
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const browserExecutable = process.env.REMOTION_CHROME || null;
for (const p of pedidos) {
  const [id, escala = "1"] = p.split(":");
  const composition = await selectComposition({ serveUrl, id, browserExecutable });
  const output = path.join(carpeta, `${id}.png`);
  await renderStill({ composition, serveUrl, output, scale: Number(escala), browserExecutable });
  console.log("ok", output);
}
