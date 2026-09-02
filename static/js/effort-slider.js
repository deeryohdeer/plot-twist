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

effortSlider.addEventListener("input", () => {
  updateEffort(effortSlider.value);
});

updateEffort(effortSlider.value);
