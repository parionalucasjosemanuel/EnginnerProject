document.addEventListener("DOMContentLoaded", () => {

    const btn = document.getElementById("chatbotBtn");
    const modal = document.getElementById("chatbotModal");
    const chat = document.getElementById("chatbotChat");
    const body = document.getElementById("chatbotBody");

    let currentText = "";
    let currentLang = "es";
    let speaking = false;

    btn.addEventListener("click", () => {
        modal.classList.add("active");
    });

    document.getElementById("closeModal").addEventListener("click", () => {
        modal.classList.remove("active");
    });

    document.querySelectorAll(".chatbot-lang-btn").forEach(btnLang => {
        btnLang.addEventListener("click", () => {
            currentLang = btnLang.dataset.lang;
            modal.classList.remove("active");
            startChat(currentLang);
        });
    });

    function startChat(lang) {
        chat.classList.add("active");

        const page = document.body.dataset.page;
        const content = getContent(page, lang);

        currentText = content;

        typeEffect(content, () => {
            speak(content, lang);
        });
    }

    function typeEffect(text, callback) {
        body.innerHTML = "";
        let i = 0;

        const interval = setInterval(() => {
            body.innerHTML += text[i];
            i++;
            if (i >= text.length) {
                clearInterval(interval);
                if (callback) callback();
            }
        }, 10);
    }

    // 🔊 SPEECH ENGINE
    function speak(text, lang) {
        if (!('speechSynthesis' in window)) return;

        speechSynthesis.cancel();

        const utter = new SpeechSynthesisUtterance(text);

        utter.lang = lang === "es" ? "es-ES" : "en-US";
        utter.rate = 1;
        utter.pitch = 1;

        const voices = speechSynthesis.getVoices();

        const voice = voices.find(v =>
            lang === "es"
                ? v.lang.includes("es")
                : v.lang.includes("en")
        );

        if (voice) utter.voice = voice;

        speechSynthesis.speak(utter);
        speaking = true;
    }

    // 🔘 CONTROLES
    document.getElementById("chatbotMute").addEventListener("click", () => {
        speechSynthesis.cancel();
        speaking = false;
    });

    document.getElementById("chatbotReplay").addEventListener("click", () => {
        speak(currentText, currentLang);
    });

    document.getElementById("chatbotSpeed").addEventListener("change", (e) => {
        window.chatbotSpeed = parseFloat(e.target.value);
    });

    function getContent(page, lang) {

        const data = {

            analytics: {
                es: `📊 ANALYTICS COMPLETO:

Esta sección es el núcleo de inteligencia de la plataforma CodePulse Campus.

Aquí el usuario visualiza métricas avanzadas como:
- Horas totales de estudio
- Lenguaje dominante
- Dificultad promedio
- Número de sesiones

También incluye gráficos dinámicos que muestran:
- Evolución semanal
- Distribución de lenguajes
- Crecimiento de rendimiento (IPL)

El usuario puede filtrar por tiempo (7 días, 30 días o todo).

Además, el sistema genera insights automáticos que ayudan a mejorar el rendimiento.

En resumen: esta página convierte datos en decisiones estratégicas.`,

                en: `📊 ANALYTICS FULL:

This is the intelligence core of CodePulse Campus.

Users can see:
- Total study hours
- Main programming language
- Average difficulty
- Session count

Charts show:
- Weekly evolution
- Language distribution
- Performance growth (IPL)

Filters allow time-based analysis.

AI-generated insights guide user improvement.

This page transforms raw data into strategy.`
            },

            practice: {
                es: `💻 PRACTICE PROFESIONAL:

Aquí el usuario entrena programación de forma real.

Puede:
- Elegir lenguaje (Python, Java, C++)
- Elegir tema
- Registrar tiempo de estudio
- Evaluar dificultad
- Pegar su código

El sistema analiza:
- Complejidad algorítmica
- Calidad del código
- Modularidad
- Loops detectados

También calcula:
- XP ganado
- Eficiencia
- Impacto en el IPL

Es básicamente un simulador de entrenamiento competitivo.`,

                en: `💻 PRACTICE PROFESSIONAL:

This is the training core.

Users can:
- Select language
- Choose topic
- Track time
- Input code

System analyzes:
- Algorithm complexity
- Code quality
- Modularity

Also calculates:
- XP
- Efficiency
- IPL impact

This is a real competitive programming simulator.`
            },
       leaderboard: {
    es: `🏆 LEADERBOARD COMPLETO:

Esta sección muestra el ranking global de todos los usuarios de CodePulse Campus.

Aquí el usuario puede visualizar:
- Posición actual en el ranking
- Nombre de usuario
- IPL (Intelligence Performance Level)
- Nivel alcanzado

El sistema ordena automáticamente a los usuarios según su rendimiento acumulado.

Funciones clave:
- Botón de actualización en tiempo real (Refresh)
- Filtro por:
   • Global (todos)
   • Top 10 (mejores usuarios)
   • Me (tu posición personal)

También se muestra la última vez que se actualizó el ranking.

Objetivo:
Motivar la competencia y medir el progreso frente a otros usuarios.

En resumen: esta página convierte el rendimiento en competencia real.`,

    en: `🏆 LEADERBOARD FULL:

This section displays the global ranking of all users.

Users can see:
- Rank position
- Username
- IPL score
- Level

The system automatically ranks users based on performance.

Features:
- Real-time refresh
- Filters:
   • Global
   • Top 10
   • Personal ranking

Shows last update timestamp.

Goal:
Encourage competition and track progress against others.

This page transforms performance into competitive ranking.`
},

class: {
    es: `📚 CLASES AVANZADAS:

Esta sección es una plataforma educativa completa de nivel experto.

Incluye contenido en:
- C++
- Java
- Python
- Redes (Cisco)

Cada lenguaje contiene múltiples clases con:

📘 Teoría completa:
Explicaciones profundas de algoritmos, estructuras de datos y optimización.

🧠 Ejemplos reales:
Código aplicado a problemas reales.

🧩 Problemas:
Ejercicios tipo competencia (Codeforces, AtCoder).

🏆 Simulación de concursos:
Entrenamiento bajo presión real.

🔍 Análisis:
Errores comunes como:
- TLE (Time Limit Exceeded)
- WA (Wrong Answer)

🌐 Recursos externos:
Links a plataformas profesionales.

En redes:
- Modelo OSI
- TCP/IP
- Routing
- Switching
- Configuración Cisco CLI

En resumen:
Es un entorno de formación avanzada tipo universidad + competencia.`,

    en: `📚 ADVANCED CLASSES:

This is a high-level educational platform.

Includes:
- C++
- Java
- Python
- Networking (Cisco)

Each section contains:

📘 Theory:
Deep explanations of algorithms and optimization.

🧠 Real examples:
Practical coding.

🧩 Problems:
Competitive programming exercises.

🏆 Contests:
Real simulation environments.

🔍 Analysis:
Common errors like TLE and WA.

🌐 Resources:
External professional links.

Networking includes:
- OSI model
- TCP/IP
- Routing
- Switching
- Cisco CLI

Summary:
A mix of university-level learning and competitive training.`
},

challenges: {
    es: `🧩 CHALLENGES COMPLETO:

Esta sección contiene retos de programación estructurados.

El usuario puede:
- Ver lista de problemas
- Filtrar por dificultad:
   • Easy
   • Medium
   • Hard
- Actualizar la lista dinámicamente

También incluye estadísticas:
- Total de retos
- Retos resueltos
- Cantidad de retos difíciles

Los retos ayudan a:
- Mejorar lógica
- Prepararse para entrevistas técnicas
- Practicar algoritmos

Sistema visual:
Los retos aparecen en formato grid dinámico.

En resumen:
Es un sistema de práctica estructurada orientado a progresión real.`,

    en: `🧩 CHALLENGES FULL:

This section contains structured coding challenges.

Users can:
- View problem list
- Filter by difficulty:
   • Easy
   • Medium
   • Hard
- Refresh dynamically

Includes stats:
- Total challenges
- Solved challenges
- Hard challenges

Purpose:
- Improve logic
- Prepare for interviews
- Practice algorithms

Displayed in dynamic grid layout.

Summary:
A structured practice system for real progression.`
},

activity: {
    es: `📜 ACTIVITY LOGS:

Esta sección registra toda la actividad del usuario dentro del sistema.

Aquí se muestra:
- Historial completo de acciones
- Eventos automáticos del sistema
- Registro cronológico

El usuario puede:
- Revisar su comportamiento pasado
- Analizar consistencia
- Detectar patrones de estudio

Es una herramienta clave para:
- Auditoría personal
- Seguimiento de progreso
- Control de hábitos

En resumen:
Es la memoria completa del usuario dentro de la plataforma.`,

    en: `📜 ACTIVITY LOGS:

This section tracks all user activity.

Displays:
- Full action history
- System events
- Chronological logs

Users can:
- Review past behavior
- Analyze consistency
- Detect study patterns

Useful for:
- Personal tracking
- Progress monitoring
- Habit control

Summary:
This is the user's full system memory.`
},

notifications: {
    es: `🔔 NOTIFICATIONS COMPLETO:

Aquí el usuario recibe todas las notificaciones del sistema.

Incluye:
- Alertas importantes
- Actualizaciones
- Eventos recientes

Funciones:
- Contador de notificaciones no leídas
- Botón para marcar todo como leído
- Filtros:
   • Todas
   • Leídas
   • No leídas
- Actualización en tiempo real

También muestra:
- Última actualización

Objetivo:
Mantener al usuario informado constantemente.

En resumen:
Es el centro de comunicación del sistema.`,

    en: `🔔 NOTIFICATIONS FULL:

This section displays all system notifications.

Includes:
- Alerts
- Updates
- Recent events

Features:
- Unread counter
- Mark all as read
- Filters:
   • All
   • Read
   • Unread
- Real-time refresh

Also shows last update.

Summary:
The communication hub of the system.`
},

profile: {
    es: `👤 PROFILE COMPLETO:

Esta sección muestra el perfil completo del usuario.

Incluye:

📊 Estadísticas principales:
- IPL Score
- Total de sesiones
- Experiencia (XP)

📈 Métricas avanzadas:
- Streak actual
- Dificultad promedio
- Tiempo promedio de estudio
- Nivel de rendimiento

📜 Historial:
- Registro de prácticas pasadas

El usuario puede:
- Analizar su progreso
- Ver su evolución
- Medir consistencia

Diseño:
Panel visual organizado con tarjetas.

En resumen:
Es el centro de identidad y progreso del usuario.`,

    en: `👤 PROFILE FULL:

This section shows the full user profile.

Includes:

📊 Main stats:
- IPL score
- Total sessions
- XP

📈 Advanced metrics:
- Current streak
- Average difficulty
- Study time
- Performance tier

📜 History:
- Past practice logs

Users can:
- Track progress
- Analyze growth
- Measure consistency

Summary:
The identity and progress hub of the user.`
}     

        };

        return data[page]?.[lang] || "No data available";
    }

});