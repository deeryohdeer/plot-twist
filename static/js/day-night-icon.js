const dayNightIcons = document.querySelectorAll(".dayNight-icon");
const dayNightRadios = document.querySelectorAll('input[name="dayNight"]');

function updateDayNightIcon(value) {
  dayNightIcons.forEach((icon) => {
    const isActive = icon.dataset.value === value;
    icon.classList.toggle("hidden", !isActive);
    icon.classList.toggle("flex", isActive);
  });
}

dayNightRadios.forEach((radio) => {
  radio.addEventListener("change", () => {
    if (radio.checked) updateDayNightIcon(radio.value);
  });
});

const checkedDayNightRadio = document.querySelector(
  'input[name="dayNight"]:checked',
);
if (checkedDayNightRadio) updateDayNightIcon(checkedDayNightRadio.value);
