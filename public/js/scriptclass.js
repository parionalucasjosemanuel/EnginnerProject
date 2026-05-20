function show(id) {
    document.querySelectorAll('.sec').forEach(sec => {
        sec.style.display = 'none';
    });

    document.getElementById(id).style.display = 'block';
}

// 🔥 MANEJO PROFESIONAL DE EVENTOS (SIN INLINE)
document.addEventListener("DOMContentLoaded", () => {

    const buttons = document.querySelectorAll("nav button");

    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            const section = btn.getAttribute("data-sec");
            show(section);
        });
    });

    // Mostrar C++ por defecto
    show("cpp");
});