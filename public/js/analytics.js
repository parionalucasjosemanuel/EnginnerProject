
const analyticsToken = localStorage.getItem('token');

if (!analyticsToken) {
    window.location.href = 'login.html';
}

let sessionsGlobal = [];

async function loadAnalytics() {

    try {

        const response = await fetch(
            'http://localhost:3000/api/profile',
            {
                headers: {
                    Authorization: `Bearer ${analyticsToken}`
                }
            }
        );

        const data = await response.json();

        sessionsGlobal = data.profile.sessions || [];

        if (!sessionsGlobal.length) {
            console.warn("No sessions found");
            return;
        }

        renderStudyChart(sessionsGlobal);
        renderLanguageChart(sessionsGlobal);
        renderDifficultyChart(sessionsGlobal);
        renderIPLChart(sessionsGlobal);
        renderInsights(sessionsGlobal);

    } catch (error) {
        console.error(error);
    }
}
async function loadSystemMetrics() {

    try {

        const response = await fetch(
            'http://localhost:3000/api/system-metrics',
            {
                headers: {
                    Authorization: `Bearer ${analyticsToken}`
                }
            }
        );

        const data = await response.json();

console.log("SYSTEM METRICS:", data.current);
console.log("HISTORY:", data.history);

    } catch (error) {

        console.error(error);
    }
}
function renderStudyChart(sessions) {

    const ctx = document.getElementById('studyChart').getContext('2d');

    const grouped = groupByDay(sessions);

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(grouped),
            datasets: [{
                label: 'Study Hours',
                data: Object.values(grouped),
                borderWidth: 2
            }]
        }
    });
}

function renderLanguageChart(sessions) {

    const count = { Python: 0, Java: 0, 'C++': 0 };

    sessions.forEach(s => {
        if (count[s.language] !== undefined) {
            count[s.language]++;
        }
    });

    const ctx = document.getElementById('languageChart').getContext('2d');

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(count),
            datasets: [{
                data: Object.values(count)
            }]
        }
    });
}

function renderDifficultyChart(sessions) {

    const ctx = document.getElementById('difficultyChart').getContext('2d');

    const values = sessions.map(s => Number(s.difficultyScore || 0));

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: sessions.map((_, i) => `Session ${i + 1}`),
            datasets: [{
                label: 'Difficulty Progression',
                data: values,
                borderWidth: 3,
                tension: 0.4
            }]
        }
    });
}

function renderIPLChart(sessions) {

    const ctx = document.getElementById('iplChart').getContext('2d');

    let cumulative = 0;

    const data = sessions.map((s, i) => {
        cumulative += (s.studyTime * 0.4) + (s.difficultyScore * 0.6);
        return Math.min(100, Math.round(cumulative));
    });

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: sessions.map((_, i) => `Step ${i + 1}`),
            datasets: [{
                label: 'IPL Growth',
                data,
                borderWidth: 3,
                tension: 0.4
            }]
        }
    });
}

function renderInsights(sessions) {

    const avgStudy =
        sessions.reduce((a, b) => a + Number(b.studyTime || 0), 0) / sessions.length;

    const avgDifficulty =
        sessions.reduce((a, b) => a + Number(b.difficultyScore || 0), 0) / sessions.length;

    const mostUsedLang = getMostUsedLanguage(sessions);

    console.log("📊 ANALYTICS INSIGHTS:");
    console.log("Avg Study:", avgStudy.toFixed(2));
    console.log("Avg Difficulty:", avgDifficulty.toFixed(2));
    console.log("Top Language:", mostUsedLang);

    if (avgStudy < 2) {
        console.log("⚠️ Recommendation: Increase study time consistency");
    }

    if (avgDifficulty < 3) {
        console.log("⚠️ Recommendation: Practice harder challenges");
    }

    if (mostUsedLang === 'Python') {
        console.log("💡 Suggestion: Try Java or C++ for balance");
    }
}

function groupByDay(sessions) {

    const map = {};

    sessions.forEach(s => {

        const date = new Date(s.createdAt).toLocaleDateString();

        map[date] = (map[date] || 0) + Number(s.studyTime || 0);
    });

    return map;
}

function getMostUsedLanguage(sessions) {

    const count = {};

    sessions.forEach(s => {
        count[s.language] = (count[s.language] || 0) + 1;
    });

    return Object.entries(count)
        .sort((a, b) => b[1] - a[1])[0]?.[0] || 'None';
}

