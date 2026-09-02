const BUDGET = [
  { value: "Any", label: "Any budget" },
  { value: "Free", label: "Free" },
  { value: "$", label: "$" },
  { value: "$$", label: "$$" },
  { value: "$$$", label: "$$$" },
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

budgetSlider.addEventListener("input", () => {
  updateBudget(budgetSlider.value);
});

updateBudget(budgetSlider.value);
