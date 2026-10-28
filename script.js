const flipBook = (elBook) => {
    elBook.style.setProperty("--c", 0);
    elBook.querySelectorAll(".page").forEach((page, idx) => {
        page.style.setProperty("--i", idx);
        page.addEventListener("click", (evt) => {
            if (evt.target.closest("a, button, video, audio, input")) return;
            const curr = evt.target.closest(".back") ? idx : idx + 1;
            elBook.style.setProperty("--c", curr);
        });
    });
};

document.querySelectorAll(".book").forEach(flipBook);

// Browsers may block autoplay until the visitor interacts with the page.
// The sound button gives them a reliable way to start or stop the audio.
const backgroundSound = document.getElementById("backgroundSound");
const soundToggle = document.getElementById("soundToggle");

async function playBackgroundSound() {
    if (!backgroundSound || !soundToggle) return;
    try {
        await backgroundSound.play();
        soundToggle.textContent = "♫ Sound on";
        soundToggle.setAttribute("aria-pressed", "true");
    } catch (error) {
        soundToggle.textContent = "♫ Tap to play sound";
        soundToggle.setAttribute("aria-pressed", "false");
    }
}

if (backgroundSound && soundToggle) {
    backgroundSound.volume = 0.75;
    backgroundSound.addEventListener("play", () => {
        soundToggle.textContent = "♫ Sound on";
        soundToggle.setAttribute("aria-pressed", "true");
    });
    backgroundSound.addEventListener("pause", () => {
        soundToggle.textContent = "♫ Play sound";
        soundToggle.setAttribute("aria-pressed", "false");
    });
    soundToggle.addEventListener("click", async() => {
        if (backgroundSound.paused) {
            await playBackgroundSound();
        } else {
            backgroundSound.pause();
        }
    });
    playBackgroundSound();
}