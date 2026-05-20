const profileToken = localStorage.getItem('token');

if (!profileToken) {
    window.location.href = 'login.html';
}

let userData = null;
let sessionsData = [];

async function loadProfile() {

    try {

        const response = await fetch(
            'http://localhost:3000/api/profile',
            {
                headers: {
                    Authorization: `Bearer ${profileToken}`
                }
            }
        );

        const data = await response.json();

        userData = data.profile.user;
        sessionsData = data.profile.sessions || [];

        if (!userData) return;

        renderBasicInfo();
        renderStats();
        renderHistory(sessionsData);
        renderInsights();

    } catch (error) {
        console.error(error);
    }
}

/* ---------------- BASIC INFO ---------------- */

function renderBasicInfo() {

    document.getElementById('profileUsername').textContent =
        userData.username;

    document.getElementById('profileEmail').textContent =
        userData.email;
}

/* ---------------- STATS ENGINE ---------------- */

function renderStats() {

    const sessions = sessionsData.length;

    const xp = calculateXP(sessionsData);

    const level = calculateLevel(xp);

    const ipls = userData.ipl || 0;

    document.getElementById('profileIPL').textContent = ipls;

    document.getElementById('profileSessions').textContent = sessions;

    document.getElementById('profileXP').textContent = `${xp} XP`;

    // ADD LEVEL VISUAL (dynamic injection)
    let levelBox = document.getElementById('profileLevel');

    if (!levelBox) {

        const statSection = document.querySelector('.profile-stats');

        const div = document.createElement('div');
        div.className = 'profile-card';

        div.innerHTML = `
            <h3>Level</h3>
            <p id="profileLevel">${level}</p>
        `;

        statSection.appendChild(div);
    } else {
        levelBox.textContent = level;
    }
}

/* ---------------- XP SYSTEM ---------------- */

function calculateXP(sessions) {

    let xp = 0;

    sessions.forEach(s => {

        const time = Number(s.studyTime || 0);
        const diff = Number(s.difficultyScore || 0);

        xp += (time * 10) + (diff * 25);
    });

    return Math.round(xp);
}

function calculateLevel(xp) {
    return Math.floor(xp / 500) + 1;
}

/* ---------------- HISTORY ---------------- */

function renderHistory(sessions) {

    const container = document.getElementById('historyContainer');

    container.innerHTML = '';

    sessions.slice().reverse().forEach(session => {

        const item = document.createElement('div');

        item.className = 'history-item';

        const performance = getPerformanceLabel(session);

        item.innerHTML = `
            <h3>${session.topic}</h3>

            <p>Language: ${session.language}</p>
            <p>Study Time: ${session.studyTime} min</p>
            <p>Difficulty: ${session.difficultyScore}</p>
            <p>Status: ${performance}</p>
        `;

        container.appendChild(item);
    });
}

/* ---------------- ANALYTICS INSIGHTS ---------------- */

function renderInsights() {

    const avgDifficulty =
        sessionsData.reduce((a, b) => a + Number(b.difficultyScore || 0), 0)
        / (sessionsData.length || 1);

    const avgTime =
        sessionsData.reduce((a, b) => a + Number(b.studyTime || 0), 0)
        / (sessionsData.length || 1);

    console.log("📊 PROFILE INSIGHTS");
    console.log("Avg Difficulty:", avgDifficulty.toFixed(2));
    console.log("Avg Study Time:", avgTime.toFixed(2));

    if (avgDifficulty < 3) {
        console.log("⚠️ Recommendation: Try harder challenges");
    }

    if (avgTime < 20) {
        console.log("⚠️ Recommendation: Increase study duration");
    }
}

/* ---------------- PERFORMANCE LABEL ---------------- */

function getPerformanceLabel(session) {

    const score =
        (Number(session.studyTime) * 0.5) +
        (Number(session.difficultyScore) * 10);

    if (score > 80) return "🔥 Excellent";
    if (score > 50) return "⚡ Good";
    return "📉 Needs Improvement";
}

loadProfile();

/* ================================
   🚀 PRO PROFILE ENHANCEMENT ENGINE
================================ */

function calculateStreak(sessions) {

    if (!sessions.length) return 0;

    const dates = sessions
        .map(s => new Date(s.createdAt).toDateString())
        .filter((v, i, a) => a.indexOf(v) === i)
        .sort((a, b) => new Date(b) - new Date(a));

    let streak = 1;

    for (let i = 0; i < dates.length - 1; i++) {

        const diff =
            (new Date(dates[i]) - new Date(dates[i + 1])) /
            (1000 * 60 * 60 * 24);

        if (diff === 1) streak++;
        else break;
    }

    return streak;
}

function getTier(avgDifficulty, xp) {

    if (xp > 5000 && avgDifficulty > 7) return "🔥 Elite";
    if (xp > 3000) return "⚡ Advanced";
    if (xp > 1500) return "💪 Intermediate";
    return "🌱 Beginner";
}

/* ================================
   🔥 LIVE PROFILE ENHANCEMENT
================================ */

(function enhanceProfileUI() {

    if (!sessionsData.length) return;

    const avgDifficulty =
        sessionsData.reduce((a, b) => a + Number(b.difficultyScore || 0), 0)
        / sessionsData.length;

    const avgTime =
        sessionsData.reduce((a, b) => a + Number(b.studyTime || 0), 0)
        / sessionsData.length;

    const xp = calculateXP(sessionsData);
    const streak = calculateStreak(sessionsData);
    const tier = getTier(avgDifficulty, xp);

    const streakEl = document.getElementById("profileStreak");
    const diffEl = document.getElementById("profileAvgDifficulty");
    const timeEl = document.getElementById("profileAvgTime");
    const tierEl = document.getElementById("profileTier");

    if (streakEl) streakEl.textContent = `${streak} days`;
    if (diffEl) diffEl.textContent = avgDifficulty.toFixed(2);
    if (timeEl) timeEl.textContent = `${avgTime.toFixed(1)} min`;
    if (tierEl) tierEl.textContent = tier;

})();