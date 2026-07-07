export type Suit = "♠" | "♥" | "♦" | "♣";

export interface Card {
  suit: Suit;
  rank: string;
  value: number;
}

export const suits: Suit[] = ["♠", "♥", "♦", "♣"];
export const ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

export function buildDeck(): Card[] {
  return suits.flatMap((suit) =>
    ranks.map((rank, i) => ({ suit, rank, value: i + 1 }))
  );
}

export function shuffle(deck: Card[]): Card[] {
  const copy = [...deck];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j]!, copy[i]!];
  }
  return copy;
}

export function isRed(card: Card): boolean {
  return card.suit === "♥" || card.suit === "♦";
}

export function cardLabel(card: Card): string {
  return `${card.rank}${card.suit}`;
}
