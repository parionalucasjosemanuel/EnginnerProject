const ThemeManager = (() => {

    const themeKey = 'codepulse-theme';

    function initialize() {

        const savedTheme = localStorage.getItem(themeKey);

        // 🔥 Detectar sistema si no hay preferencia
        if (!savedTheme) {
            const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

            if (prefersLight) {
                enableLightTheme();
            }
        } else if (savedTheme === 'light') {
            enableLightTheme();
        }
    }

    function toggleTheme() {

        if (isLight()) {
            disableLightTheme();
        } else {
            enableLightTheme();
        }

        updateButton();
    }

    function isLight() {
        return document.documentElement.classList.contains('light-theme');
    }

    function enableLightTheme() {

        document.documentElement.classList.add('light-theme');

        localStorage.setItem(themeKey, 'light');
    }

    function disableLightTheme() {

        document.documentElement.classList.remove('light-theme');

        localStorage.setItem(themeKey, 'dark');
    }

    // 🔘 actualizar icono del botón
    function updateButton() {
        const btn = document.getElementById("themeToggleBtn");

        if (!btn) return;

        btn.textContent = isLight() ? "🌙" : "☀️";
    }

    // 🔗 conectar botón (SIN inline JS)
    function bindToggleButton() {
        const btn = document.getElementById("themeToggleBtn");

        if (!btn) return;

        btn.addEventListener("click", toggleTheme);

        updateButton();
    }

    return {
        initialize,
        bindToggleButton
    };

})();

document.addEventListener("DOMContentLoaded", () => {
    ThemeManager.initialize();
    ThemeManager.bindToggleButton();
});