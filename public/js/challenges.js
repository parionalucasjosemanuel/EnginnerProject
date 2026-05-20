const challengeGrid =
    document.getElementById('challengeGrid');

async function loadChallenges() {

    try {

        const response =
            await fetch(
                'http://localhost:3000/api/challenges'
            );

        const data =
            await response.json();

        renderChallenges(
            data.challenges
        );

    } catch (error) {

        console.error(
            'Challenge loading error:',
            error
        );
    }
}

function renderChallenges(challenges) {

    challengeGrid.innerHTML = '';

    challenges.forEach(challenge => {

        const card =
            document.createElement('div');

        card.className =
            'challenge-card fade-in';

        card.innerHTML = `
            <h3>
                ${challenge.title}
            </h3>

            <p>
                ${challenge.description}
            </p>

            <p>
                <strong>Difficulty:</strong>
                ${challenge.difficulty}
            </p>

            <p>
                <strong>Topic:</strong>
                ${challenge.topic}
            </p>

            <p>
                <strong>Complexity:</strong>
                ${challenge.expectedComplexity}
            </p>

            <div class="challenge-actions">

                <button
                    class="primary-btn solve-btn"
                >
                    Solve Challenge
                </button>

            </div>
        `;

        const solveButton =
            card.querySelector('.solve-btn');

        solveButton.addEventListener(
            'click',
            () => openChallengeModal(challenge)
        );

        challengeGrid.appendChild(card);
    });
}

function openChallengeModal(challenge) {

    const existingModal =
        document.querySelector('.challenge-modal-overlay');

    if (existingModal) {
        existingModal.remove();
    }

    const overlay =
        document.createElement('div');

    overlay.className =
        'challenge-modal-overlay';

    overlay.innerHTML = `
        <div class="challenge-modal">

            <div class="challenge-modal-header">

                <h2>
                    ${challenge.title}
                </h2>

                <button
                    class="close-modal-btn"
                >
                    ✕
                </button>

            </div>

            <div class="challenge-modal-body">

                <p>
                    ${challenge.description}
                </p>

                <div class="challenge-meta">

                    <span>
                        Difficulty:
                        ${challenge.difficulty}
                    </span>

                    <span>
                        Topic:
                        ${challenge.topic}
                    </span>

                    <span>
                        Complexity:
                        ${challenge.expectedComplexity}
                    </span>

                </div>

                <label>
                    Programming Language
                </label>

                <select id="languageSelect">

                    <option value="Python">
                        Python
                    </option>

                    <option value="Java">
                        Java
                    </option>

                    <option value="C++">
                        C++
                    </option>

                </select>

                <label>
                    Write Your Solution
                </label>

                <textarea
                    id="challengeCode"
                    placeholder="Write your solution here..."
                ></textarea>

                <button
                    class="primary-btn analyze-btn"
                >
                    Analyze Solution
                </button>

                <div
                    class="analysis-results"
                    id="analysisResults"
                ></div>

            </div>

        </div>
    `;

    document.body.appendChild(overlay);

    const closeButton =
        overlay.querySelector('.close-modal-btn');

    closeButton.addEventListener(
        'click',
        () => overlay.remove()
    );

    const analyzeButton =
        overlay.querySelector('.analyze-btn');

    analyzeButton.addEventListener(
        'click',
        () => analyzeChallengeSolution(challenge)
    );
}

async function analyzeChallengeSolution(challenge) {

    const token =
        localStorage.getItem('token');

    if (!token) {

        alert(
            'Please login first.'
        );

        return;
    }

    const code =
        document.getElementById('challengeCode').value;

    const language =
        document.getElementById('languageSelect').value;

    const resultsContainer =
        document.getElementById('analysisResults');

    if (!code.trim()) {

        resultsContainer.innerHTML = `
            <p class="error-text">
                Please write some code first.
            </p>
        `;

        return;
    }

    try {

        resultsContainer.innerHTML = `
            <p>
                Analyzing solution...
            </p>
        `;

        const response =
            await fetch(
                'http://localhost:3000/api/analyze',
                {
                    method: 'POST',

                    headers: {
                        'Content-Type':
                            'application/json',

                        Authorization:
                            'Bearer ' + token
                    },

                    body: JSON.stringify({
                        code,
                        language
                    })
                }
            );

        const data =
            await response.json();

        if (!data.success) {

            resultsContainer.innerHTML = `
                <p class="error-text">
                    Analysis failed.
                </p>
            `;

            return;
        }

        const analysis =
            data.analysis;

        resultsContainer.innerHTML = `
            <div class="analysis-card">

                <h3>
                    Analysis Results
                </h3>

                <p>
                    <strong>Language:</strong>
                    ${analysis.language}
                </p>

                <p>
                    <strong>Lines:</strong>
                    ${analysis.lines}
                </p>

                <p>
                    <strong>Loops:</strong>
                    ${analysis.loops}
                </p>

                <p>
                    <strong>Functions:</strong>
                    ${analysis.functions}
                </p>

                <p>
                    <strong>Complexity:</strong>
                    ${analysis.estimatedComplexity}
                </p>

                <p>
                    <strong>Modularity:</strong>
                    ${analysis.modularityScore}/100
                </p>

                <p>
                    <strong>Recursion:</strong>
                    ${analysis.recursion ? 'Yes' : 'No'}
                </p>

                <div class="recommendation-list">

                    <h4>
                        Recommendations
                    </h4>

                    ${
                        analysis.recommendations.length
                        ?
                        analysis.recommendations
                            .map(item => `
                                <li>${item}</li>
                            `)
                            .join('')
                        :
                        '<li>No recommendations.</li>'
                    }

                </div>

            </div>
        `;

        await registerPractice(language);

    } catch (error) {

        console.error(error);

        resultsContainer.innerHTML = `
            <p class="error-text">
                Server connection failed.
            </p>
        `;
    }
}

