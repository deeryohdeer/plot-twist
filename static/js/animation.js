gsap.from(".site-title", {
  opacity: 0,
  y: 30,
  duration: 1,
});

const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

if (canHover) {
  document.querySelectorAll(".hover-panel").forEach((panel) => {
    const label = panel.querySelector(".panel-label");
    const highlight = panel.querySelector(".label-highlight");
    const sparkleIcon = panel.querySelector(".sparkle-icon");
    const tl = gsap.timeline({ paused: true });

    tl.to(
      panel,
      {
        backgroundColor: panel.dataset.hoverBg,
        duration: 0.6,
        ease: "power2.out",
      },
      0
    )
      .to(
        label,
        {
          opacity: 1,
          scale: 1.05,
          duration: 0.6,
          ease: "power2.out",
        },
        0
      )
      .to(
        highlight,
        {
          scaleX: 1,
          duration: 0.6,
          ease: "power2.out",
        },
        0
      );

    if (sparkleIcon) {
      tl.to(
        sparkleIcon,
        {
          stroke: "#6b342a",
          duration: 0.6,
          ease: "power2.out",
        },
        0
      );
    }

    panel.addEventListener("mouseenter", () => tl.play());
    panel.addEventListener("mouseleave", () => tl.reverse());
  });
}
