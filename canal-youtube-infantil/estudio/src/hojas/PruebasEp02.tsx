import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FUENTE_TITULO, cargarFuentes } from "../marca";
import { CieloAtardecer, OrillaRio, RocaHuella } from "../escenario/Rio";
import { Braquiosaurio, DinoPlumas, Gallina, Paloma, Tiranosaurio } from "../escenario/Dinos";
import { Ambar, Autobus, DienteAfilado, DienteCuchara, Hueso, Insignia, Lupa, Platano, RelojArena } from "../escenario/Cosas";
import { HuellaDino, HuellaGallina, HuellaOsita } from "../escenario/Huellas";
import { MapaEspana } from "../escenario/Mapa";
import { CuentaAtras, LuzHistorias, MarcadorPistas } from "../comun/Juego";
import { Farolin } from "../personajes/Farolin";
import { Galleta } from "../personajes/Galleta";
import { Lechuza } from "../personajes/Lechuza";

cargarFuentes();

// Hojas para revisar los dibujos nuevos del episodio 2 antes de animarlos.

export const PruebaRio: React.FC<{ oscurece?: number }> = ({ oscurece = 0 }) => (
  <AbsoluteFill>
    <svg width={1920} height={1080} viewBox="0 0 1920 1080">
      <CieloAtardecer oscurece={oscurece} />
      <OrillaRio camX={300} oscurece={oscurece} />
      <RocaHuella x={760} y={930} escala={1.1} id="prueba-roca" dedos={[0, 0, 0]} garras={0} oscurece={oscurece} />
      <Galleta x={330} y={1000} escala={0.95} expresion="sorprendido" objeto={<Lupa escala={0.9} rot={-20} />} brazos={{ a: 14, b: 60 }} />
      <Farolin x={1000} y={560} escala={1} idPrefijo="prueba-f" />
      <Lechuza x={1260} y={792} escala={0.85} />
      <MarcadorPistas pistas={[0, 0, null]} visible={1} resaltar={2} />
    </svg>
  </AbsoluteFill>
);

export const PruebaDinos: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#FFF3D6" }}>
    <svg width={1920} height={1080} viewBox="0 0 1920 1080">
      <Tiranosaurio x={430} y={500} escala={0.9} boca={0.5} />
      <Braquiosaurio x={1180} y={860} escala={0.95} boca={1} glup={0.4} />
      <DinoPlumas x={120} y={1040} escala={0.9} ave={0} />
      <DinoPlumas x={330} y={1040} escala={0.9} ave={0.5} />
      <DinoPlumas x={520} y={1040} escala={0.9} ave={1} />
      <Gallina x={700} y={1040} escala={1} />
      <Paloma x={860} y={1040} escala={1.1} />
      <Autobus x={1400} y={1040} largo={480} />
      <Platano x={1580} y={140} />
      <DienteAfilado x={1760} y={300} escala={0.8} />
      <DienteCuchara x={1860} y={300} escala={0.8} />
      <Ambar x={1610} y={430} escala={0.9} id="prueba-ambar" />
      <Hueso x={1770} y={470} escala={0.6} rot={-20} />
      <Insignia x={1700} y={700} escala={0.55} texto="¡Ya lees huellas!" />
      <RelojArena x={1530} y={680} escala={0.6} arena={0.4} />
      <HuellaDino x={700} y={420} escala={0.8} id="prueba-h1" dedos={[1, 0, 0]} garras={1} fondo="#8B5E3C" />
      <HuellaOsita x={840} y={420} escala={0.8} />
      <HuellaGallina x={940} y={420} escala={0.8} dedos={1} />
      <MapaEspana x={40} y={40} ancho={330} rioja={1} huellas={1} />
      <CuentaAtras desde={-10} hasta={90} x={1000} y={150} r={80} />
      <text x={960} y={1070} textAnchor="middle" fontFamily={FUENTE_TITULO} fontWeight={800} fontSize={30} fill={C.texto}>
        prueba
      </text>
    </svg>
  </AbsoluteFill>
);

export const PruebaLuz: React.FC = () => (
  <AbsoluteFill>
    <svg width={1920} height={1080} viewBox="0 0 1920 1080">
      <CieloAtardecer oscurece={0.2} />
      <OrillaRio camX={300} oscurece={0.2} />
      <Farolin x={1240} y={640} escala={0.9} luz="amarilla" brillo={1.3} voltear idPrefijo="prueba-luz" />
      <LuzHistorias x={820} y={380} r={300} visible={1} desde={[1240 - 29, 640 + 49]} id="prueba-proy" fondo="#8B5E3C">
        <HuellaDino x={820} y={500} escala={1.1} fondo="#8B5E3C" id="prueba-proy-h" />
        <Tiranosaurio x={760} y={640} escala={0.5} paso={1} />
      </LuzHistorias>
    </svg>
  </AbsoluteFill>
);
