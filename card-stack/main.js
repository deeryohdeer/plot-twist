const stack = document.getElementById("stack");
const counter = document.getElementById("counter");
const restart = document.getElementById("restart");

let cards = [...stack.querySelectorAll(".card")].reverse(); // top card last
let remaining = cards.length;

// ── Position cards in stack ──
function layoutStack() {
  const visible = cards.filter((c) => !c.dataset.gone);
  visible.forEach((card, i) => {
    const fromTop = visible.length - 1 - i;
    const offset = fromTop * 10;
    const scale = 1 - fromTop * 0.04;
    card.style.transition = "transform .4s cubic-bezier(.34,1.2,.64,1)";
    card.style.transform = `translateY(${offset}px) scale(${scale})`;
    card.style.zIndex = i;
  });
}
layoutStack();

// ── Drag logic ──
function initCard(card) {
  let startX = 0,
    startY = 0;
  let currentX = 0;
  let dragging = false;

  const like = card.querySelector(".card-like");
  const nope = card.querySelector(".card-nope");

  function onStart(e) {
    if (card.dataset.gone) return;
    const visible = cards.filter((c) => !c.dataset.gone);
    if (card !== visible[visible.length - 1]) return; // only top card

    dragging = true;
    const pt = e.touches ? e.touches[0] : e;
    startX = pt.clientX;
    startY = pt.clientY;
    card.style.transition = "none";
    e.preventDefault();
  }

  function onMove(e) {
    if (!dragging) return;
    const pt = e.touches ? e.touches[0] : e;
    currentX = pt.clientX - startX;
    const currentY = pt.clientY - startY;
    const rot = currentX * 0.08;

    card.style.transform = `translate(${currentX}px,${currentY}px) rotate(${rot}deg)`;

    // Show like/nope
    const pct = Math.min(Math.abs(currentX) / 80, 1);
    if (currentX > 20) {
      like.style.opacity = pct;
      nope.style.opacity = 0;
    } else if (currentX < -20) {
      nope.style.opacity = pct;
      like.style.opacity = 0;
    } else {
      like.style.opacity = 0;
      nope.style.opacity = 0;
    }
  }

  function onEnd() {
    if (!dragging) return;
    dragging = false;
    like.style.opacity = 0;
    nope.style.opacity = 0;

    const THRESHOLD = 100;
    if (Math.abs(currentX) > THRESHOLD) {
      dismiss(card, currentX > 0 ? 1 : -1);
    } else {
      card.style.transition = "transform .5s cubic-bezier(.34,1.56,.64,1)";
      layoutStack();
    }
  }

  card.addEventListener("pointerdown", onStart);
  window.addEventListener("pointermove", onMove);
  window.addEventListener("pointerup", onEnd);
}

function dismiss(card, dir) {
  card.style.transition = "transform .5s cubic-bezier(.4,0,.6,1), opacity .5s";
  card.style.transform = `translate(${dir * 600}px, 50px) rotate(${dir * 25}deg)`;
  card.style.opacity = "0";
  card.dataset.gone = "1";

  remaining--;
  counter.textContent =
    remaining === 0
      ? "Out of cards :("
      : `${remaining} card${remaining > 1 ? "s" : ""} remaining`;

  if (remaining === 0) restart.style.display = "block";

  setTimeout(() => layoutStack(), 50);
}

cards.forEach(initCard);

restart.addEventListener("click", () => {
  cards.forEach((card) => {
    delete card.dataset.gone;
    card.style.opacity = "1";
  });
  remaining = cards.length;
  counter.textContent = `${remaining} cards remaining`;
  restart.style.display = "none";
  layoutStack();
});
