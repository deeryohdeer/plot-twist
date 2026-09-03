(function () {
  const VIBE_COLORS = ["#f6c146", "#f45f57", "#4c956c", "#a09ebb"];
  let lastColor = null;

  function pickColor() {
    const choices = VIBE_COLORS.filter((c) => c !== lastColor);
    const color = choices[Math.floor(Math.random() * choices.length)];
    lastColor = color;
    return color;
  }

  document.querySelectorAll(".vibe-checkbox").forEach((input) => {
    const label = document.querySelector(`label[for="${input.id}"]`);
    if (!label) return;

    input.addEventListener("change", () => {
      label.style.backgroundColor = input.checked ? pickColor() : "";
      label.style.color = input.checked ? "#fff" : "";
    });
  });
})();