loadAnalytics();
loadSystemMetrics();

/* =========================
   ANALYTICS PRO SYSTEM
   ADD-ON VERSION (NO BREAKS YOUR CODE)
========================= */

let filteredSessions = [];
let allSessions = [];

/* =========================
   INIT ENHANCEMENT
========================= */
document.addEventListener("DOMContentLoaded", () => {

    setupFilters();
    setupRefreshButton();
});

/* =========================
   FILTER SYSTEM (REAL FUNCTIONAL)
========================= */
function setupFilters() {

    document.querySelectorAll(".filter-btn[data-range]").forEach(btn => {

        btn.addEventListener("click", () => {

            document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const range = btn.dataset.range;
            applyFilter(range);
        });
    });
}

function applyFilter(range) {

    if (!allSessions.length) return;

    if (range === "all") {
        filteredSessions = allSessions;
    } else {

        const days = parseInt(range);

        const limit = Date.now() - (days * 24 * 60 * 60 * 1000);

        filteredSessions = allSessions.filter(s =>
            new Date(s.createdAt).getTime() >= limit
        );
    }

    updateAllVisuals();
}

/* =========================
   OVERRIDE LOAD (SAFE PATCH)
========================= */
const originalLoadAnalytics = loadAnalytics;

loadAnalytics = async function () {

    await originalLoadAnalytics();

    allSessions = sessionsGlobal || [];
    filteredSessions = allSessions;

    updateAllVisuals();
};

/* =========================
   UPDATE EVERYTHING LIVE
========================= */
function updateAllVisuals() {

    if (!filteredSessions.length) return;

    updateKPIs(filteredSessions);

    document.getElementById("studyChart").parentElement.innerHTML =
        '<canvas id="studyChart"></canvas>';
    document.getElementById("languageChart").parentElement.innerHTML =
        '<canvas id="languageChart"></canvas>';
    document.getElementById("difficultyChart").parentElement.innerHTML =
        '<canvas id="difficultyChart"></canvas>';
    document.getElementById("iplChart").parentElement.innerHTML =
        '<canvas id="iplChart"></canvas>';

    renderStudyChart(filteredSessions);
    renderLanguageChart(filteredSessions);
    renderDifficultyChart(filteredSessions);
    renderIPLChart(filteredSessions);

    renderSmartInsights(filteredSessions);
}

/* =========================
   KPI SYSTEM (REAL CALC)
========================= */
function updateKPIs(sessions) {

    const totalHours = sessions.reduce((a, s) => a + Number(s.studyTime || 0), 0);

    const avgDifficulty =
        sessions.reduce((a, s) => a + Number(s.difficultyScore || 0), 0) / sessions.length;

    const topLang = getMostUsedLanguage(sessions);

    document.getElementById("kpiHours").textContent = totalHours + "h";
    document.getElementById("kpiDifficulty").textContent = avgDifficulty.toFixed(1);
    document.getElementById("kpiLanguage").textContent = topLang;
    document.getElementById("kpiSessions").textContent = sessions.length;
}

/* =========================
   SMART INSIGHTS (REAL UI)
========================= */
function renderSmartInsights(sessions) {

    const list = document.getElementById("insightsList");
    list.innerHTML = "";

    const avgStudy = sessions.reduce((a, s) => a + Number(s.studyTime || 0), 0) / sessions.length;
    const avgDiff = sessions.reduce((a, s) => a + Number(s.difficultyScore || 0), 0) / sessions.length;
    const lang = getMostUsedLanguage(sessions);

    const insights = [];

    if (avgStudy < 2) insights.push("⚠️ Low study time consistency detected.");
    else insights.push("✅ Good study consistency.");

    if (avgDiff < 3) insights.push("📈 Try harder problems for faster growth.");
    else insights.push("🔥 Good difficulty progression.");

    if (lang === "Python") insights.push("💡 Try balancing with C++ or Java.");

    insights.forEach(i => {
        const li = document.createElement("li");
        li.textContent = i;
        list.appendChild(li);
    });
}

/* =========================
   REFRESH SYSTEM
========================= */
function setupRefreshButton() {

    const btn = document.getElementById("refreshBtn");

    if (!btn) return;

    btn.addEventListener("click", async () => {

        btn.textContent = "⏳ Updating...";

        await loadAnalytics();

        btn.textContent = "🔄 Refresh";
    });
}