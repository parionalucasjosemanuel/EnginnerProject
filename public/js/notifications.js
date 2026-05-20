const token = localStorage.getItem('token');

if (!token) {
    window.location.href = 'login.html';
}

async function loadNotifications() {
    try {
        const response = await fetch('http://localhost:3000/api/notifications', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const data = await response.json();

        const notifications = data.notifications;

        renderNotifications(notifications);

    } catch (error) {
        console.error(error);
    }
}

function renderNotifications(notifications) {

    const container = document.getElementById('notificationsList');
    const unreadCount = document.getElementById('unreadCount');

    container.innerHTML = '';

    let unread = 0;

    notifications.forEach(n => {

        if (!n.read) unread++;

        const item = document.createElement('div');

        item.className = `notification-item ${n.read ? 'read' : 'unread'}`;

        item.innerHTML = `
            <h3>${n.title}</h3>
            <p>${n.message}</p>
            <button onclick="markAsRead('${n.id}')">
                Mark as read
            </button>
        `;

        container.appendChild(item);
    });

    unreadCount.textContent = unread;
}

async function markAsRead(id) {

    try {
        await fetch(`http://localhost:3000/api/notifications/${id}/read`, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        loadNotifications();

    } catch (error) {
        console.error(error);
    }
}

loadNotifications();

let notificationsCache = [];

const refreshBtn = document.getElementById('refreshNotifications');
const markAllBtn = document.getElementById('markAllRead');
const filterSelect = document.getElementById('filterNotifications');
const lastUpdate = document.getElementById('lastNotifUpdate');

refreshBtn?.addEventListener('click', loadNotifications);
filterSelect?.addEventListener('change', () => renderNotifications(notificationsCache));

markAllBtn?.addEventListener('click', markAllAsRead);

async function loadNotifications() {

    try {

        const response = await fetch('http://localhost:3000/api/notifications', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const data = await response.json();

        notificationsCache = data.notifications || [];

        renderNotifications(notificationsCache);

        lastUpdate.textContent =
            "Last update: " + new Date().toLocaleTimeString();

    } catch (error) {
        console.error(error);
    }
}

function renderNotifications(notifications) {

    const container = document.getElementById('notificationsList');
    const unreadCount = document.getElementById('unreadCount');

    container.innerHTML = '';

    const filter = filterSelect?.value || 'all';

    let filtered = [...notifications];

    // 🔥 FILTER SYSTEM REAL
    if (filter === 'unread') {
        filtered = filtered.filter(n => !n.read);
    }

    if (filter === 'read') {
        filtered = filtered.filter(n => n.read);
    }

    let unread = 0;

    filtered.forEach(n => {

        if (!n.read) unread++;

        const item = document.createElement('div');

        item.className = `
            notification-item
            ${n.read ? 'read' : 'unread'}
            fade-in
        `;

        // 🔥 prioridad visual
        const priority =
            n.type === 'warning'
                ? '⚠️'
                : n.type === 'success'
                    ? '✅'
                    : '🔔';

        item.innerHTML = `
            <h3>${priority} ${n.title}</h3>

            <p>${n.message}</p>

            <small style="opacity:0.5;">
                ${new Date(n.createdAt || Date.now()).toLocaleString()}
            </small>

            <button onclick="markAsRead('${n.id}')">
                Mark as read
            </button>
        `;

        container.appendChild(item);
    });

    unreadCount.textContent = unread;
}

async function markAsRead(id) {

    try {

        await fetch(`http://localhost:3000/api/notifications/${id}/read`, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        // optimización: no recargar todo
        const notif = notificationsCache.find(n => n.id === id);
        if (notif) notif.read = true;

        renderNotifications(notificationsCache);

    } catch (error) {
        console.error(error);
    }
}

async function markAllAsRead() {

    try {

        await Promise.all(
            notificationsCache
                .filter(n => !n.read)
                .map(n =>
                    fetch(`http://localhost:3000/api/notifications/${n.id}/read`, {
                        method: 'PATCH',
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                )
        );

        notificationsCache.forEach(n => n.read = true);

        renderNotifications(notificationsCache);

    } catch (error) {
        console.error(error);
    }
}

// 🔥 AUTO REFRESH INTELIGENTE
let lastHash = "";

setInterval(async () => {

    try {

        const res = await fetch('http://localhost:3000/api/notifications', {
            headers: { Authorization: `Bearer ${token}` }
        });

        const data = await res.json();

        const newHash = JSON.stringify(data.notifications);

        if (newHash !== lastHash) {

            lastHash = newHash;
            notificationsCache = data.notifications;

            renderNotifications(notificationsCache);

            lastUpdate.textContent =
                "Last update: " + new Date().toLocaleTimeString();
        }

    } catch (e) {
        console.log("Auto refresh skipped");
    }

}, 15000);

loadNotifications();