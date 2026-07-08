const GRAY = "#b9b2a2";

/**
 * Each icon is hand-drawn as a loose line-doodle inside a 0 0 40 40 box,
 * kept deliberately simple since these render tiny and pale as page texture.
 */
function IconColosseum() {
  return (
    <g>
      <path d="M5,29 L5,20 Q5,9 20,9 Q31,9 34,15 L35,20 L32,23 L35,26 L31,30 Z" />
      <path d="M4,30 L33,30" />
      {[9, 13, 17, 21, 25, 29].map((x) => (
        <line key={x} x1={x} y1="17" x2={x} y2="30" />
      ))}
    </g>
  );
}

function IconPisaTower() {
  return (
    <g transform="rotate(-9 20 30)">
      <ellipse cx="20" cy="31" rx="9" ry="1.6" />
      <rect x="15" y="10" width="10" height="20" rx="1" />
      <line x1="15" y1="15.5" x2="25" y2="15.5" />
      <line x1="15" y1="21" x2="25" y2="21" />
      <line x1="15" y1="26.5" x2="25" y2="26.5" />
      <path d="M15,10 Q20,6.5 25,10" />
      <line x1="20" y1="6.5" x2="20" y2="3" />
      <path d="M20,3 L23.5,4.2 L20,5.4 Z" fill={GRAY} stroke="none" />
    </g>
  );
}

function IconRialtoBridge() {
  return (
    <g>
      <path d="M3,28 Q3,14 20,14 Q37,14 37,28" />
      <path d="M9,28 Q9,20 20,20 Q31,20 31,28" />
      {[13, 17, 21, 25, 27].map((x) => (
        <rect key={x} x={x} y="11.5" width="2.4" height="2.4" />
      ))}
      <path d="M2,31 Q6,29 10,31 Q14,29 18,31 Q22,29 26,31 Q30,29 34,31 Q36,32 38,31" />
    </g>
  );
}

function IconFlorenceDuomo() {
  return (
    <g>
      <rect x="10" y="24" width="20" height="6" />
      <path d="M11,24 Q11,12 20,10 Q29,12 29,24 Z" />
      <line x1="15" y1="13" x2="15" y2="24" />
      <line x1="20" y1="10.5" x2="20" y2="24" />
      <line x1="25" y1="13" x2="25" y2="24" />
      <rect x="18.4" y="4" width="3.2" height="5" />
      <circle cx="20" cy="3" r="1.4" />
    </g>
  );
}

function IconGondola() {
  return (
    <g>
      <path d="M4,25 Q20,32 36,24 L33,22 Q20,28 7,21 Z" />
      <line x1="7" y1="21" x2="7" y2="7" />
      <line x1="4.5" y1="9" x2="9.5" y2="9" />
      <line x1="4.5" y1="12" x2="9.5" y2="12" />
      <line x1="4.5" y1="15" x2="9.5" y2="15" />
      <line x1="20" y1="19" x2="20" y2="29" />
    </g>
  );
}

function IconVesuvius() {
  return (
    <g>
      <path d="M4,30 L15,12 L18,16 L21,11 L34,30 Z" />
      <path d="M20,8 Q19,6 21,5 Q20,4 22,2.5" />
    </g>
  );
}

function IconBoccaDellaVerita() {
  return (
    <g>
      <circle cx="20" cy="19" r="14" />
      <ellipse cx="14.5" cy="15" rx="2" ry="2.6" />
      <ellipse cx="25.5" cy="15" rx="2" ry="2.6" />
      <path d="M20,16 L18.5,22 L20,23" />
      <ellipse cx="20" cy="26" rx="4" ry="2.6" fill={GRAY} stroke="none" />
    </g>
  );
}

function IconDante() {
  return (
    <g>
      <path
        d="M12,33 L12,19 Q13,11 19,5 L21,8 L23,9 L24,12 L28,14
           L25,16 L26,17 L24,18 L25,19.5 L22,22 L21,33 Z"
      />
      <ellipse cx="16" cy="7" rx="2.2" ry="1" transform="rotate(-30 16 7)" />
      <ellipse cx="18.7" cy="4.3" rx="2.2" ry="1" transform="rotate(-8 18.7 4.3)" />
    </g>
  );
}

function IconMilanDuomo() {
  return (
    <g>
      <line x1="4" y1="30" x2="36" y2="30" />
      {[
        [5, 24],
        [10, 19],
        [15, 22],
        [20, 15],
        [25, 22],
        [30, 19],
        [35, 24],
      ].map(([x, y], i) => (
        <path key={i} d={`M${x},30 L${x},${y + 2} L${x + 1.5},${y} L${x + 3},${y + 2} L${x + 3},30`} />
      ))}
    </g>
  );
}

