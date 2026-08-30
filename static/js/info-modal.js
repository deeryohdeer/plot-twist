const WELCOME_SEEN_KEY = "plottwist_seen_welcome";

const infoModalBackdrop = document.getElementById("info-modal-backdrop");
const infoModalOpenBtn = document.getElementById("info-modal-open");
const infoModalCloseBtn = document.getElementById("info-modal-close");

function openInfoModal() {
  infoModalBackdrop.classList.remove("hidden");
  infoModalBackdrop.classList.add("flex");
}

function closeInfoModal() {
  infoModalBackdrop.classList.add("hidden");
  infoModalBackdrop.classList.remove("flex");
}

infoModalOpenBtn.addEventListener("click", openInfoModal);
infoModalCloseBtn.addEventListener("click", closeInfoModal);

infoModalBackdrop.addEventListener("click", (e) => {
  if (e.target === infoModalBackdrop) closeInfoModal();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && infoModalBackdrop.classList.contains("flex")) {
    closeInfoModal();
  }
});

if (!localStorage.getItem(WELCOME_SEEN_KEY)) {
  openInfoModal();
  localStorage.setItem(WELCOME_SEEN_KEY, "true");
}
