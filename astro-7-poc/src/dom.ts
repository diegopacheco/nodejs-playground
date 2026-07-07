import { cardLabel, isRed, type Card } from "./cards";

export function makeCardEl(card: Card, faceUp = true): HTMLDivElement {
  const el = document.createElement("div");
  el.className = faceUp ? `card ${isRed(card) ? "red" : "black"}` : "card back";
  if (faceUp) {
    const top = document.createElement("span");
    top.className = "corner";
    top.textContent = cardLabel(card);
    const pip = document.createElement("span");
    pip.className = "pip";
    pip.textContent = card.suit;
    el.append(top, pip);
  }
  return el;
}
