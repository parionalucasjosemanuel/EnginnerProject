const practiceForm =
    document.getElementById('practiceForm');

const practiceToken =
    localStorage.getItem('token');

if (!practiceToken) {

    window.location.href =
        'login.html';
}

practiceForm.addEventListener(
    'submit',
    async event => {

        event.preventDefault();

        const language =
            document.getElementById('language').value;

        const topic =
            document.getElementById('topic').value;

        const studyTime =
            document.getElementById('studyTime').value;

        const difficultyScore =
            document.getElementById('difficultyScore').value;

        const sourceCode =
            document.getElementById('sourceCode').value;

        try {

            await registerPracticeSession({
                language,
                topic,
                studyTime,
                difficultyScore
            });

            const analysis =
                await analyzeSourceCode({
                    code: sourceCode,
                    language
                });

            renderAnalysisResults(analysis);

        } catch (error) {

            console.error(error);

            alert('Analysis failed.');
        }
    }
);

async function registerPracticeSession(sessionData) {

    const response =
        await fetch(
            'http://localhost:3000/api/practice',
            {
                method: 'POST',

                headers: {
                    'Content-Type': 'application/json',
                    Authorization:
                        `Bearer ${practiceToken}`
                },

                body: JSON.stringify(sessionData)
            }
        );

    return response.json();
}

async function analyzeSourceCode(codeData) {

    const response =
        await fetch(
            'http://localhost:3000/api/analyze',
            {
                method: 'POST',

                headers: {
                    'Content-Type': 'application/json',
                    Authorization:
                        `Bearer ${practiceToken}`
                },

                body: JSON.stringify(codeData)
            }
        );

    const data =
        await response.json();

    return data.analysis;
}

function renderAnalysisResults(analysis) {

    document.getElementById(
        'complexityResult'
    ).textContent =
        analysis.estimatedComplexity;

    document.getElementById(
        'modularityResult'
    ).textContent =
        `${analysis.modularityScore}%`;

    document.getElementById(
        'loopsResult'
    ).textContent =
        analysis.loops;

    const recommendationsContainer =
        document.getElementById(
            'recommendationsResult'
        );

    recommendationsContainer.innerHTML = '';

    analysis.recommendations.forEach(
        recommendation => {

            const item =
                document.createElement('li');

            item.textContent =
                recommendation;

            recommendationsContainer
                .appendChild(item);
        }
    );
    updatePracticeStats(
    {
        studyTime: document.getElementById('studyTime').value,
        difficultyScore: document.getElementById('difficultyScore').value
    },
    analysis
);
}

function calculateXP(studyTime, difficulty) {
    return Math.round(studyTime * 2 + difficulty * 10);
}

function calculateEfficiency(time, difficulty) {
    const base = (difficulty * 10) / (time || 1);
    return Math.min(100, Math.round(base * 10));
}

function calculateQuality(analysis) {

    let score = 50;

    if (analysis.loops > 2) score -= 10;
    if (analysis.recursion) score += 10;
    if (analysis.modularityScore > 70) score += 20;
    if (analysis.estimatedComplexity === "O(n log n)") score += 15;

    return Math.min(100, Math.max(0, score));
}

function calculateIPLImpact(xp, difficulty) {
    return Math.round(xp * 0.3 + difficulty * 5);
}

function updatePracticeStats(session, analysis) {

    const xp = calculateXP(session.studyTime, session.difficultyScore);
    const efficiency = calculateEfficiency(session.studyTime, session.difficultyScore);
    const quality = calculateQuality(analysis);
    const ipl = calculateIPLImpact(xp, session.difficultyScore);

    document.getElementById('xpGain').textContent = xp;
    document.getElementById('efficiencyScore').textContent = efficiency + "%";
    document.getElementById('qualityScore').textContent = quality;
    document.getElementById('iplImpact').textContent = ipl;

    // animación simple visual pro
    document.querySelectorAll('.stat-mini strong').forEach(el => {
        el.style.color = "#22c55e";
        setTimeout(() => el.style.color = "", 800);
    });
}

