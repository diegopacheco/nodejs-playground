import { Pet } from "./Pet";
import { moodOf, usePet } from "./usePet";
import type { Stats } from "./usePet";

const bars: { key: keyof Stats; label: string; icon: string; color: string }[] = [
  { key: "hunger", label: "Hunger", icon: "🍔", color: "#ff8c5a" },
  { key: "happiness", label: "Happiness", icon: "🎈", color: "#ffd23f" },
  { key: "energy", label: "Energy", icon: "⚡", color: "#56c2ff" },
  { key: "hygiene", label: "Hygiene", icon: "🛁", color: "#7ed957" }
];

const moodText: Record<string, string> = {
  happy: "feeling great!",
  content: "doing okay",
  sad: "feeling lonely",
  sick: "feeling sick...",
  sleeping: "fast asleep",
  dead: "has passed away"
};

function StatBar({ label, icon, color, value }: { label: string; icon: string; color: string; value: number }) {
  const low = value <= 20;
  return (
    <div className="stat">
      <div className="stat-head">
        <span>{icon} {label}</span>
        <span className={low ? "stat-value low" : "stat-value"}>{Math.round(value)}</span>
      </div>
      <div className="stat-track">
        <div className="stat-fill" style={{ width: `${value}%`, background: color }} />
      </div>
    </div>
  );
}

export default function App() {
  const { pet, feed, play, clean, toggleSleep, reset } = usePet("Tsuki");
  const mood = moodOf(pet);
  const dead = !pet.alive;

  return (
    <main className="app">
      <header className="topbar">
        <h1>TS7 Tamagotchi</h1>
        <span className="badge">built with TypeScript 7 · tsgo</span>
      </header>

      <section className="console">
        <div className="screen">
          <div className="screen-top">
            <span className="age">Day {pet.age}</span>
            <span className="name">{pet.name}</span>
          </div>
          <Pet mood={mood} name={pet.name} />
          <p className="status">{pet.name} {moodText[mood]}</p>
          {dead && (
            <div className="overlay">
              <p>Game Over</p>
              <button className="restart" onClick={reset}>Hatch a new one 🥚</button>
            </div>
          )}
        </div>

        <div className="stats">
          {bars.map((b) => (
            <StatBar key={b.key} label={b.label} icon={b.icon} color={b.color} value={pet.stats[b.key]} />
          ))}
        </div>

        <div className="actions">
          <button onClick={feed} disabled={dead || pet.sleeping}>🍔<span>Feed</span></button>
          <button onClick={play} disabled={dead || pet.sleeping}>🎮<span>Play</span></button>
          <button onClick={clean} disabled={dead}>🧼<span>Clean</span></button>
          <button onClick={toggleSleep} disabled={dead} className={pet.sleeping ? "active" : ""}>
            {pet.sleeping ? "⏰" : "😴"}<span>{pet.sleeping ? "Wake" : "Sleep"}</span>
          </button>
        </div>
      </section>

      <footer className="foot">Keep every bar above zero — neglect makes Tsuki sick.</footer>
    </main>
  );
}
