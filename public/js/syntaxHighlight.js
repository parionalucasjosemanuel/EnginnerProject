const SyntaxHighlight = (() => {

    function escapeHTML(code) {

        return code
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }

    function highlight(code, language) {

        let highlightedCode =
            escapeHTML(code);

        const keywordMap = {

            Python: [
                'def',
                'return',
                'for',
                'while',
                'if',
                'else',
                'elif',
                'class',
                'import',
                'from',
                'try',
                'except'
            ],

            Java: [
                'public',
                'private',
                'class',
                'void',
                'int',
                'double',
                'if',
                'else',
                'for',
                'while',
                'return',
                'static'
            ],

            'C++': [
                'int',
                'float',
                'double',
                'void',
                'class',
                'public',
                'private',
                'for',
                'while',
                'return',
                'include'
            ]
        };

        const keywords =
            keywordMap[language] || [];

        keywords.forEach(keyword => {

            const regex =
                new RegExp(
                    `\\b${keyword}\\b`,
                    'g'
                );

            highlightedCode =
                highlightedCode.replace(
                    regex,
                    `<span class="syntax-keyword">${keyword}</span>`
                );
        });

        highlightedCode =
            highlightedCode.replace(
                /("[^"]*"|'[^']*')/g,
                '<span class="syntax-string">$1</span>'
            );

        highlightedCode =
            highlightedCode.replace(
                /(\d+)/g,
                '<span class="syntax-number">$1</span>'
            );

        return highlightedCode;
    }

    return {
        highlight
    };
})();

// ===============================
// 🔥 PRO SYNTAX HIGHLIGHT EXTENSION
// (SAFE ADD-ON, NO BREAK CHANGES)
// ===============================

// mejora: soporte multi-language más flexible
SyntaxHighlight.highlightAdvanced = function (code, language) {

    let result = this.highlight(code, language);

    // 🔹 comentarios (Python, JS, Java, C++)
    result = result.replace(
        /(\/\/.*$|#.*$)/gm,
        '<span class="syntax-comment">$1</span>'
    );

    // 🔹 operadores
    result = result.replace(
        /(\+|\-|\*|\/|=|==|!=|<=|>=)/g,
        '<span class="syntax-operator">$1</span>'
    );

    // 🔹 funciones (detección básica real)
    result = result.replace(
        /\b([a-zA-Z_]\w*)\s*\(/g,
        '<span class="syntax-function">$1</span>('
    );

    return result;
};


// versión inteligente con auto-detección de lenguaje básica
SyntaxHighlight.autoHighlight = function (code) {

    let language = "Unknown";

    if (/def |import |elif/.test(code)) language = "Python";
    else if (/public class|System\.out/.test(code)) language = "Java";
    else if (/include|std::|cout/.test(code)) language = "C++";

    return {
        language,
        highlighted: this.highlightAdvanced(code, language)
    };
};


// versión segura (evita inyección HTML básica)
SyntaxHighlight.safeHighlight = function (code, language) {

    const clean = code
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

    return this.highlightAdvanced(clean, language);
};