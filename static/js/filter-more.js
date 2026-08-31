const moreFilters = document.getElementById("moreFilters");
const filterMoreBtn = document.getElementById("filterMoreBtn");

filterMoreBtn.addEventListener("click", () => {
  gsap.to(moreFilters, {
    height: "auto",
    opacity: 1,
    duration: 0.5,
    ease: "power2.out",
  });
  gsap.from(moreFilters.children, {
    y: 12,
    opacity: 0,
    duration: 0.4,
    stagger: 0.08,
    delay: 0.15,
    ease: "power2.out",
  });
  filterMoreBtn.remove();
});
