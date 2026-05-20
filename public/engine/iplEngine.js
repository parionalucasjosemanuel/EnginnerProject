function calculateIPLFromData({ sessions, analysis, history }) {

    let study = 0;
    let difficulty = 0;
    let consistency = sessions.length;
    let complexityPenalty = 0;

    // study
    sessions.forEach(s => {
        study += Number(s.studyTime || 0);
        difficulty += Number(s.difficultyScore || 0);
    });

    // average
    const avgStudy = study / (sessions.length || 1);
    const avgDifficulty = difficulty / (sessions.length || 1);

    // consistency curve (important)
    const consistencyFactor = Math.log(consistency + 1) * 10;

    // analysis impact
    if (analysis) {
        complexityPenalty =
            (analysis.cyclomaticComplexity || 0) * 0.5 +
            (analysis.maxNestingDepth || 0) * 2;
    }

    // FINAL IPL FORMULA (CENTRALIZED ENGINE)
    const ipl =
        (avgStudy * 0.4) +
        (avgDifficulty * 0.35) +
        (consistencyFactor * 0.25) -
        complexityPenalty;

    return Math.max(0, Math.min(100, Math.round(ipl)));
}

module.exports = {
    calculateIPLFromData
};