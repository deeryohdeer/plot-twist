const moreFilters = document.getElementById("moreFilters");
const filterMoreBtn = document.getElementById("filterMoreBtn");

filterMoreBtn.addEventListener("click", () => {
  moreFilters.classList.remove("hidden");
  moreFilters.classList.add("flex");
  filterMoreBtn.remove();
});
