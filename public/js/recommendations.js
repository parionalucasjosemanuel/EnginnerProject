const RecommendationEngine = (() => {

    function generateRecommendations(
        analysis
    ) {

        const recommendations = [];

        if (
            analysis.estimatedComplexity ===
            'O(n²)'
        ) {

            recommendations.push(
                'Try reducing nested loops to improve time complexity.'
            );
        }

        if (
            analysis.modularityScore < 50
        ) {

            recommendations.push(
                'Split your logic into reusable functions.'
            );
        }

        if (
            analysis.loops >= 3
        ) {

            recommendations.push(
                'Consider optimizing repetitive loop structures.'
            );
        }

        if (
            analysis.recursionDetected
        ) {

            recommendations.push(
                'Good use of recursion. Practice memoization for optimization.'
            );
        }

        if (
            recommendations.length === 0
        ) {

            recommendations.push(
                'Your solution structure looks efficient.'
            );
        }

        return recommendations;
    }

    return {
        generateRecommendations
    };
})();

// ===============================
// 🔥 PRO RECOMMENDATION ENGINE EXTENSION
// (SAFE ADD-ON, NO BREAK CHANGES)
// ===============================

// versión avanzada de recomendaciones (más inteligente)
RecommendationEngine.generateAdvancedRecommendations = function (analysis, code = "") {

    const recommendations = [...this.generateRecommendations(analysis)];

    // 🔹 nuevas reglas basadas en complejidad real
    if (analysis.estimatedComplexity === 'O(n²)' && analysis.loops >= 2) {
        recommendations.push(
            "High risk of performance issues: consider using hash maps or caching strategies."
        );
    }

    // 🔹 detección de baja calidad estructural
    if (analysis.modularityScore < 30) {
        recommendations.push(
            "Code is highly monolithic: split into smaller independent modules."
        );
    }

    // 🔹 mejora basada en comentarios (si hay análisis disponible)
    if (analysis.comments !== undefined && analysis.comments < 2) {
        recommendations.push(
            "Add comments to improve readability and maintainability."
        );
    }

    // 🔹 detección de código largo
    if (analysis.lines && analysis.lines > 100) {
        recommendations.push(
            "Large file detected: consider separating into multiple files or modules."
        );
    }

    // 🔹 mejora si no hay estructuras detectadas
    if (analysis.structures && analysis.structures.length === 0) {
        recommendations.push(
            "No data structures detected: try practicing arrays, maps or trees."
        );
    }

    // 🔹 bonus si es bueno (refuerzo positivo real)
    if (analysis.quality && analysis.quality > 80) {
        recommendations.push(
            "Excellent code quality: keep maintaining this level of structure."
        );
    }

    return recommendations;
};


// versión “inteligente unificada”
RecommendationEngine.smartRecommendations = function (analysis, code) {

    return {
        basic: this.generateRecommendations(analysis),
        advanced: this.generateAdvancedRecommendations(analysis, code),

        score: {
            risk:
                analysis.estimatedComplexity === 'O(n²)' ? "HIGH" : "LOW",

            maintainability:
                analysis.modularityScore >= 50 ? "GOOD" : "WEAK"
        }
    };
};