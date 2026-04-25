const reelPlayers = [...document.querySelectorAll("[data-reel-player]")];
const reelSlides = [...document.querySelectorAll(".reel-slide")];

const pauseOtherVideos = (activeVideo) => {
  reelPlayers.forEach((video) => {
    if (video !== activeVideo) {
      video.pause();
    }
  });
};

reelSlides.forEach((slide) => {
  const video = slide.querySelector("[data-reel-player]");
  const overlay = slide.querySelector("[data-intro-overlay]");
  const overlayCta = slide.querySelector("[data-intro-cta]");
  const overlayChipLabel = overlay?.querySelector(".overlay-chip-label");

  if (!video || !overlay || !overlayCta || !overlayChipLabel) {
    return;
  }

  const setOverlayLabel = (label) => {
    overlayChipLabel.textContent = label;
  };

  const hideOverlay = () => {
    overlay.classList.add("is-hidden");
  };

  const showOverlay = (label) => {
    setOverlayLabel(label);
    overlay.classList.remove("is-hidden");
  };

  overlayCta.addEventListener("click", async () => {
    setOverlayLabel("Loading...");
    pauseOtherVideos(video);

    try {
      await video.play();
    } catch {
      setOverlayLabel("Press to play");
    }
  });

  video.addEventListener("play", () => {
    pauseOtherVideos(video);
    hideOverlay();
  });

  video.addEventListener("ended", () => {
    video.currentTime = 0;
    showOverlay("Play again");
  });

  video.addEventListener("pause", () => {
    if (video.currentTime === 0) {
      showOverlay("Press to play");
    }
  });
});

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const video = entry.target.querySelector("[data-reel-player]");

        if (!video) {
          return;
        }

        if (!entry.isIntersecting || entry.intersectionRatio < 0.65) {
          video.pause();
        }
      });
    },
    {
      threshold: [0.35, 0.65, 0.9]
    }
  );

  reelSlides.forEach((slide) => observer.observe(slide));
}
