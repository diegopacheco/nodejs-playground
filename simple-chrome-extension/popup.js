document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("clickMe");
    if (btn) {
      btn.addEventListener("click", () => {
        alert("Button clicked!");
      });
    }
  });