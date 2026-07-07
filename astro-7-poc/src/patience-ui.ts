import { makeCardEl } from "./dom";
import {
  canPlaceOnFoundation,
  canPlaceOnTableau,
  drawFromStock,
  flipExposed,
  isWon,
  newGame,
  type Game,
  type PlayCard
} from "./patience";

type Selection = { source: "waste" } | { source: "tableau"; col: number; index: number };

let game: Game = newGame();
let selected: Selection | null = null;

function selectedCards(): PlayCard[] {
  if (!selected) return [];
  if (selected.source === "waste") return game.waste.slice(-1);
  return game.tableau[selected.col]!.slice(selected.index);
}

function takeSelected(): PlayCard[] {
  if (selected!.source === "waste") return [game.waste.pop()!];
  const pile = game.tableau[(selected as { col: number }).col]!;
  const moved = pile.splice((selected as { index: number }).index);
  flipExposed(pile);
  return moved;
}

function tryMoveToTableau(col: number): void {
  const cards = selectedCards();
  if (cards.length > 0 && canPlaceOnTableau(cards[0]!, game.tableau[col]!)) {
    game.tableau[col]!.push(...takeSelected());
  }
  selected = null;
  render();
}

function tryMoveToFoundation(slot: number): void {
  const cards = selectedCards();
  if (cards.length === 1 && canPlaceOnFoundation(cards[0]!, game.foundations[slot]!)) {
    game.foundations[slot]!.push(...takeSelected());
  }
  selected = null;
  render();
}

function isSelected(source: string, col: number, index: number): boolean {
  if (!selected) return false;
  if (selected.source === "waste") return source === "waste";
  return source === "tableau" && selected.col === col && index >= selected.index;
}

function makeSlot(label: string): HTMLDivElement {
  const slot = document.createElement("div");
  slot.className = "card slot";
  slot.textContent = label;
  return slot;
}

function render(): void {
  const stockEl = document.querySelector("#patience-stock")!;
  const wasteEl = document.querySelector("#patience-waste")!;
  const foundationsEl = document.querySelector("#patience-foundations")!;
  const tableauEl = document.querySelector("#patience-tableau")!;
  const statusEl = document.querySelector("#patience-status")!;

  const stockTop = game.stock[game.stock.length - 1];
  const stockCard = stockTop ? makeCardEl(stockTop, false) : makeSlot("↻");
  stockCard.addEventListener("click", () => {
    selected = null;
    drawFromStock(game);
    render();
  });
  stockEl.replaceChildren(stockCard);

  const wasteTop = game.waste[game.waste.length - 1];
  if (wasteTop) {
    const wasteCard = makeCardEl(wasteTop);
    wasteCard.classList.toggle("selected", isSelected("waste", 0, 0));
    wasteCard.addEventListener("click", () => {
      selected = selected?.source === "waste" ? null : { source: "waste" };
      render();
    });
    wasteEl.replaceChildren(wasteCard);
  } else {
    wasteEl.replaceChildren(makeSlot(""));
  }

  foundationsEl.replaceChildren(
    ...game.foundations.map((pile, slot) => {
      const top = pile[pile.length - 1];
      const el = top ? makeCardEl(top) : makeSlot("A");
      el.addEventListener("click", () => tryMoveToFoundation(slot));
      return el;
    })
  );

  tableauEl.replaceChildren(
    ...game.tableau.map((pile, col) => {
      const column = document.createElement("div");
      column.className = "stack";
      if (pile.length === 0) {
        const empty = makeSlot("K");
        empty.addEventListener("click", () => tryMoveToTableau(col));
        column.append(empty);
        return column;
      }
      pile.forEach((card, index) => {
        const el = makeCardEl(card, card.faceUp);
        el.classList.toggle("selected", isSelected("tableau", col, index));
        el.addEventListener("click", () => {
          if (!card.faceUp) return;
          if (selected) {
            tryMoveToTableau(col);
          } else {
            selected = { source: "tableau", col, index };
            render();
          }
        });
        column.append(el);
      });
      return column;
    })
  );

  statusEl.textContent = isWon(game)
    ? "You won!"
    : `Stock ${game.stock.length} · Waste ${game.waste.length} · Foundations ${game.foundations.reduce((n, p) => n + p.length, 0)}/52`;
}

export function initPatience(): void {
  document.querySelector("#patience-new")!.addEventListener("click", () => {
    game = newGame();
    selected = null;
    render();
  });
  render();
}
