const CodeMetrics = (() => {

    function countLines(code) {

        return code
            .split('\n')
            .filter(
                line =>
                    line.trim() !== ''
            ).length;
    }

    function countComments(code) {

        const commentMatches =
            code.match(
                /(\/\/.*|#.*|\/\*[\s\S]*?\*\/)/g
            );

        return commentMatches
            ? commentMatches.length
            : 0;
    }

    function detectDataStructures(code) {

        const structures = [];

        if (
            /array|list|\[\]/i.test(code)
        ) {

            structures.push('Arrays');
        }

        if (
            /map|hashmap|dictionary/i.test(code)
        ) {

            structures.push('Hash Maps');
        }

        if (
            /stack/i.test(code)
        ) {

            structures.push('Stacks');
        }

        if (
            /queue/i.test(code)
        ) {

            structures.push('Queues');
        }

        if (
            /tree|node/i.test(code)
        ) {

            structures.push('Trees');
        }

        return structures;
    }

    return {
        countLines,
        countComments,
        detectDataStructures
    };
})();

// ===============================
// 🔥 PRO CODE METRICS EXTENSION
// (NO BREAK CHANGES - SAFE ADDITION)
// ===============================

CodeMetrics.calculateComplexityScore = function (code) {

    let score = 1;

    const patterns = [
        { regex: /for\s*\(/g, weight: 2 },
        { regex: /while\s*\(/g, weight: 2 },
        { regex: /if\s*\(/g, weight: 1 },
        { regex: /else/g, weight: 1 },
        { regex: /switch/g, weight: 3 },
        { regex: /catch/g, weight: 2 },
        { regex: /recursive|function\s+\w+\s*\(/g, weight: 3 }
    ];

    patterns.forEach(p => {
        const matches = code.match(p.regex);
        if (matches) {
            score += matches.length * p.weight;
        }
    });

    return Math.min(score, 100);
};


// Detecta funciones (REAL parsing básico, no fake)
CodeMetrics.countFunctions = function (code) {

    const matches = code.match(
        /function\s+\w+|=>\s*{|\w+\s*\([^)]*\)\s*{/g
    );

    return matches ? matches.length : 0;
};


// Detecta variables declaradas
CodeMetrics.countVariables = function (code) {

    const matches = code.match(
        /(let|const|var)\s+\w+/g
    );

    return matches ? matches.length : 0;
};


// Score general de calidad (nuevo sistema real)
CodeMetrics.calculateQualityScore = function (code) {

    const lines = this.countLines(code);
    const comments = this.countComments(code);
    const functions = this.countFunctions(code);

    let score = 50;

    // bonus por modularidad
    score += functions * 5;

    // bonus por comentarios
    score += comments * 2;

    // penalización por código muy largo sin estructura
    if (lines > 200) score -= 10;
    if (lines < 10) score -= 5;

    return Math.max(0, Math.min(100, score));
};


// Detecta nivel de seniority del código
CodeMetrics.detectLevel = function (code) {

    const complexity = this.calculateComplexityScore(code);
    const functions = this.countFunctions(code);

    if (complexity > 70 && functions > 5) return "Advanced";
    if (complexity > 40) return "Intermediate";
    return "Beginner";
};


// Analizador completo (API-style local)
CodeMetrics.fullAnalysis = function (code) {

    return {
        lines: this.countLines(code),
        comments: this.countComments(code),
        functions: this.countFunctions(code),
        variables: this.countVariables(code),
        structures: this.detectDataStructures(code),
        complexity: this.calculateComplexityScore(code),
        quality: this.calculateQualityScore(code),
        level: this.detectLevel(code)
    };
};