(function () {
  const shareBtn = document.getElementById("activity-modal-share-btn");
  const popover = document.getElementById("activity-modal-share-popover");
  const input = document.getElementById("activity-modal-share-input");
  const copyBtn = document.getElementById("activity-modal-share-copy");
  if (!shareBtn || !popover || !input || !copyBtn) return;

  function resetCopyLabel() {
    copyBtn.textContent = "Copy";
  }

  function positionPopover() {
    const margin = 8;
    popover.classList.remove("activity-modal-share-popover--left");
    popover.style.left = "";

    let rect = popover.getBoundingClientRect();
    if (rect.left < margin) {
      popover.classList.add("activity-modal-share-popover--left");
      rect = popover.getBoundingClientRect();
    }

    const viewportWidth = document.documentElement.clientWidth;
    if (rect.right > viewportWidth - margin) {
      const overflow = rect.right - (viewportWidth - margin);
      popover.style.left = `-${overflow}px`;
    }
  }

  function openPopover() {
    input.value = shareBtn.dataset.shareUrl || "";
    popover.hidden = false;
    positionPopover();
    input.focus();
    input.select();
  }

  function closePopover() {
    popover.hidden = true;
    resetCopyLabel();
  }

  shareBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (popover.hidden) openPopover();
    else closePopover();
  });

  copyBtn.addEventListener("click", async (e) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(input.value);
    } catch (err) {
      input.select();
      document.execCommand("copy");
    }
    copyBtn.textContent = "Copied!";
    setTimeout(resetCopyLabel, 1500);
  });

  input.addEventListener("click", (e) => {
    e.stopPropagation();
    input.select();
  });

  document.addEventListener("click", (e) => {
    if (
      !popover.hidden &&
      !popover.contains(e.target) &&
      e.target !== shareBtn
    ) {
      closePopover();
    }
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !popover.hidden) closePopover();
  });

  window.activityModalSharePopover = { open: openPopover, close: closePopover };
})();