/* ========================================= */
/* 🌐 ALGORYTHRA CISCO QUIZ SYSTEM */
/* ========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const quizModes =
        document.querySelectorAll(".quiz-mode");

    const xpGainElement =
        document.getElementById("xpGain");

    let currentXP =
        parseInt(xpGainElement.textContent) || 0;

    /* ========================================= */
    /* MODE SYSTEM */
    /* ========================================= */

    quizModes.forEach((mode) => {

        const questions =
            mode.querySelectorAll(".quiz-card");

        const finishButton =
            mode.querySelector(".quiz-finish-btn");

        let correctAnswers = 0;

        let answeredQuestions = 0;

        let rewardClaimed = false;

        /* ========================================= */
        /* INITIAL BUTTON STATE */
        /* ========================================= */

        finishButton.disabled = true;

        finishButton.style.opacity = "0.5";

        finishButton.style.cursor = "not-allowed";

        /* ========================================= */
        /* QUESTION SYSTEM */
        /* ========================================= */

        questions.forEach((question) => {

            const options =
                question.querySelectorAll(".option");

            const answerBox =
                question.querySelector(
                    ".correct-answer"
                );

            const explanationBox =
                question.querySelector(
                    ".quiz-explanation"
                );

            /* Hide answer initially */

            answerBox.style.display = "none";

            explanationBox.style.display = "none";

            options.forEach((option) => {

                option.addEventListener(
                    "click",
                    () => {

                        /* Prevent multiple clicks */

                        if (
                            question.classList.contains(
                                "answered"
                            )
                        ) {
                            return;
                        }

                        question.classList.add(
                            "answered"
                        );

                        answeredQuestions++;

                        /* Disable all options */

                        options.forEach((opt) => {

                            opt.style.pointerEvents =
                                "none";

                        });

                        /* SHOW EXPLANATION */

                        answerBox.style.display =
                            "block";

                        explanationBox.style.display =
                            "block";

                        /* CORRECT ANSWER */

                        if (
                            option.classList.contains(
                                "correct"
                            )
                        ) {

                            option.style.border =
                                "2px solid #22c55e";

                            option.style.background =
                                "rgba(34,197,94,0.25)";

                            option.style.color =
                                "#4ade80";

                            option.innerHTML +=
                                " ✅ Correct";

                            correctAnswers++;

                        }

                        /* INCORRECT ANSWER */

                        else {

                            option.style.border =
                                "2px solid #ef4444";

                            option.style.background =
                                "rgba(239,68,68,0.25)";

                            option.style.color =
                                "#f87171";

                            option.innerHTML +=
                                " ❌ Incorrect";

                        }

                        /* ========================================= */
                        /* ENABLE BUTTON ONLY IF ALL ARE CORRECT */
                        /* ========================================= */

                        if (
                            answeredQuestions ===
                                questions.length &&
                            correctAnswers ===
                                questions.length
                        ) {

                            finishButton.disabled =
                                false;

                            finishButton.style.opacity =
                                "1";

                            finishButton.style.cursor =
                                "pointer";

                            finishButton.textContent =
                                "🎉 Claim XP Reward";

                        }

                        /* ========================================= */
                        /* FAILED MODE */
                        /* ========================================= */

                        else if (
                            answeredQuestions ===
                                questions.length &&
                            correctAnswers !==
                                questions.length
                        ) {

                            finishButton.disabled =
                                true;

                            finishButton.style.opacity =
                                "0.5";

                            finishButton.textContent =
                                "❌ Failed Mode";

                        }

                    }
                );

            });

        });

        /* ========================================= */
        /* XP REWARD SYSTEM */
        /* ========================================= */

        finishButton.addEventListener(
            "click",
            () => {

                if (
                    rewardClaimed ||
                    finishButton.disabled
                ) {
                    return;
                }

                let xp = 0;

                /* EASY */

                if (
                    mode.classList.contains(
                        "easy-mode"
                    )
                ) {

                    xp = 50;

                }

                /* MEDIUM */

                else if (
                    mode.classList.contains(
                        "medium-mode"
                    )
                ) {

                    xp = 100;

                }

                /* HARD */

                else if (
                    mode.classList.contains(
                        "hard-mode"
                    )
                ) {

                    xp = 200;

                }

                currentXP += xp;

                xpGainElement.textContent =
                    currentXP;

                rewardClaimed = true;

                finishButton.disabled = true;

                finishButton.style.opacity =
                    "0.7";

                finishButton.style.cursor =
                    "default";

                finishButton.textContent =
                    `✅ Reward Claimed +${xp} XP`;

            }
        );

    });

});