const token = localStorage.getItem('token');

async function loadActivityLogs() {

    try {

        const response = await fetch(
            'http://localhost:3000/api/activity-logs',
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        const container =
            document.getElementById('activityList');

        container.innerHTML = "";

        data.logs.forEach(log => {

            const item = document.createElement('div');

            item.className = "activity-item";

            item.innerHTML = `
                <div class="activity-type">${log.action}</div>
                <div class="activity-details">${log.details}</div>
                <div class="activity-time">
                    ${new Date(log.createdAt).toLocaleString()}
                </div>
            `;

            container.appendChild(item);
        });

    } catch (error) {

        console.error(error);
    }
}

loadActivityLogs();