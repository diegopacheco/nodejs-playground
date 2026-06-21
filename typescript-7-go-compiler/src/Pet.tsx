import type { Mood } from "./usePet";

const palette: Record<Mood, string> = {
  happy: "#7ed957",
  content: "#9bd0ff",
  sad: "#b3a4e0",
  sick: "#c9d36a",
  sleeping: "#a9b4d6",
  dead: "#b8b8b8"
};

function Eyes({ mood }: { mood: Mood }) {
  if (mood === "dead") {
    return (
      <g stroke="#3a3a3a" strokeWidth="4" strokeLinecap="round">
        <line x1="68" y1="86" x2="82" y2="100" />
        <line x1="82" y1="86" x2="68" y2="100" />
        <line x1="118" y1="86" x2="132" y2="100" />
        <line x1="132" y1="86" x2="118" y2="100" />
      </g>
    );
  }
  if (mood === "sleeping") {
    return (
      <g stroke="#3a3a3a" strokeWidth="4" strokeLinecap="round" fill="none">
        <path d="M64 94 q11 10 22 0" />
        <path d="M114 94 q11 10 22 0" />
      </g>
    );
  }
  return (
    <g fill="#3a3a3a">
      <circle cx="75" cy="94" r="8" />
      <circle cx="125" cy="94" r="8" />
      <circle cx="78" cy="91" r="2.5" fill="#fff" />
      <circle cx="128" cy="91" r="2.5" fill="#fff" />
    </g>
  );
}

function Mouth({ mood }: { mood: Mood }) {
  const stroke = "#3a3a3a";
  if (mood === "happy") {
    return <path d="M82 118 q18 22 36 0" fill="none" stroke={stroke} strokeWidth="4" strokeLinecap="round" />;
  }
  if (mood === "content") {
    return <path d="M86 120 q14 10 28 0" fill="none" stroke={stroke} strokeWidth="4" strokeLinecap="round" />;
  }
  if (mood === "sad") {
    return <path d="M86 126 q14 -12 28 0" fill="none" stroke={stroke} strokeWidth="4" strokeLinecap="round" />;
  }
  if (mood === "sick") {
    return <path d="M84 122 q8 -8 16 0 q8 8 16 0" fill="none" stroke={stroke} strokeWidth="4" strokeLinecap="round" />;
  }
  if (mood === "sleeping") {
    return <ellipse cx="100" cy="122" rx="7" ry="9" fill={stroke} />;
  }
  return <line x1="88" y1="122" x2="112" y2="122" stroke={stroke} strokeWidth="4" strokeLinecap="round" />;
}

export function Pet({ mood, name }: { mood: Mood; name: string }) {
  const color = palette[mood];
  const wobble = mood !== "dead" && mood !== "sleeping";
  return (
    <div className={`pet pet-${mood}`}>
      <svg viewBox="0 0 200 200" width="220" height="220" role="img" aria-label={`${name} is ${mood}`}>
        <ellipse cx="100" cy="178" rx="58" ry="12" fill="rgba(0,0,0,0.12)" />
        <g className={wobble ? "pet-body" : undefined}>
          <path
            d="M100 32 C152 32 168 78 168 116 C168 158 138 178 100 178 C62 178 32 158 32 116 C32 78 48 32 100 32 Z"
            fill={color}
            stroke="rgba(0,0,0,0.18)"
            strokeWidth="3"
          />
          <ellipse cx="78" cy="138" rx="13" ry="9" fill="rgba(255,255,255,0.35)" />
          <ellipse cx="122" cy="138" rx="13" ry="9" fill="rgba(255,255,255,0.35)" />
          <Eyes mood={mood} />
          <Mouth mood={mood} />
          {mood === "sleeping" && (
            <text x="150" y="64" fontSize="22" fill="#3a3a3a" className="pet-zzz">z</text>
          )}
          {mood === "sick" && (
            <text x="150" y="60" fontSize="24">🤒</text>
          )}
        </g>
      </svg>
    </div>
  );
}
