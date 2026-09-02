const NUM_PPL = [
  { value: "Any", label: "Any group size" },
  { value: "Just myself", label: "Just myself" },
  { value: "Two people", label: "Two people" },
  { value: "Small group", label: "Small group" },
  { value: "Big group", label: "Big group" },
];

const numPplSlider = document.getElementById("numPpl-slider");
const numPplInput = document.getElementById("numPpl");
const numPplValueLabel = document.getElementById("numPpl-value");
const numPplIcons = document.querySelectorAll(".numPpl-icon");

function updateNumPpl(index) {
  const { value, label } = NUM_PPL[index];
  numPplInput.value = value;
  numPplValueLabel.textContent = label;
  numPplIcons.forEach((icon) => {
    const isActive = icon.dataset.index === String(index);
    icon.classList.toggle("hidden", !isActive);
    icon.classList.toggle("flex", isActive);
  });
}

numPplSlider.addEventListener("input", () => {
  updateNumPpl(numPplSlider.value);
});

updateNumPpl(numPplSlider.value);
