import { buildDeck, isRed, shuffle, type Card } from "./cards";

export interface PlayCard extends Card {
  faceUp: boolean;
}

export interface Game {
  stock: PlayCard[];
  waste: PlayCard[];
  foundations: PlayCard[][];
  tableau: PlayCard[][];
}

export function newGame(): Game {
  const cards: PlayCard[] = shuffle(buildDeck()).map((card) => ({ ...card, faceUp: false }));
  const tableau: PlayCard[][] = [];
  for (let col = 0; col < 7; col++) {
    const pile = cards.splice(0, col + 1);
    pile[pile.length - 1]!.faceUp = true;
    tableau.push(pile);
  }
  return { stock: cards, waste: [], foundations: [[], [], [], []], tableau };
}

export function drawFromStock(game: Game): void {
  const card = game.stock.pop();
  if (card) {
    card.faceUp = true;
    game.waste.push(card);
  } else {
    game.stock = game.waste.reverse().map((c) => ({ ...c, faceUp: false }));
    game.waste = [];
  }
}

export function canPlaceOnTableau(card: Card, pile: PlayCard[]): boolean {
  const top = pile[pile.length - 1];
  if (!top) return card.value === 13;
  return top.faceUp && top.value === card.value + 1 && isRed(top) !== isRed(card);
}

export function canPlaceOnFoundation(card: Card, pile: PlayCard[]): boolean {
  const top = pile[pile.length - 1];
  if (!top) return card.value === 1;
  return top.suit === card.suit && card.value === top.value + 1;
}

export function flipExposed(pile: PlayCard[]): void {
  const last = pile[pile.length - 1];
  if (last && !last.faceUp) last.faceUp = true;
}

export function isWon(game: Game): boolean {
  return game.foundations.every((pile) => pile.length === 13);
}
