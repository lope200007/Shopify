import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { C, FUENTE_TITULO } from "../../../marca";
import { bocaDe, clave, EscenaColocada, paso, pose, quienHabla, salto } from "../../../comun/tiempo";
import { Fx, MusicaEscena, useEscena, VocesEscena } from "../../../comun/Sonido";
import { Burbuja, Iris, Logo } from "../../../comun/Rotulos";
import { Arbusto } from "../../../escenario/Rio";
import { HuellaDino } from "../../../escenario/Huellas";
import { Farolin } from "../../../personajes/Farolin";
import { Galleta } from "../../../personajes/Galleta";
import { Lechuza } from "../../../personajes/Lechuza";
import { POSES } from "../../../personajes/cara";
import { ARBUSTO, CabezaGalleta, COLOR_ROCA, CrestaHojas, Orilla, Polvo, usePalabra } from "../mundo";

// Gancho: «pum… pum…» detrás de un arbusto. ¿Un dinosaurio? Es Galleta
// jugando. Se disculpa y enseña lo que ha encontrado: una huella gigante.
// Intriga suave que se resuelve con una sonrisa en pocos segundos.
export const E01Gancho: React.FC<{ escena: EscenaColocada }> = ({ escena }) => {
  const { frame, ini, fin } = useEscena(escena);
  const pal = usePalabra(escena);
  const habla = quienHabla(escena, frame);

  // golpes detrás del arbusto
  const golpes = [10, 42, 158];
  const sacudida = Math.max(0, ...golpes.map((g) => (frame >= g ? Math.exp(-(frame - g) / 9) : 0)));

  // cámara: del arbusto (derecha) a la roca (izquierda) cuando Galleta dice «mira»
  const camX = clave(frame, [
    [pal("l004", "pero"), 700],
    [pal("l004", "rio") + 24, 300],
  ]);

  // Galleta sale de un salto del arbusto
  const saleG = ini("l002") - 18;
  const s1 = salto(frame, saleG, 150, 22);
  const sPum1 = salto(frame, pal("l002", "pum"), 26, 10);
  const sPum2 = salto(frame, pal("l002", "pum", 1), 26, 10);
  const gxMundo = clave(frame, [
    [saleG, ARBUSTO.x],
    [saleG + 22, 1720],
    [pal("l004", "pero"), 1720],
    [pal("l004", "rio") + 10, 1460],
  ]);
  const anda = frame > pal("l004", "pero") && frame < pal("l004", "rio") + 10;
  // escondida y agachada dentro del arbusto: solo asoma la cresta de hojas
  const agachada = clave(frame, [
    [saleG - 6, 175],
    [saleG + 8, 0],
  ]);
  const gy = 930 + agachada + s1.dy + sPum1.dy + sPum2.dy - (anda ? Math.abs(Math.sin(frame * 0.45)) * 14 : 0);
  const dentro = frame < saleG + 4;
  const disfraz = frame < pal("l004", "pero");
  const gx = gxMundo - camX;
  const exprG = paso(frame, [
    [0, "riendo" as const],
    [ini("l003"), "riendo" as const],
    [ini("l004"), "preocupado" as const],
    [pal("l004", "pero"), "feliz" as const],
    [ini("l005"), "sorprendido" as const],
    [fin("l005") + 4, "feliz" as const],
  ]);
  const brazosG = pose(frame, [
    [0, { a: 135, b: 135 }],
    [ini("l004"), { a: -40, b: -40 }],
    [pal("l004", "pero"), POSES.señalarIzq],
    [pal("l004", "rio") + 10, POSES.reposo],
    [pal("l005", "mas"), { a: 14, b: -150 }],
    [fin("l005") + 6, POSES.reposo],
  ]);

  // Farolín: revolotea junto a la flor; se asusta un poquito con los golpes
  const susto = frame >= golpes[0] && frame < ini("l003") + 34;
  const fxMundo = clave(frame, [
    [0, 1760],
    [golpes[0] + 6, 1640],
    [pal("l004", "pero"), 1640],
    [pal("l004", "rio") + 24, 1300],
  ]);
  const fy = clave(frame, [
    [0, 600],
    [golpes[0] + 6, 560],
    [pal("l004", "rio") + 24, 520],
  ]);
  const exprF = paso(frame, [
    [0, "contento" as const],
    [golpes[0], "sorprendido" as const],
    [pal("l001", "sera"), "preocupado" as const],
    [ini("l003"), "asustado" as const],
    [ini("l003") + 34, "riendo" as const],
    [fin("l003") + 4, "feliz" as const],
    [ini("l005"), "sorprendido" as const],
    [pal("l005", "mas"), "riendo" as const],
  ]);
  const temblor = susto && frame < saleG ? Math.sin(frame * 2.2) * 2 : 0;

  // revelación de la huella
  const brillo = clave(frame, [
    [fin("l004"), 0],
    [fin("l004") + 12, 1],
    [ini("l006") - 10, 1],
    [ini("l006"), 0],
  ]);
  const burbuja = clave(frame, [
    [pal("l005", "mas") - 6, 0],
    [pal("l005", "mas") + 6, 1],
    [fin("l005") + 4, 1],
    [ini("l006") - 4, 0],
  ]);
  const cabeza = clave(frame, [
    [pal("l005", "cabeza") - 4, 0],
    [pal("l005", "cabeza") + 8, 1],
  ]);

  const titulo = interpolate(frame, [ini("l006") - 6, ini("l006") + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const secreto = clave(frame, [
    [pal("l006", "dona") - 6, 0],
    [pal("l006", "dona") + 8, 1],
  ]);

  const galleta = (
    <>
      <Galleta
        x={gx}
        y={gy}
        escala={1}
        expresion={exprG}
        habla={bocaDe(escena, "galleta", frame)}
        brazos={brazosG}
        voltear={frame >= pal("l004", "pero") - 4}
        estiramiento={s1.estira * sPum1.estira * sPum2.estira}
        mirada={frame >= pal("l004", "pero") - 4 ? { x: 0.9, y: 0.3 } : { x: -1, y: habla === "farolin" ? -0.4 : 0 }}
      />
      {disfraz ? <CrestaHojas x={gx} y={gy - 360} escala={0.9} rot={-4} /> : null}
    </>
  );

  return (
    <AbsoluteFill>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080">
        <Orilla id="e01" camX={camX} conArbusto={false} brillo={brillo} />
        {dentro ? galleta : null}
        <Arbusto x={ARBUSTO.x - camX} y={ARBUSTO.y} s={1.05} sacudida={sacudida * 1.6} />
        {!dentro ? galleta : null}
        <Polvo x={gx} y={gy + 4} t={(frame - pal("l002", "pum")) / 14} />
        <Polvo x={gx} y={gy + 4} t={(frame - pal("l002", "pum", 1)) / 14} />
        <Farolin
          x={fxMundo - camX + temblor}
          y={fy}
          escala={1}
          expresion={exprF}
          habla={bocaDe(escena, "farolin", frame)}
          luz={frame >= pal("l001", "dinosaurio") && frame < ini("l003") + 34 ? "azul" : "amarilla"}
          mirada={frame > pal("l004", "pero") ? { x: 0.8, y: 0.8 } : habla === "galleta" || frame > golpes[0] ? { x: 1, y: 0.3 } : { x: 0.5, y: 0 }}
          brazos={pose(frame, [
            [0, POSES.reposo],
            [golpes[0], { a: 60, b: 60 }],
            [ini("l003"), POSES.manosCara],
            [ini("l003") + 34, POSES.reposo],
            [ini("l005"), POSES.brazosAbiertos],
            [fin("l005"), POSES.reposo],
          ])}
          voltear={frame > pal("l004", "pero") && frame < ini("l006")}
          idPrefijo="f-e01"
        />
        {/* lupa: la huella vista desde arriba, con la cabeza de Galleta dentro para comparar */}
        <Burbuja x={960} y={330} r={230} visible={burbuja}>
          <rect x={-240} y={-240} width={480} height={480} fill={COLOR_ROCA} />
          <HuellaDino x={0} y={150} escala={1.3} fondo={COLOR_ROCA} id="e01-lupa" />
          <g opacity={cabeza}>
            <CabezaGalleta x={0} y={10} r={78} opacidad={0.92} />
            <circle cx={0} cy={10} r={86} fill="none" stroke="#FFFFFF" strokeWidth={6} strokeDasharray="16 12" />
          </g>
        </Burbuja>
        {/* título del episodio */}
        <g opacity={titulo}>
          <rect x={0} y={0} width={1920} height={1080} fill="#140F3D" opacity={0.55} />
          <Logo x={960} y={400} escala={1.15 * (0.85 + 0.15 * titulo)} />
          <text x={960} y={690} textAnchor="middle" fontFamily={FUENTE_TITULO} fontWeight={800} fontSize={76} fill="#FFFFFF" stroke={C.contorno} strokeWidth={10} paintOrder="stroke">
            ¿De quién es esta huella gigante?
          </text>
          <g opacity={secreto} transform={`translate(1500 ${1020 - 40 * secreto})`}>
            <Lechuza x={0} y={0} escala={0.7} expresion="contento" alaB={-40} mirada={{ x: -0.6, y: -0.2 }} />
            <g transform="translate(150 -330)">
              <circle r={48} fill="#FFFFFF" stroke={C.contorno} strokeWidth={6} />
              <text y={22} textAnchor="middle" fontFamily={FUENTE_TITULO} fontWeight={800} fontSize={66} fill={C.luzRosa}>
                ?
              </text>
            </g>
          </g>
        </g>
        <Iris duracion={escena.duracion} entrada={12} salida={16} centro={[960, 600]} />
      </svg>
      <VocesEscena escena={escena} />
      <MusicaEscena pista="misterio" escena={escena} volumen={0.15} hasta={saleG + 6} ambiente="rio" />
      <MusicaEscena pista="aventura" escena={escena} volumen={0.14} desde={saleG} hasta={ini("l006") - 4} />
      <MusicaEscena pista="tema" escena={escena} volumen={0.35} desde={ini("l006") - 6} />
      <Fx efecto="pum" en={golpes[0]} volumen={0.5} />
      <Fx efecto="pum" en={golpes[1]} volumen={0.55} />
      <Fx efecto="pum" en={golpes[2]} volumen={0.6} />
      <Fx efecto="salto" en={saleG - 2} volumen={0.4} />
      <Fx efecto="magia" en={fin("l004") - 2} volumen={0.3} />
    </AbsoluteFill>
  );
};