async function registerPractice(language) {

    const token =
        localStorage.getItem('token');

    if (!token) {
        return;
    }

    try {

        await fetch(
            'http://localhost:3000/api/practice',
            {
                method: 'POST',

                headers: {
                    'Content-Type':
                        'application/json',

                    Authorization:
                        'Bearer ' + token
                },

                body: JSON.stringify({
                    language,
                    topic: 'Challenges',
                    studyTime: 45,
                    difficultyScore: 8
                })
            }
        );

    } catch (error) {

        console.error(
            'Practice registration error:',
            error
        );
    }
}

loadChallenges();

/* =========================
   CHALLENGES PRO SYSTEM
   ADD-ON (NO BREAK CORE)
========================= */

let allChallenges = [];
let filteredChallenges = [];

/* =========================
   INIT SYSTEM
========================= */
document.addEventListener("DOMContentLoaded", () => {

    setupChallengeFilters();
    setupRefreshButton();
});

/* =========================
   LOAD PATCH SAFE
========================= */
const originalLoadChallenges = loadChallenges;

loadChallenges = async function () {

    await originalLoadChallenges();

    updateStats(allChallenges);
};

/* =========================
   STORE DATA ON RENDER
========================= */
const originalRender = renderChallenges;

renderChallenges = function (challenges) {

    allChallenges = challenges;
    filteredChallenges = challenges;

    originalRender(challenges);

    updateStats(challenges);
};

/* =========================
   FILTER SYSTEM REAL
========================= */
function setupChallengeFilters() {

    document.querySelectorAll(".filter-btn[data-filter]").forEach(btn => {

        btn.addEventListener("click", () => {

            document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const filter = btn.dataset.filter;

            applyFilter(filter);
        });
    });
}

function applyFilter(filter) {

    if (filter === "all") {
        filteredChallenges = allChallenges;
    } else {
        filteredChallenges = allChallenges.filter(c => c.difficulty === filter);
    }

    renderChallenges(filteredChallenges);
}

/* =========================
   STATS SYSTEM REAL
========================= */
function updateStats(challenges) {

    document.getElementById("totalChallenges").textContent = challenges.length;

    document.getElementById("hardChallenges").textContent =
        challenges.filter(c => c.difficulty === "Hard").length;

    // fake solved tracking (from localStorage if exists)
    const solved = JSON.parse(localStorage.getItem("solvedChallenges") || "[]");

    document.getElementById("solvedChallenges").textContent = solved.length;
}

/* =========================
   SOLVE TRACKING (REAL FEATURE)
========================= */
function markAsSolved(id) {

    let solved = JSON.parse(localStorage.getItem("solvedChallenges") || "[]");

    if (!solved.includes(id)) {
        solved.push(id);
    }

    localStorage.setItem("solvedChallenges", JSON.stringify(solved));

    updateStats(allChallenges);
}

/* =========================
   PATCH SOLVE BUTTON
========================= */
const originalOpenModal = openChallengeModal;

openChallengeModal = function (challenge) {

    originalOpenModal(challenge);

    setTimeout(() => {

        const analyzeBtn = document.querySelector(".analyze-btn");

        if (!analyzeBtn) return;

        analyzeBtn.addEventListener("click", () => {

            markAsSolved(challenge.title);
        });

    }, 300);
};

/* =========================
   REFRESH SYSTEM
========================= */
function setupRefreshButton() {

    const btn = document.getElementById("refreshChallenges");

    if (!btn) return;

    btn.addEventListener("click", async () => {

        btn.textContent = "⏳ Loading...";

        await loadChallenges();

        btn.textContent = "🔄 Refresh";
    });
}