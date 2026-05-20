const dashboardToken =
    localStorage.getItem('token');

if (!dashboardToken) {

    window.location.href =
        'login.html';
}

async function loadProfileData() {

    try {

        const response =
            await fetch(
                'http://localhost:3000/api/profile',
                {
                    headers: {
                        Authorization:
                            `Bearer ${dashboardToken}`
                    }
                }
            );

        const data =
            await response.json();

        if (!data.success) {

            return;
        }

        const user =
            data.profile.user;

        const sessions =
            data.profile.sessions;

        document.getElementById(
            'iplScore'
        ).textContent = user.ipl;

        document.getElementById(
            'sessionCount'
        ).textContent = sessions.length;

        document.getElementById(
            'problemsSolved'
        ).textContent =
            sessions.length * 2;

        document.getElementById(
            'weeklyConsistency'
        ).textContent =
            `${Math.min(100, sessions.length * 10)}%`;

        renderProgressChart(sessions);

    } catch (error) {

        console.error(error);
    }
}

function renderProgressChart(sessions) {

    const ctx =
        document.getElementById('progressChart').getContext('2d');

    new Chart(ctx, {

        type: 'line',

        data: {

            labels: sessions.map((_, i) => `S${i + 1}`),

            datasets: [{
                label: 'Difficulty Progression',

                data: sessions.map(s => Number(s.difficultyScore || 0)),

                borderWidth: 3,
                tension: 0.4,

                borderColor: '#6366f1',
                backgroundColor: 'rgba(99,102,241,0.15)',

                fill: true,

                pointRadius: 4,
                pointHoverRadius: 6,
                pointBackgroundColor: '#ffffff'
            }]
        },

        options: {

            responsive: true,

            maintainAspectRatio: false, // 🔥 CLAVE

            plugins: {
                legend: {
                    labels: {
                        color: '#ffffff'
                    }
                }
            },

            scales: {

                x: {
                    ticks: {
                        color: '#94a3b8',
                        maxRotation: 0,
                        autoSkip: true,      // 🔥 evita saturación
                        maxTicksLimit: 10    // 🔥 limita visualmente
                    },
                    grid: {
                        display: false
                    }
                },

                y: {
                    ticks: {
                        color: '#94a3b8'
                    },
                    grid: {
                        color: 'rgba(255,255,255,0.05)'
                    }
                }
            }
        }
    });
}

loadProfileData();

/* ======================================
   DASHBOARD PRO ADD-ON (SAFE PATCH)
====================================== */

let globalSessions = [];

/* =========================
   CAPTURE DATA FROM ORIGINAL
========================= */
const originalLoad = loadProfileData;

loadProfileData = async function () {

    await originalLoad();

    try {

        const res = await fetch('http://localhost:3000/api/profile', {
            headers: {
                Authorization: `Bearer ${dashboardToken}`
            }
        });

        const data = await res.json();

        globalSessions = data.profile.sessions || [];

        renderDashboardInsights(globalSessions);
        updateProgressBar(globalSessions);

    } catch (e) {
        console.error("Dashboard patch error:", e);
    }
};

/* =========================
   SMART INSIGHTS (REAL LOGIC)
========================= */
function renderDashboardInsights(sessions) {

    const list = document.getElementById("dashboardInsights");
    if (!list) return;

    list.innerHTML = "";

    const total = sessions.length;

    const avgDifficulty =
        sessions.reduce((a, s) => a + Number(s.difficultyScore || 0), 0) / total;

    const totalTime =
        sessions.reduce((a, s) => a + Number(s.studyTime || 0), 0);

    const insights = [];

    if (total < 5) insights.push("⚠️ Low activity detected. Try practicing more.");
    else insights.push("✅ Good consistency level.");

    if (avgDifficulty < 3) insights.push("📈 You are solving easy problems only.");
    else insights.push("🔥 Good challenge progression.");

    if (totalTime > 50) insights.push("⏱ Strong study dedication detected.");

    sessions.forEach((s, i) => {
        if (s.difficultyScore >= 8) {
            insights.push(`💪 High difficulty session detected at S${i + 1}`);
        }
    });

    insights.forEach(i => {
        const li = document.createElement("li");
        li.textContent = i;
        list.appendChild(li);
    });
}

/* =========================
   PROGRESS BAR (REAL METRIC)
========================= */
function updateProgressBar(sessions) {

    const fill = document.getElementById("progressFill");
    const text = document.getElementById("progressText");

    if (!fill || !text) return;

    const score =
        sessions.reduce((a, s) =>
            a + (Number(s.studyTime || 0) * 0.4) +
                (Number(s.difficultyScore || 0) * 0.6)
        , 0);

    const progress = Math.min(100, Math.round(score));

    fill.style.width = progress + "%";
    text.textContent = `Overall Progress: ${progress}%`;
}

/* =========================
   REFRESH BUTTON (REAL)
========================= */
document.addEventListener("DOMContentLoaded", () => {

    const btn = document.getElementById("refreshDashboard");

    if (btn) {
        btn.addEventListener("click", () => {

            btn.textContent = "⏳ Loading...";

            loadProfileData().then(() => {
                btn.textContent = "🔄 Refresh";
            });
        });
    }
});

/* =========================
   EXPORT (REAL JSON DOWNLOAD)
========================= */
document.addEventListener("DOMContentLoaded", () => {

    const exportBtn = document.getElementById("exportStats");

    if (exportBtn) {

        exportBtn.addEventListener("click", () => {

            const data = {
                sessions: globalSessions,
                exportedAt: new Date().toISOString()
            };

            const blob = new Blob([JSON.stringify(data, null, 2)], {
                type: "application/json"
            });

            const url = URL.createObjectURL(blob);

            const a = document.createElement("a");

            a.href = url;
            a.download = "dashboard-stats.json";

            a.click();

            URL.revokeObjectURL(url);
        });
    }
});

/* =========================
   RESET VIEW (UI ONLY)
========================= */
document.addEventListener("DOMContentLoaded", () => {

    const resetBtn = document.getElementById("resetStats");

    if (resetBtn) {

        resetBtn.addEventListener("click", () => {

            document.querySelectorAll(".metric-value").forEach(el => {
                el.textContent = "0";
            });

            const ctx = document.getElementById("progressChart");

            if (ctx) {
                ctx.innerHTML = "";
            }
        });
    }
});