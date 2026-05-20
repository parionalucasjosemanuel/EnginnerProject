const ChartsManager = (() => {

    function createLineChart(
        canvasId,
        labels,
        datasetLabel,
        dataset
    ) {

        const context =
            document
                .getElementById(canvasId)
                .getContext('2d');

        return new Chart(context, {

            type: 'line',

            data: {

                labels,

                datasets: [
                    {
                        label: datasetLabel,

                        data: dataset,

                        borderWidth: 3,

                        tension: 0.4,

                        fill: true
                    }
                ]
            },

            options: {

                responsive: true,

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
                            color: '#ffffff'
                        }
                    },

                    y: {

                        ticks: {
                            color: '#ffffff'
                        }
                    }
                }
            }
        });
    }

    function createBarChart(
        canvasId,
        labels,
        datasetLabel,
        dataset
    ) {

        const context =
            document
                .getElementById(canvasId)
                .getContext('2d');

        return new Chart(context, {

            type: 'bar',

            data: {

                labels,

                datasets: [
                    {
                        label: datasetLabel,

                        data: dataset,

                        borderWidth: 2
                    }
                ]
            }
        });
    }

    return {
        createLineChart,
        createBarChart
    };
})();

/* =========================================
   🚀 CHARTS PRO UPGRADE SYSTEM
========================================= */

ChartsManager.instances = ChartsManager.instances || {};

/* =========================
   SAFE GET CONTEXT
========================= */

function safeGetContext(canvasId) {

    const canvas = document.getElementById(canvasId);

    if (!canvas) {
        console.warn(`Canvas not found: ${canvasId}`);
        return null;
    }

    return canvas.getContext('2d');
}

/* =========================
   AUTO DESTROY OLD CHART
========================= */

function destroyIfExists(canvasId) {

    if (ChartsManager.instances[canvasId]) {
        ChartsManager.instances[canvasId].destroy();
    }
}

/* =========================
   UPGRADED LINE CHART
========================= */

ChartsManager.createLineChartPro = function (
    canvasId,
    labels,
    datasetLabel,
    dataset
) {

    const ctx = safeGetContext(canvasId);
    if (!ctx) return null;

    destroyIfExists(canvasId);

    const chart = new Chart(ctx, {

        type: 'line',

        data: {
            labels,
            datasets: [{
                label: datasetLabel,
                data: dataset,
                borderWidth: 3,
                tension: 0.45,
                fill: true,
                pointRadius: 3,
                pointHoverRadius: 6
            }]
        },

        options: {

            responsive: true,
            maintainAspectRatio: false,

            animation: {
                duration: 800,
                easing: 'easeOutQuart'
            },

            plugins: {
                legend: {
                    labels: {
                        color: '#ffffff',
                        font: {
                            size: 12
                        }
                    }
                },
                tooltip: {
                    enabled: true,
                    mode: 'index',
                    intersect: false
                }
            },

            scales: {

                x: {
                    ticks: {
                        color: '#94a3b8'
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

    ChartsManager.instances[canvasId] = chart;

    return chart;
};

/* =========================
   UPGRADED BAR CHART
========================= */

ChartsManager.createBarChartPro = function (
    canvasId,
    labels,
    datasetLabel,
    dataset
) {

    const ctx = safeGetContext(canvasId);
    if (!ctx) return null;

    destroyIfExists(canvasId);

    const chart = new Chart(ctx, {

        type: 'bar',

        data: {
            labels,
            datasets: [{
                label: datasetLabel,
                data: dataset,
                borderWidth: 2
            }]
        },

        options: {

            responsive: true,
            maintainAspectRatio: false,

            animation: {
                duration: 700,
                easing: 'easeOutBounce'
            },

            plugins: {
                legend: {
                    labels: {
                        color: '#ffffff'
                    }
                },
                tooltip: {
                    enabled: true
                }
            },

            scales: {

                x: {
                    ticks: {
                        color: '#94a3b8'
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

    ChartsManager.instances[canvasId] = chart;

    return chart;
};

/* =========================
   GLOBAL RESET FUNCTION
========================= */

ChartsManager.resetAllCharts = function () {

    Object.values(ChartsManager.instances).forEach(chart => {
        if (chart) chart.destroy();
    });

    ChartsManager.instances = {};
};