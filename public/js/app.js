const studentsCounter =
    document.getElementById('studentsCounter');

const problemsCounter =
    document.getElementById('problemsCounter');

const analysisCounter =
    document.getElementById('analysisCounter');

const iplCounter =
    document.getElementById('iplCounter');

function animateCounter(element, target) {

    let current = 0;

    const increment =
        Math.ceil(target / 120);

    const timer = setInterval(() => {

        current += increment;

        if (current >= target) {

            current = target;

            clearInterval(timer);
        }

        element.textContent =
            current.toLocaleString();

    }, 15);
}

window.addEventListener('DOMContentLoaded', () => {

    if (studentsCounter) {

        animateCounter(
            studentsCounter,
            12450
        );
    }

    if (problemsCounter) {

        animateCounter(
            problemsCounter,
            528940
        );
    }

    if (analysisCounter) {

        animateCounter(
            analysisCounter,
            980120
        );
    }

    if (iplCounter) {

        animateCounter(
            iplCounter,
            87
        );
    }
});

// aquí arriba ya puedes tener otras funciones tuyas

// =====================
// CAROUSEL CODE
// =====================
const track = document.getElementById("carouselTrack");
const slides = document.querySelectorAll(".slide");

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

let index = 0;

// ====== BOTONES ======
function update() {
    track.style.transform = `translateX(-${index * 100}%)`;
}

nextBtn.addEventListener("click", () => {
    index++;
    if (index >= slides.length) index = 0;
    update();
});

prevBtn.addEventListener("click", () => {
    index--;
    if (index < 0) index = slides.length - 1;
    update();
});

// ====== DRAG (CLICK IZQUIERDO + TOUCH) ======
let startX = 0;
let isDown = false;

track.addEventListener("mousedown", (e) => {
    isDown = true;
    startX = e.clientX;
    track.style.cursor = "grabbing";
});

track.addEventListener("mouseup", (e) => {
    if (!isDown) return;

    let endX = e.clientX;

    if (startX > endX + 50) {
        index++;
    } else if (startX < endX - 50) {
        index--;
    }

    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;

    update();

    isDown = false;
    track.style.cursor = "grab";
});

track.addEventListener("mouseleave", () => {
    isDown = false;
});

// ====== TOUCH (CELULAR) ======
track.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
});

track.addEventListener("touchend", (e) => {
    let endX = e.changedTouches[0].clientX;

    if (startX > endX + 50) {
        index++;
    } else if (startX < endX - 50) {
        index--;
    }

    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;

    update();
});

/* =========================
   🚀 PRO LIVE DASHBOARD MODE
========================= */

async function refreshCountersFromAPI() {

    try {

        const res = await fetch("http://localhost:3000/api/stats");
        const data = await res.json();

        if (!data) return;

        if (studentsCounter && data.students)
            animateCounter(studentsCounter, data.students);

        if (problemsCounter && data.problems)
            animateCounter(problemsCounter, data.problems);

        if (analysisCounter && data.analysis)
            animateCounter(analysisCounter, data.analysis);

        if (iplCounter && data.ipl)
            animateCounter(iplCounter, data.ipl);

    } catch (err) {
        console.log("Stats API not available, using defaults.");
    }
}

/* Auto refresh silencioso cada 60s (opcional PRO feature) */
setInterval(refreshCountersFromAPI, 60000);

/* =========================
   🧠 IMPROVED COUNTER SAFETY
========================= */

function safeAnimateCounter(element, target) {

    if (!element || isNaN(target)) return;

    let current = 0;

    const increment = Math.max(1, Math.ceil(target / 100));

    const timer = setInterval(() => {

        current += increment;

        if (current >= target) {
            current = target;
            clearInterval(timer);
        }

        element.textContent = current.toLocaleString();

    }, 10);
}

/* =========================
   🎯 CAROUSEL UPGRADE (STABLE MODE)
========================= */

function safeUpdateCarousel() {

    if (!track || slides.length === 0) return;

    track.style.transform = `translateX(-${index * 100}%)`;
}

function nextSlide() {
    index = (index + 1) % slides.length;
    safeUpdateCarousel();
}

function prevSlide() {
    index = (index - 1 + slides.length) % slides.length;
    safeUpdateCarousel();
}

/* Rebind safe buttons */
if (nextBtn) {
    nextBtn.onclick = nextSlide;
}

if (prevBtn) {
    prevBtn.onclick = prevSlide;
}

/* =========================
   📱 IMPROVED SWIPE (SMOOTHER)
========================= */

let touchStartX = 0;

track?.addEventListener("touchstart", (e) => {
    touchStartX = e.touches[0].clientX;
});

track?.addEventListener("touchend", (e) => {

    const diff = e.changedTouches[0].clientX - touchStartX;

    if (Math.abs(diff) < 40) return;

    if (diff < 0) nextSlide();
    else prevSlide();
});