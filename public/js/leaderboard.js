const tableBody =
    document.getElementById('leaderboardBody');

async function loadLeaderboard() {

    try {

        tableBody.innerHTML = `
            <tr>
                <td colspan="4">Loading leaderboard...</td>
            </tr>
        `;

        const response =
            await fetch(
                'http://localhost:3000/api/leaderboard'
            );

        const data =
            await response.json();

        if (!data.leaderboard || !data.leaderboard.length) {

            tableBody.innerHTML = `
                <tr>
                    <td colspan="4">No data available</td>
                </tr>
            `;

            return;
        }

        renderLeaderboard(data.leaderboard);

    } catch (error) {

        console.error(error);

        tableBody.innerHTML = `
            <tr>
                <td colspan="4">Error loading leaderboard</td>
            </tr>
        `;
    }
}

function getRankBadge(index) {

    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';

    return `#${index + 1}`;
}

function renderLeaderboard(users) {

    const currentUser =
        JSON.parse(localStorage.getItem('user'));

    tableBody.innerHTML = '';

    users.forEach((user, index) => {

        const isCurrentUser =
            currentUser &&
            currentUser.id === user.id;

        const row =
            document.createElement('tr');

        row.className =
            isCurrentUser
                ? 'highlight-user'
                : '';

        row.innerHTML = `
            <td>
                ${getRankBadge(index)}
            </td>

            <td>
                ${user.username}
            </td>

            <td>
                <div class="ipl-bar">
                    <div
                        class="ipl-fill"
                        style="width:${user.ipl}%"
                    ></div>
                    <span>${user.ipl}</span>
                </div>
            </td>

            <td>
                Level ${user.level}
            </td>
        `;

        tableBody.appendChild(row);
    });
}

loadLeaderboard();

// auto refresh (real-time feeling)
setInterval(loadLeaderboard, 30000);
let leaderboardCache = [];

const refreshBtn = document.getElementById('refreshBtn');
const filterMode = document.getElementById('filterMode');
const lastUpdated = document.getElementById('lastUpdated');

refreshBtn?.addEventListener('click', () => {
    loadLeaderboard(true);
});

filterMode?.addEventListener('change', () => {
    renderLeaderboard(leaderboardCache);
});

async function loadLeaderboard(force = false) {

    try {

        tableBody.innerHTML = `
            <tr><td colspan="4">Loading leaderboard...</td></tr>
        `;

        const response = await fetch(
            'http://localhost:3000/api/leaderboard'
        );

        const data = await response.json();

        leaderboardCache = data.leaderboard || [];

        if (!leaderboardCache.length) {

            tableBody.innerHTML = `
                <tr><td colspan="4">No data available</td></tr>
            `;
            return;
        }

        renderLeaderboard(leaderboardCache);

        lastUpdated.textContent =
            "Last update: " + new Date().toLocaleTimeString();

    } catch (error) {

        console.error(error);

        tableBody.innerHTML = `
            <tr><td colspan="4">Error loading leaderboard</td></tr>
        `;
    }
}

function renderLeaderboard(users) {

    const currentUser =
        JSON.parse(localStorage.getItem('user'));

    const mode = filterMode?.value || 'all';

    let filtered = [...users];

    // 🔥 FILTER SYSTEM REAL
    if (mode === 'top10') {
        filtered = filtered.slice(0, 10);
    }

    if (mode === 'me' && currentUser) {
        filtered = filtered.filter(u => u.id === currentUser.id);
    }

    // 🔥 SORT REAL TIME (por IPL)
    filtered.sort((a, b) => b.ipl - a.ipl);

    tableBody.innerHTML = '';

    filtered.forEach((user, index) => {

        const isCurrentUser =
            currentUser && currentUser.id === user.id;

        const row = document.createElement('tr');

        // 🔥 highlight mejorado
        if (isCurrentUser) {
            row.style.background = "rgba(99,102,241,0.15)";
            row.style.fontWeight = "bold";
        }

        const rank =
            getRankBadge(index);

        const level =
            Math.floor(user.ipl / 20) + 1;

        row.innerHTML = `
            <td>${rank}</td>

            <td>
                ${isCurrentUser ? "⭐ " : ""}
                ${user.username}
            </td>

            <td>
                <div class="ipl-bar">
                    <div class="ipl-fill" style="width:${user.ipl}%"></div>
                    <span>${user.ipl}</span>
                </div>
            </td>

            <td>
                Level ${level}
            </td>
        `;

        tableBody.appendChild(row);
    });
}

// 🔥 AUTO REFRESH INTELIGENTE (no siempre, solo si cambia)
let lastDataHash = "";

setInterval(async () => {

    try {

        const res = await fetch('http://localhost:3000/api/leaderboard');
        const data = await res.json();

        const newHash = JSON.stringify(data.leaderboard);

        if (newHash !== lastDataHash) {

            lastDataHash = newHash;
            leaderboardCache = data.leaderboard;

            renderLeaderboard(leaderboardCache);

            lastUpdated.textContent =
                "Last update: " + new Date().toLocaleTimeString();
        }

    } catch (e) {
        console.log("Auto refresh skipped");
    }

}, 20000);

loadLeaderboard();