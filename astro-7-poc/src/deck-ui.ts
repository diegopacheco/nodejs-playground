import { buildDeck, shuffle, type Card } from "./cards";
import { makeCardEl } from "./dom";

let pile: Card[] = buildDeck();
let drawn: Card[] = [];

function render(): void {
  const count = document.querySelector("#deck-count")!;
  const pileEl = document.querySelector("#deck-pile")!;
  const drawnEl = document.querySelector("#deck-drawn")!;
  count.textContent = `${pile.length} cards in the deck, ${drawn.length} drawn`;
  pileEl.replaceChildren(...pile.map((card) => makeCardEl(card)));
  drawnEl.replaceChildren(...drawn.map((card) => makeCardEl(card)));
}

export function initDeck(): void {
  document.querySelector("#deck-shuffle")!.addEventListener("click", () => {
    pile = shuffle(pile);
    render();
  });
  document.querySelector("#deck-draw")!.addEventListener("click", () => {
    const card = pile.shift();
    if (card) drawn.unshift(card);
    render();
  });
  document.querySelector("#deck-reset")!.addEventListener("click", () => {
    pile = buildDeck();
    drawn = [];
    render();
  });
  render();
}
