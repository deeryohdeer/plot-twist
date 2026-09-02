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

// The input uses a fractional step so the thumb glides smoothly under the
// cursor instead of hopping between whole positions; we round here for
// the discrete icon/label logic.
function numPplIndex() {
  return Math.round(Number(numPplSlider.value));
}

numPplSlider.addEventListener("input", () => {
  updateNumPpl(numPplIndex());
});

// Once the user lets go, snap the thumb to a clean resting position.
numPplSlider.addEventListener("change", () => {
  numPplSlider.value = String(numPplIndex());
});

numPplSlider.addEventListener("keydown", (event) => {
  const step = { ArrowLeft: -1, ArrowDown: -1, ArrowRight: 1, ArrowUp: 1 }[
    event.key
  ];
  if (step === undefined) return;
  event.preventDefault();
  const next = Math.min(
    NUM_PPL.length - 1,
    Math.max(0, numPplIndex() + step),
  );
  numPplSlider.value = String(next);
  updateNumPpl(next);
});

updateNumPpl(numPplIndex());
