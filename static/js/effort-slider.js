const EFFORT = [
  { value: "Any", label: "I'll put in any effort" },
  { value: "Low", label: "Something easy please" },
  { value: "Medium", label: "I've got a bit of energy" },
  { value: "High", label: "Give me all you got" },
];

// Seconds per back-and-forth cycle, fastest at the top of the slider.
// The gap between steps widens sharply, so "High" reads as a
// screen-shake blur rather than just a fast vibrate.
const EFFORT_SWAY_DURATIONS = [10, 1, 0.1, 0.03];

const effortSlider = document.getElementById("effort-slider");
const effortInput = document.getElementById("effortLevel");
const effortValueLabel = document.getElementById("effort-value");
const effortIconsContainer = document.getElementById("effort-icons");
const effortIcons = document.querySelectorAll(".effort-icon");

function updateEffort(index) {
  const { value, label } = EFFORT[index];
  effortInput.value = value;
  effortValueLabel.textContent = label;
  effortIcons.forEach((icon) => {
    const isActive = icon.dataset.index === String(index);
    icon.classList.toggle("hidden", !isActive);
    icon.classList.toggle("flex", isActive);
  });
  effortIconsContainer.style.setProperty(
    "--effort-duration",
    `${EFFORT_SWAY_DURATIONS[index]}s`,
  );
}

// The input uses a fractional step so the thumb glides smoothly under the
// cursor instead of hopping between whole positions; we round here for
// the discrete icon/label logic.
function effortIndex() {
  return Math.round(Number(effortSlider.value));
}

effortSlider.addEventListener("input", () => {
  updateEffort(effortIndex());
});

// Once the user lets go, snap the thumb to a clean resting position.
effortSlider.addEventListener("change", () => {
  effortSlider.value = String(effortIndex());
});

effortSlider.addEventListener("keydown", (event) => {
  const step = { ArrowLeft: -1, ArrowDown: -1, ArrowRight: 1, ArrowUp: 1 }[
    event.key
  ];
  if (step === undefined) return;
  event.preventDefault();
  const next = Math.min(EFFORT.length - 1, Math.max(0, effortIndex() + step));
  effortSlider.value = String(next);
  updateEffort(next);
});

updateEffort(effortIndex());
