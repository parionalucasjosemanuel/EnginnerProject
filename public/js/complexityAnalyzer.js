const ComplexityAnalyzer = (() => {

    function analyze(code) {

        const nestedLoops =
            detectNestedLoops(code);

        const recursion =
            detectRecursion(code);

        const modularity =
            calculateModularity(code);

        return {

            estimatedComplexity:
                nestedLoops >= 2
                    ? 'O(n²)'
                    : 'O(n)',

            loops:
                nestedLoops,

            recursionDetected:
                recursion,

            modularityScore:
                modularity
        };
    }

    function detectNestedLoops(code) {

        const loopPatterns =
            /(for|while)/g;

        const matches =
            code.match(loopPatterns);

        return matches
            ? matches.length
            : 0;
    }

    function detectRecursion(code) {

        const functionMatches =
            code.match(
                /(def|function|void|int)\s+(\w+)/g
            );

        if (!functionMatches) {

            return false;
        }

        return functionMatches.some(
            functionDefinition => {

                const parts =
                    functionDefinition.split(' ');

                const functionName =
                    parts[parts.length - 1];

                return code.includes(
                    `${functionName}(`
                );
            }
        );
    }

    function calculateModularity(code) {

        const functions =
            code.match(
                /(def|function|void|int)/g
            );

        const functionCount =
            functions
                ? functions.length
                : 0;

        return Math.min(
            100,
            functionCount * 20
        );
    }

    return {
        analyze
    };
})();

// ===============================
// 🔥 PRO COMPLEXITY ANALYZER EXTENSION
// (SAFE ADD-ON, NO BREAK CHANGES)
// ===============================

// Mejor análisis principal (más preciso sin romper el original)
ComplexityAnalyzer.analyzeAdvanced = function (code) {

    const base = this.analyze(code);

    const conditionals = (code.match(/if|else|switch|case/g) || []).length;

    const operators = (code.match(/(\+|\-|\*|\/|%)/g) || []).length;

    const variables = (code.match(/(let|const|var)\s+\w+/g) || []).length;

    // nuevo score de complejidad realista
    let complexityScore = base.loops * 10 + conditionals * 3 + operators * 1;

    let complexityLevel = "Low";

    if (complexityScore > 60) complexityLevel = "High";
    else if (complexityScore > 30) complexityLevel = "Medium";

    return {
        ...base,

        conditionals,
        operators,
        variables,

        complexityScore,
        complexityLevel,

        readabilityScore: Math.max(
            0,
            100 - (complexityScore + variables)
        )
    };
};


// Detecta profundidad real de anidación (MEJORA REAL)
ComplexityAnalyzer.detectNestingDepth = function (code) {

    let maxDepth = 0;
    let currentDepth = 0;

    for (let char of code) {

        if (char === "{") currentDepth++;
        if (char === "}") currentDepth--;

        if (currentDepth > maxDepth) {
            maxDepth = currentDepth;
        }
    }

    return maxDepth;
};


// Detecta complejidad ciclomática básica (REAL simplificada)
ComplexityAnalyzer.cyclomaticComplexity = function (code) {

    const decisionPoints =
        (code.match(/if|else|for|while|case|catch|\?/g) || []).length;

    return decisionPoints + 1;
};


// Version PRO FINAL (todo en uno)
ComplexityAnalyzer.fullAnalysis = function (code) {

    const base = this.analyze(code);
    const advanced = this.analyzeAdvanced(code);

    return {
        ...base,
        ...advanced,

        nestingDepth: this.detectNestingDepth(code),
        cyclomaticComplexity: this.cyclomaticComplexity(code),

        maintainabilityIndex:
            Math.max(0, 100 - advanced.complexityScore)
    };
};