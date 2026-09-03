(function () {
  document.querySelectorAll(".vibe-checkbox").forEach((input) => {
    const label = document.querySelector(`label[for="${input.id}"]`);
    if (!label) return;

    const color = window.getVibeColor ? window.getVibeColor(input.value) : null;

    input.addEventListener("change", () => {
      if (input.checked && color) {
        label.style.backgroundColor = color.bg;
        label.style.color = color.fg;
        label.style.borderColor = "transparent";
      } else {
        label.style.backgroundColor = "";
        label.style.color = "";
        label.style.borderColor = "";
      }
    });
  });
})();
