import React from "react";
import { Composition, Folder, Still } from "remotion";
import { HojaPersonajes } from "./hojas/HojaPersonajes";
import { Avatar, Banner, Miniatura01 } from "./hojas/Marca";
import { Episodio01, LINEA_TIEMPO as EP01 } from "./episodios/ep01/Episodio01";
import { PruebaDinos, PruebaLuz, PruebaRio } from "./hojas/PruebasEp02";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Folder name="Episodios">
        <Composition id="Episodio01" component={Episodio01} durationInFrames={EP01.total} fps={30} width={1920} height={1080} />
      </Folder>
      <Folder name="Marca">
        <Still id="HojaPersonajes" component={HojaPersonajes} width={1920} height={1080} />
        <Still id="Avatar" component={Avatar} width={800} height={800} />
        <Still id="Banner" component={Banner} width={2560} height={1440} />
      </Folder>
      <Folder name="Pruebas">
        <Still id="PruebaRio" component={PruebaRio} width={1920} height={1080} />
        <Still id="PruebaRioNoche" component={() => <PruebaRio oscurece={0.8} />} width={1920} height={1080} />
        <Still id="PruebaDinos" component={PruebaDinos} width={1920} height={1080} />
        <Still id="PruebaLuz" component={PruebaLuz} width={1920} height={1080} />
      </Folder>
      <Folder name="Miniaturas">
        <Still id="Miniatura01" component={Miniatura01} width={1280} height={720} />
      </Folder>
    </>
  );
};
