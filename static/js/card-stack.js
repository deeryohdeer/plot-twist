(function () {
  const stack = document.getElementById("stack");
  if (!stack) return;

  const counter = document.getElementById("stack-counter");
  const restart = document.getElementById("stack-restart");

  const STACK_DEPTH = 5; // cards beyond this depth stay flattened at the back
  const THRESHOLD = 100;

  const initialOrder = [...stack.querySelectorAll(".card")].reverse(); // top card last
  let cards = [...initialOrder];
  const total = cards.length;
  let removed = 0;

  function visibleCards() {
    return cards.filter((c) => !c.dataset.gone);
  }

  function layoutStack() {
    const visible = visibleCards();
    visible.forEach((card, i) => {
      const fromTop = Math.min(visible.length - 1 - i, STACK_DEPTH - 1);
      const offset = fromTop * 10;
      const scale = 1 - fromTop * 0.04;
      card.style.transition = "transform .4s cubic-bezier(.34,1.2,.64,1)";
      card.style.transform = `translateY(${offset}px) scale(${scale})`;
      card.style.zIndex = i;
    });
  }
  layoutStack();

  function updateCounter() {
    const remaining = total - removed;
    counter.textContent =
      remaining === 0
        ? "All done! 🎉"
        : `${remaining} card${remaining > 1 ? "s" : ""} remaining`;
  }
  updateCounter();

  function dismiss(card) {
    card.style.transition = "transform .5s cubic-bezier(.4,0,.6,1), opacity .5s";
    card.style.transform = "translate(-600px, 50px) rotate(-25deg)";
    card.style.opacity = "0";
    card.dataset.gone = "1";

    removed++;
    updateCounter();
    if (removed === total) restart.style.display = "block";

    setTimeout(layoutStack, 50);
  }

  function requeue(card) {
    card.style.transition = "transform .5s cubic-bezier(.4,0,.6,1), opacity .4s";
    card.style.transform = "translate(600px, 50px) rotate(25deg)";
    card.style.opacity = "0";

    setTimeout(() => {
      cards = cards.filter((c) => c !== card);
      cards.unshift(card);

      // Jump to the back of the stack while invisible, then fade back in.
      card.style.transition = "none";
      card.style.transform = "translateY(60px) scale(0.86)";
      card.offsetHeight; // force reflow so the jump doesn't animate
      card.style.transition = "transform .4s cubic-bezier(.34,1.2,.64,1), opacity .4s";
      card.style.opacity = "1";
      layoutStack();
    }, 500);
  }

  function initCard(card) {
    let startX = 0,
      startY = 0;
    let currentX = 0;
    let dragging = false;

    const like = card.querySelector(".card-like");
    const nope = card.querySelector(".card-nope");

    function onStart(e) {
      if (card.dataset.gone) return;
      const visible = visibleCards();
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

      if (currentX > THRESHOLD) {
        requeue(card);
      } else if (currentX < -THRESHOLD) {
        dismiss(card);
      } else {
        card.style.transition = "transform .5s cubic-bezier(.34,1.56,.64,1)";
        layoutStack();
      }
      currentX = 0;
    }

    card.addEventListener("pointerdown", onStart);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onEnd);
  }

  cards.forEach(initCard);

  restart.addEventListener("click", () => {
    cards = [...initialOrder];
    cards.forEach((card) => {
      delete card.dataset.gone;
      card.style.transition = "none";
      card.style.opacity = "1";
    });
    removed = 0;
    updateCounter();
    restart.style.display = "none";
    layoutStack();
  });
})();