function IconPalioSiena() {
  return (
    <g>
      <path d="M9,20 Q8,13 16,13 L24,13 Q27,13 27,16.5 Q27,20 24,20 Z" />
      <path d="M24,13 Q27,8 32,6.5 L34,8 L31,9.3 Q28.5,9 27,11" />
      <path d="M32,6.5 L34.3,4.7 L33.5,7.8" />
      <path d="M9,15.5 Q4.5,15.8 5.7,20.5 Q7,18 9,17.5" />
      <path d="M23,20 L21.3,28 L23.6,28" />
      <path d="M18.5,20 L17.3,28 L19.6,28" />
      <path d="M13.5,20 L11.3,28 L13.6,28" />
      <path d="M16.5,20 L14.6,28 L16.9,28" />
    </g>
  );
}

function IconVenetianMask() {
  return (
    <g>
      <path d="M4,17 Q4,9 13,9 Q19,9 20,13 Q21,9 27,9 Q36,9 36,17 Q36,24 27,22 Q21,25 20,21 Q19,25 13,22 Q4,24 4,17 Z" />
      <circle cx="12.5" cy="16" r="3.4" />
      <circle cx="27.5" cy="16" r="3.4" />
      <path d="M20,13 L20,19" />
      <path d="M36,15 Q41,12 39,18 Q41,20 38,21" />
    </g>
  );
}

function IconVatican() {
  return (
    <g>
      <rect x="9" y="25" width="22" height="5" />
      <path d="M10,25 Q10,13 20,11 Q30,13 30,25 Z" />
      <line x1="14" y1="16" x2="14" y2="25" />
      <line x1="20" y1="11.5" x2="20" y2="25" />
      <line x1="26" y1="16" x2="26" y2="25" />
      {[10.5, 14.5, 25.5, 29.5].map((x) => (
        <line key={x} x1={x} y1="30" x2={x} y2="33" />
      ))}
      <line x1="20" y1="5" x2="20" y2="11" />
      <line x1="17.5" y1="7" x2="22.5" y2="7" />
    </g>
  );
}

function IconPizza() {
  return (
    <g>
      <path d="M20,8 L33,30 Q20,36 7,30 Z" />
      <path d="M9,29 Q20,34 31,29" />
      <circle cx="18" cy="18" r="1.3" fill={GRAY} stroke="none" />
      <circle cx="23" cy="22" r="1.3" fill={GRAY} stroke="none" />
      <circle cx="17" cy="24" r="1.3" fill={GRAY} stroke="none" />
    </g>
  );
}

function IconVespa() {
  return (
    <g>
      <circle cx="11" cy="28" r="3.2" />
      <circle cx="29" cy="28" r="3.2" />
      <path d="M14,28 Q14,19 22,19 Q28,19 28,24 Q28,26 25,26 L14,26" />
      <path d="M22,19 Q24,14 29,13" />
      <path d="M27.5,11.5 L31,12.5" />
      <path d="M17,19 L15,15" />
    </g>
  );
}

function IconTrevi() {
  return (
    <g>
      <path d="M3,29 Q20,34 37,29 Q20,32 3,29 Z" />
      <path d="M9,26 Q20,29 31,26 Q20,28.5 9,26 Z" />
      <path d="M20,24 Q19,18 20,15 Q21,18 20,24" />
      <path d="M14,22 Q13.3,18 15,16" />
      <path d="M26,22 Q26.7,18 25,16" />
      <rect x="17.5" y="8" width="5" height="7" rx="1" />
    </g>
  );
}

const ICONS: { render: () => React.ReactNode; x: number; y: number; rotate?: number; scale?: number }[] = [
  { render: IconColosseum, x: 30, y: 40 },
  { render: IconPisaTower, x: 210, y: 30, rotate: 4 },
  { render: IconRialtoBridge, x: 400, y: 60, rotate: -3 },
  { render: IconFlorenceDuomo, x: 90, y: 190 },
  { render: IconGondola, x: 320, y: 200, rotate: 6 },
  { render: IconVesuvius, x: 500, y: 220 },
  { render: IconBoccaDellaVerita, x: 20, y: 330, rotate: -5 },
  { render: IconDante, x: 230, y: 340, rotate: 4 },
  { render: IconMilanDuomo, x: 420, y: 360 },
  { render: IconPalioSiena, x: 130, y: 480, rotate: -4 },
  { render: IconVenetianMask, x: 340, y: 500, rotate: 5 },
  { render: IconVatican, x: 20, y: 560 },
  { render: IconPizza, x: 480, y: 480, rotate: 8 },
  { render: IconVespa, x: 220, y: 590, rotate: -6 },
  { render: IconTrevi, x: 500, y: 60 },
];

const TILE = 560;

export function ItalyBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden="true">
      <svg width="100%" height="100%">
        <defs>
          <pattern
            id="italyPattern"
            width={TILE}
            height={TILE}
            patternUnits="userSpaceOnUse"
          >
            <g fill="none" stroke={GRAY} strokeWidth="1" strokeLinejoin="round" strokeLinecap="round">
              {ICONS.map((icon, i) => (
                <g
                  key={i}
                  transform={`translate(${icon.x},${icon.y}) rotate(${icon.rotate ?? 0} 20 20) scale(${
                    icon.scale ?? 1
                  })`}
                >
                  {icon.render()}
                </g>
              ))}
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#italyPattern)" opacity="0.55" />
      </svg>
    </div>
  );
}
