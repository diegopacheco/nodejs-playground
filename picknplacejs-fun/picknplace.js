export function createPickPlace(options = {}) {
  const root = options.root || document;
  const listSelector = options.listSelector || ".pnp-list";
  const itemSelector = options.itemSelector || ".pnp-item";
  const pickSelector = options.pickSelector || ".pnp-pick";

  let pickedItem = null;
  let ghost = null;

  const createGhost = (item) => {
    ghost = item.cloneNode(true);
    ghost.classList.add("pnp-ghost");
    const rect = item.getBoundingClientRect();
    ghost.style.position = "fixed";
    ghost.style.width = rect.width + "px";
    ghost.style.pointerEvents = "none";
    ghost.style.left = rect.left + "px";
    ghost.style.top = rect.top + "px";
    document.body.appendChild(ghost);
  };

  const destroyGhost = () => {
    if (ghost) {
      ghost.remove();
      ghost = null;
    }
  };

  const moveGhost = (e) => {
    if (!ghost) return;
    ghost.style.left = e.clientX - ghost.offsetWidth / 2 + "px";
    ghost.style.top = e.clientY - ghost.offsetHeight / 2 + "px";
  };

  const getItemUnderMouse = (e) => {
    const items = document.querySelectorAll(itemSelector);
    for (const item of items) {
      if (item === pickedItem) continue;
      const rect = item.getBoundingClientRect();
      if (e.clientY >= rect.top && e.clientY <= rect.bottom) {
        return item;
      }
    }
    return null;
  };

  const onMouseMove = (e) => {
    if (!pickedItem) return;
    moveGhost(e);

    const target = getItemUnderMouse(e);
    if (target) {
      const list = target.closest(listSelector);
      const items = Array.from(list.children);
      const pickedIdx = items.indexOf(pickedItem);
      const targetIdx = items.indexOf(target);

      if (pickedIdx < targetIdx) {
        target.after(pickedItem);
      } else {
        target.before(pickedItem);
      }
    }
  };

  const onClick = (e) => {
    const pickBtn = e.target.closest(pickSelector);
    if (!pickBtn) return;

    e.preventDefault();
    e.stopPropagation();

    const item = pickBtn.closest(itemSelector);
    if (!item) return;

    if (pickedItem) {
      pickedItem.classList.remove("pnp-picked");
      destroyGhost();

      const allButtons = document.querySelectorAll(pickSelector);
      allButtons.forEach(btn => btn.textContent = "Pick");

      pickedItem = null;
      document.removeEventListener("mousemove", onMouseMove);
    } else {
      pickedItem = item;
      pickedItem.classList.add("pnp-picked");
      createGhost(item);

      const allButtons = document.querySelectorAll(pickSelector);
      allButtons.forEach(btn => btn.textContent = "Place");

      document.addEventListener("mousemove", onMouseMove);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Escape" && pickedItem) {
      pickedItem.classList.remove("pnp-picked");
      destroyGhost();

      const allButtons = document.querySelectorAll(pickSelector);
      allButtons.forEach(btn => btn.textContent = "Pick");

      pickedItem = null;
      document.removeEventListener("mousemove", onMouseMove);
    }
  };

  const init = () => {
    root.addEventListener("click", onClick, true);
    root.addEventListener("keydown", onKeyDown, true);
  };

  return { init };
}
