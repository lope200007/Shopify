import React from "react";

const LUZ = "#FFF4C2";
const SOMBRA = "#3A3470";

/**
 * La luna vista desde la Tierra (hemisferio norte, como en España).
 * fase: 0 = nueva, 0.25 = cuarto creciente (iluminada a la derecha),
 *       0.5 = llena, 0.75 = cuarto menguante (iluminada a la izquierda).
 * La parte iluminada se limita con el borde (semicírculo) y el terminador
 * (semi-elipse de radio horizontal r·|cos φ|), que es la geometría real.
 */
export const LunaFase: React.FC<{
  x: number;
  y: number;
  r: number;
  fase: number;
  brilloHalo?: number;
  id: string;
}> = ({ x, y, r, fase, brilloHalo = 0.6, id }) => {
  const f = ((fase % 1) + 1) % 1;
  const phi = f * 2 * Math.PI; // 0 nueva, π llena
  const creciente = f < 0.5;
  const rx = r * Math.abs(Math.cos(phi));
  const gibosa = Math.cos(phi) < 0; // más de la mitad iluminada
  // Lado iluminado a la derecha (creciente); el menguante se dibuja en espejo.
  const d = `M 0 ${-r} A ${r} ${r} 0 0 1 0 ${r} A ${rx} ${r} 0 0 ${gibosa ? 1 : 0} 0 ${-r} Z`;
  const iluminada = 0.5 * (1 - Math.cos(phi));

  const crateres = [
    [-0.35, -0.3, 0.16],
    [0.25, 0.1, 0.22],
    [-0.1, 0.42, 0.12],
    [0.45, -0.4, 0.1],
    [-0.5, 0.2, 0.09],
  ];

  return (
    <g transform={`translate(${x} ${y})`}>
      <defs>
        <radialGradient id={`${id}-halo`}>
          <stop offset="0%" stopColor={LUZ} stopOpacity={0.55} />
          <stop offset="100%" stopColor={LUZ} stopOpacity={0} />
        </radialGradient>
        <clipPath id={`${id}-disco`}>
          <circle r={r} />
        </clipPath>
        <clipPath id={`${id}-luz`}>
          <path d={d} transform={creciente ? undefined : "scale(-1 1)"} />
        </clipPath>
      </defs>
      <circle r={r * 2.4} fill={`url(#${id}-halo)`} opacity={brilloHalo * Math.max(0.15, iluminada)} />
      {/* parte en sombra (se ve un poquito, como la luz cenicienta) */}
      <circle r={r} fill={SOMBRA} opacity={0.85} />
      {/* parte iluminada */}
      <g clipPath={`url(#${id}-luz)`}>
        <circle r={r} fill={LUZ} />
        {crateres.map(([cx, cy, cr], i) => (
          <circle key={i} cx={cx * r} cy={cy * r} r={cr * r} fill="#E8D99A" opacity={0.7} />
        ))}
      </g>
      <circle r={r} fill="none" stroke="#2B2140" strokeWidth={Math.max(2, r * 0.04)} opacity={0.35} clipPath={`url(#${id}-disco)`} />
    </g>
  );
};

/**
 * Una pelota (o la luna vista desde fuera) iluminada por un lado.
 * angLuz: dirección DESDE la que llega la luz, en grados (180 = desde la izquierda).
 */
export const BolaIluminada: React.FC<{
  x: number;
  y: number;
  r: number;
  angLuz: number;
  id: string;
  colorLuz?: string;
  colorSombra?: string;
}> = ({ x, y, r, angLuz, id, colorLuz = "#FFFBEA", colorSombra = "#2E2A55" }) => (
  <g transform={`translate(${x} ${y})`}>
    <defs>
      <clipPath id={`${id}-mitad`}>
        <rect x={0} y={-r - 2} width={r + 2} height={2 * r + 4} transform={`rotate(${angLuz})`} />
      </clipPath>
      <radialGradient id={`${id}-volumen`} cx="35%" cy="35%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor={colorLuz} />
      </radialGradient>
    </defs>
    <circle r={r} fill={colorSombra} />
    <circle r={r} fill={`url(#${id}-volumen)`} clipPath={`url(#${id}-mitad)`} />
    <circle r={r} fill="none" stroke="#2B2140" strokeWidth={4} />
  </g>
);
