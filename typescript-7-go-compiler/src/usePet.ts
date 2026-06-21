import { useCallback, useEffect, useState } from "react";

export type Stats = {
  hunger: number;
  happiness: number;
  energy: number;
  hygiene: number;
};

export type Mood = "happy" | "content" | "sad" | "sick" | "sleeping" | "dead";

export type Pet = {
  name: string;
  stats: Stats;
  age: number;
  alive: boolean;
  sleeping: boolean;
  sickStreak: number;
};

export const TICK_MS = 2500;
const DECAY = 4;
const SLEEP_RECOVER = 14;
const DEATH_THRESHOLD = 6;

const clamp = (value: number) => Math.max(0, Math.min(100, value));

const newPet = (name: string): Pet => ({
  name,
  stats: { hunger: 80, happiness: 80, energy: 80, hygiene: 80 },
  age: 0,
  alive: true,
  sleeping: false,
  sickStreak: 0
});

const isSick = (stats: Stats) => stats.hunger === 0 || stats.hygiene === 0;

export const moodOf = (pet: Pet): Mood => {
  if (!pet.alive) return "dead";
  if (pet.sleeping) return "sleeping";
  if (isSick(pet.stats)) return "sick";
  const { hunger, happiness, energy, hygiene } = pet.stats;
  const avg = (hunger + happiness + energy + hygiene) / 4;
  if (avg >= 65) return "happy";
  if (avg >= 35) return "content";
  return "sad";
};

const tick = (pet: Pet): Pet => {
  if (!pet.alive) return pet;
  const stats = { ...pet.stats };
  if (pet.sleeping) {
    stats.energy = clamp(stats.energy + SLEEP_RECOVER);
    stats.hunger = clamp(stats.hunger - DECAY / 2);
  } else {
    stats.hunger = clamp(stats.hunger - DECAY);
    stats.happiness = clamp(stats.happiness - DECAY);
    stats.energy = clamp(stats.energy - DECAY);
    stats.hygiene = clamp(stats.hygiene - DECAY);
  }
  const sleeping = pet.sleeping && stats.energy < 100;
  const sickStreak = isSick(stats) ? pet.sickStreak + 1 : 0;
  const alive = sickStreak < DEATH_THRESHOLD;
  return { ...pet, stats, sleeping, sickStreak, alive, age: pet.age + 1 };
};

export function usePet(name: string) {
  const [pet, setPet] = useState<Pet>(() => newPet(name));

  useEffect(() => {
    const id = setInterval(() => setPet(tick), TICK_MS);
    return () => clearInterval(id);
  }, []);

  const feed = useCallback(() => {
    setPet((p) =>
      !p.alive || p.sleeping
        ? p
        : { ...p, stats: { ...p.stats, hunger: clamp(p.stats.hunger + 28) } }
    );
  }, []);

  const play = useCallback(() => {
    setPet((p) =>
      !p.alive || p.sleeping || p.stats.energy === 0
        ? p
        : {
            ...p,
            stats: {
              ...p.stats,
              happiness: clamp(p.stats.happiness + 26),
              energy: clamp(p.stats.energy - 12)
            }
          }
    );
  }, []);

  const clean = useCallback(() => {
    setPet((p) =>
      !p.alive
        ? p
        : { ...p, stats: { ...p.stats, hygiene: clamp(p.stats.hygiene + 34) } }
    );
  }, []);

  const toggleSleep = useCallback(() => {
    setPet((p) => (!p.alive ? p : { ...p, sleeping: !p.sleeping }));
  }, []);

  const reset = useCallback(() => setPet(newPet(name)), [name]);

  return { pet, feed, play, clean, toggleSleep, reset };
}
