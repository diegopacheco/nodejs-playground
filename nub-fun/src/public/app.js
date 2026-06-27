const $ = (id) => document.getElementById(id);

async function loadInfo() {
  const info = await fetch("/api/info").then((r) => r.json());
  $("info-runtime").textContent = info.runtime;
  $("info-language").textContent = info.language;
  $("info-node").textContent = info.node;
  $("info-platform").textContent = info.platform;
  $("info-uptime").textContent = `${info.uptimeSeconds}s`;
}

function render(notes) {
  const list = $("notes");
  list.innerHTML = "";
  if (notes.length === 0) {
    const li = document.createElement("li");
    li.className = "empty";
    li.textContent = "No notes yet.";
    list.appendChild(li);
    return;
  }
  for (const note of notes) {
    const li = document.createElement("li");
    const span = document.createElement("span");
    span.textContent = note.text;
    const time = document.createElement("time");
    time.textContent = new Date(note.at).toLocaleTimeString();
    li.append(span, time);
    list.appendChild(li);
  }
}

async function loadNotes() {
  render(await fetch("/api/notes").then((r) => r.json()));
}

$("note-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const input = $("note-input");
  const text = input.value.trim();
  if (!text) return;
  await fetch("/api/notes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  input.value = "";
  loadNotes();
});

$("clear").addEventListener("click", async () => {
  await fetch("/api/notes", { method: "DELETE" });
  loadNotes();
});

loadInfo();
loadNotes();
setInterval(loadInfo, 5000);
