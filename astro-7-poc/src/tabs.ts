const tabIds = ["deck", "feedback", "patience"];

function activate(id: string): void {
  for (const tabId of tabIds) {
    document.querySelector(`#tab-${tabId}`)!.classList.toggle("active", tabId === id);
    document.querySelector(`#panel-${tabId}`)!.classList.toggle("active", tabId === id);
  }
}

export function initTabs(): void {
  for (const tabId of tabIds) {
    document.querySelector(`#tab-${tabId}`)!.addEventListener("click", () => {
      history.replaceState(null, "", `#${tabId}`);
      activate(tabId);
    });
  }
  const fromHash = location.hash.slice(1);
  activate(tabIds.includes(fromHash) ? fromHash : "deck");
}
