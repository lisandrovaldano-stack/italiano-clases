const INK = "#22231f";
const GREEN = "#008148";
const WHITE = "#fbfaf7";
const RED = "#ce2b37";

function archPath(x: number, yTop: number, yBottom: number, width: number) {
  const r = width / 2;
  return `M${x},${yBottom} L${x},${yTop + r} A${r},${r} 0 0 1 ${x + width},${
    yTop + r
  } L${x + width},${yBottom} Z`;
}

const SHAFT_LEFT = 12;
const SHAFT_RIGHT = 20;
const ARCH_W = 1.5;
const ARCH_GAP = 0.15;

const TIERS: [number, number][] = [
  [9, 13.25],
  [13.25, 17.5],
  [17.5, 21.75],
  [21.75, 26],
];

function tierArches(yTop: number, yBottom: number) {
  const archTop = yTop + 0.3;
  const archBottom = yBottom - 0.3;
  const xs = [0, 1, 2, 3, 4].map((i) => SHAFT_LEFT + i * (ARCH_W + ARCH_GAP));
  return xs.map((x) => archPath(x, archTop, archBottom, ARCH_W));
}

const BELFRY_XS = [13.4, 15.15, 16.9];

export function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="shrink-0"
    >
      <rect width="32" height="32" rx="8" fill="#fbfaf7" />
      <rect x="1.5" y="1.5" width="29" height="29" rx="6.5" fill="none" stroke="#e3ded3" />

      {/* grassy mound the tower stands on — stays flat so the lean reads clearly */}
      <ellipse cx="16" cy="27" rx="7.5" ry="1.6" fill={GREEN} stroke={INK} strokeWidth="0.5" />

      <g transform="rotate(-10 16 26.3)">
        {/* three colour bands of the shaft */}
        <rect x={SHAFT_LEFT} y="9" width={SHAFT_RIGHT - SHAFT_LEFT} height="5.67" fill={RED} />
        <rect x={SHAFT_LEFT} y="14.67" width={SHAFT_RIGHT - SHAFT_LEFT} height="5.66" fill={WHITE} />
        <rect x={SHAFT_LEFT} y="20.33" width={SHAFT_RIGHT - SHAFT_LEFT} height="5.67" fill={GREEN} />

        {/* shaft outline */}
        <rect
          x={SHAFT_LEFT}
          y="9"
          width={SHAFT_RIGHT - SHAFT_LEFT}
          height="17"
          fill="none"
          stroke={INK}
          strokeWidth="0.6"
        />
        <line x1={SHAFT_LEFT} y1="14.67" x2={SHAFT_RIGHT} y2="14.67" stroke={INK} strokeWidth="0.35" />
        <line x1={SHAFT_LEFT} y1="20.33" x2={SHAFT_RIGHT} y2="20.33" stroke={INK} strokeWidth="0.35" />

        {/* arcade rows */}
        {TIERS.map(([top, bottom], row) =>
          tierArches(top, bottom).map((d, i) => (
            <path key={`${row}-${i}`} d={d} fill="none" stroke={INK} strokeWidth="0.35" />
          ))
        )}

        {/* belfry gallery */}
        <rect x="13" y="6.3" width="6" height="2.7" fill={RED} stroke={INK} strokeWidth="0.5" />
        {BELFRY_XS.map((x, i) => (
          <path key={i} d={archPath(x, 6.6, 8.7, 1.3)} fill="none" stroke={INK} strokeWidth="0.3" />
        ))}

        {/* shallow domed roof */}
        <path
          d="M12.8,6.3 Q16,4.4 19.2,6.3 Z"
          fill={RED}
          stroke={INK}
          strokeWidth="0.5"
          strokeLinejoin="round"
        />

        {/* flagpole + tiny italian flag */}
        <line x1="16" y1="4.4" x2="16" y2="1.3" stroke={INK} strokeWidth="0.5" />
        <path d="M16,1.4 L19.2,2.3 L16,3.2 Z" fill={WHITE} stroke={INK} strokeWidth="0.3" />
        <path d="M16,1.4 L17.07,1.7 L17.07,2.9 L16,3.2 Z" fill={GREEN} />
        <path d="M18.13,2 L19.2,2.3 L18.13,2.6 Z" fill={RED} />
      </g>
    </svg>
  );
}
