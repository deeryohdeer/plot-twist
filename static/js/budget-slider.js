const BUDGET = [
  { value: "Any", label: "Any budget" },
  { value: "Free", label: "Free" },
  { value: "$", label: "Cheapo" },
  { value: "$$", label: "Treat yo self" },
  { value: "$$$", label: "Make it rain" },
];

const budgetSlider = document.getElementById("budget-slider");
const budgetInput = document.getElementById("budget");
const budgetValueLabel = document.getElementById("budget-value");
const budgetIcons = document.querySelectorAll(".budget-icon");

function updateBudget(index) {
  const { value, label } = BUDGET[index];
  budgetInput.value = value;
  budgetValueLabel.textContent = label;
  budgetIcons.forEach((icon) => {
    const isActive = icon.dataset.index === String(index);
    icon.classList.toggle("hidden", !isActive);
    icon.classList.toggle("flex", isActive);
  });
}

// The input uses a fractional step so the thumb glides smoothly under the
// cursor instead of hopping between whole positions; we round here for
// the discrete icon/label logic.
function budgetIndex() {
  return Math.round(Number(budgetSlider.value));
}

budgetSlider.addEventListener("input", () => {
  updateBudget(budgetIndex());
});

// Once the user lets go, snap the thumb to a clean resting position.
budgetSlider.addEventListener("change", () => {
  budgetSlider.value = String(budgetIndex());
});

budgetSlider.addEventListener("keydown", (event) => {
  const step = { ArrowLeft: -1, ArrowDown: -1, ArrowRight: 1, ArrowUp: 1 }[
    event.key
  ];
  if (step === undefined) return;
  event.preventDefault();
  const next = Math.min(BUDGET.length - 1, Math.max(0, budgetIndex() + step));
  budgetSlider.value = String(next);
  updateBudget(next);
});

updateBudget(budgetIndex());
