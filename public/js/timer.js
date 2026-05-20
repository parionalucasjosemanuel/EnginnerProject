const StudyTimer = (() => {

    let timerInterval = null;

    let seconds = 0;

    function start(displayElementId) {

        stop();

        timerInterval =
            setInterval(() => {

                seconds++;

                updateDisplay(
                    displayElementId
                );

            }, 1000);
    }

    function stop() {

        if (timerInterval) {

            clearInterval(
                timerInterval
            );
        }
    }

    function reset(displayElementId) {

        stop();

        seconds = 0;

        updateDisplay(
            displayElementId
        );
    }

    function updateDisplay(
        displayElementId
    ) {

        const hours =
            Math.floor(seconds / 3600);

        const minutes =
            Math.floor(
                (seconds % 3600) / 60
            );

        const remainingSeconds =
            seconds % 60;

        const formattedTime =
            `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;

        const display =
            document.getElementById(
                displayElementId
            );

        if (display) {

            display.textContent =
                formattedTime;
        }
    }

    function getSeconds() {

        return seconds;
    }

    return {
        start,
        stop,
        reset,
        getSeconds
    };
})();


// ===============================
// 🔥 PRO STUDY TIMER EXTENSION
// (SAFE ADD-ON, NO BREAK CHANGES)
// ===============================

// 🔹 estado extendido
StudyTimer.sessionHistory = [];

StudyTimer.pausedAt = null;

StudyTimer.totalPausedTime = 0;


// 🔥 pausa real (mejora importante)
StudyTimer.pause = function () {

    if (this.timerInterval) {

        clearInterval(this.timerInterval);
        this.timerInterval = null;

        this.pausedAt = Date.now();
    }
};


// 🔥 resume inteligente
StudyTimer.resume = function (displayElementId) {

    if (this.pausedAt) {

        this.totalPausedTime +=
            Math.floor((Date.now() - this.pausedAt) / 1000);

        this.pausedAt = null;
    }

    this.start(displayElementId);
};


// 🔥 sesión completa guardada (tracking real)
StudyTimer.endSession = function (displayElementId) {

    this.stop();

    const session = {
        durationSeconds: this.seconds,
        durationMinutes: Math.round(this.seconds / 60),
        pauses: this.totalPausedTime,
        efficiencyScore: Math.max(0, this.seconds - this.totalPausedTime),
        timestamp: new Date().toISOString()
    };

    this.sessionHistory.push(session);

    this.reset(displayElementId);

    this.totalPausedTime = 0;

    return session;
};


// 🔥 formato alternativo compacto
StudyTimer.getFormatted = function () {

    const h = Math.floor(this.seconds / 3600);
    const m = Math.floor((this.seconds % 3600) / 60);
    const s = this.seconds % 60;

    return {
        hours: h,
        minutes: m,
        seconds: s,
        text: `${h}h ${m}m ${s}s`
    };
};


// 🔥 productividad score del timer
StudyTimer.getProductivityScore = function () {

    if (this.seconds === 0) return 0;

    const efficiency =
        this.seconds - this.totalPausedTime;

    return Math.min(
        100,
        Math.round((efficiency / this.seconds) * 100)
    );
};