interface Feedback {
  name: string;
  rating: number;
  comment: string;
  when: string;
}

const storageKey = "deck-feedback";

function load(): Feedback[] {
  try {
    return JSON.parse(localStorage.getItem(storageKey) ?? "[]");
  } catch {
    return [];
  }
}

function save(entries: Feedback[]): void {
  localStorage.setItem(storageKey, JSON.stringify(entries));
}

function render(entries: Feedback[]): void {
  const list = document.querySelector("#feedback-list")!;
  list.replaceChildren(
    ...entries.map((entry) => {
      const item = document.createElement("article");
      item.className = "feedback-entry";
      const head = document.createElement("header");
      head.textContent = `${entry.name} rated ${"★".repeat(entry.rating)}${"☆".repeat(5 - entry.rating)} on ${entry.when}`;
      const body = document.createElement("p");
      body.textContent = entry.comment;
      item.append(head, body);
      return item;
    })
  );
}

export function initFeedback(): void {
  const form = document.querySelector<HTMLFormElement>("#feedback-form")!;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const entries = load();
    entries.unshift({
      name: String(data.get("name")),
      rating: Number(data.get("rating")),
      comment: String(data.get("comment")),
      when: new Date().toLocaleString()
    });
    save(entries);
    form.reset();
    render(entries);
  });
  render(load());
}
