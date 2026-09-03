(function () {
  const VIBE_COLORS = {
    outdoorsy: { bg: "#599803", fg: "#fff" },
    datenight: { bg: "#e280b1", fg: "#fff" },
    sporty: { bg: "#012981", fg: "#fff" },
    artsy: { bg: "#1ba8de", fg: "#fff" },
    groovy: { bg: "#ea4414", fg: "#fff" },
    musical: { bg: "#de8818", fg: "#fff" },
    relaxing: { bg: "#dedbe8", fg: "#000" },
    party: { bg: "#8c2163", fg: "#fff" },
    chill: { bg: "#4d615f", fg: "#fff" },
  };

  function normalizeVibe(name) {
    return (name || "").toLowerCase().replace(/[^a-z]/g, "");
  }

  function getVibeColor(name) {
    return VIBE_COLORS[normalizeVibe(name)] || null;
  }

  window.VIBE_COLORS = VIBE_COLORS;
  window.getVibeColor = getVibeColor;
})();
