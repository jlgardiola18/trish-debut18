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

const mobilePage = document.getElementById("mobilePage");
const mobilePageImage = document.getElementById("mobilePageImage");
const pageCount = document.getElementById("pageCount");
const previousPage = document.getElementById("previousPage");
const nextPage = document.getElementById("nextPage");
const bookImages = Array.from(document.querySelectorAll(".book .front img, .book .back img"));

if (mobilePage && mobilePageImage && pageCount && previousPage && nextPage && bookImages.length) {
    let currentPage = 0;
    let pointerStartX = null;
    let swiped = false;

    const showPage = (pageIndex) => {
        const nextPageIndex = Math.max(0, Math.min(pageIndex, bookImages.length - 1));
        if (nextPageIndex === currentPage) return;
        const direction = nextPageIndex > currentPage ? "next" : "previous";
        currentPage = nextPageIndex;
        mobilePageImage.src = bookImages[currentPage].getAttribute("src");
        mobilePageImage.alt = bookImages[currentPage].alt;
        mobilePageImage.classList.remove("slide-next", "slide-previous");
        void mobilePageImage.offsetWidth;
        mobilePageImage.classList.add(direction === "next" ? "slide-next" : "slide-previous");
        pageCount.textContent = `${currentPage + 1} / ${bookImages.length}`;
        previousPage.disabled = currentPage === 0;
        nextPage.disabled = currentPage === bookImages.length - 1;
        mobilePage.setAttribute("aria-label", `Page ${currentPage + 1} of ${bookImages.length}. Advance to next page`);
    };

    previousPage.addEventListener("click", () => showPage(currentPage - 1));
    nextPage.addEventListener("click", () => showPage(currentPage + 1));
    mobilePage.addEventListener("click", () => {
        if (swiped) {
            swiped = false;
            return;
        }
        showPage(currentPage + 1);
    });
    mobilePage.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            showPage(currentPage + 1);
        }
    });
    mobilePage.addEventListener("pointerdown", (event) => {
        pointerStartX = event.clientX;
    });
    mobilePage.addEventListener("pointerup", (event) => {
        if (pointerStartX === null) return;
        const swipeDistance = event.clientX - pointerStartX;
        pointerStartX = null;
        if (Math.abs(swipeDistance) < 40) return;
        swiped = true;
        showPage(currentPage + (swipeDistance < 0 ? 1 : -1));
    });
    mobilePage.addEventListener("pointercancel", () => {
        pointerStartX = null;
    });
    showPage(0);
}

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