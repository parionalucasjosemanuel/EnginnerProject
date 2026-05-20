function buildAnalytics(database, userId) {

    const sessions = database.sessions.filter(s => s.userId === userId);

    const totalStudy = sessions.reduce((a, b) => a + Number(b.studyTime || 0), 0);

    const avgDifficulty =
        sessions.reduce((a, b) => a + Number(b.difficultyScore || 0), 0)
        / (sessions.length || 1);

    const languages = {};

    sessions.forEach(s => {
        languages[s.language] = (languages[s.language] || 0) + 1;
    });

    const topLanguage =
        Object.entries(languages)
            .sort((a, b) => b[1] - a[1])[0]?.[0] || "None";

    return {
        sessionsCount: sessions.length,
        totalStudy,
        avgDifficulty,
        topLanguage,
        consistency: sessions.length,
    };
}

module.exports = { buildAnalytics };