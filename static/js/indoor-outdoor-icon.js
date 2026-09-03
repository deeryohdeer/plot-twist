const indoorOutdoorIcons = document.querySelectorAll(".indoorOutdoor-icon");
const indoorOutdoorRadios = document.querySelectorAll(
  'input[name="indoorOutdoor"]',
);

function updateIndoorOutdoorIcon(value) {
  indoorOutdoorIcons.forEach((icon) => {
    const isActive = icon.dataset.value === value;
    icon.classList.toggle("hidden", !isActive);
    icon.classList.toggle("flex", isActive);
  });
}

indoorOutdoorRadios.forEach((radio) => {
  radio.addEventListener("change", () => {
    if (radio.checked) updateIndoorOutdoorIcon(radio.value);
  });
});

const checkedIndoorOutdoorRadio = document.querySelector(
  'input[name="indoorOutdoor"]:checked',
);
if (checkedIndoorOutdoorRadio)
  updateIndoorOutdoorIcon(checkedIndoorOutdoorRadio.value);
