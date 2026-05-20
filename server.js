const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const fs = require('fs-extra');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3000;

const DATABASE_PATH = path.join(__dirname, 'db.json');

const JWT_SECRET = 'CODEPULSE_SUPER_SECRET_KEY_2026';

app.use(cors());
app.use(helmet());

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(morgan('dev'));

app.use(express.static(path.join(__dirname, 'public')));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    message: {
        success: false,
        message: 'Too many requests.'
    }
});

app.use(limiter);

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'CodePulse Campus API',
            version: '1.0.0',
            description: 'Advanced programming analytics platform API'
        },
        servers: [
            {
                url: `http://localhost:${PORT}`
            }
        ]
    },
    apis: ['./server.js']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocs)
);

function readDatabase() {
    return fs.readJsonSync(DATABASE_PATH);
}

function writeDatabase(data) {
    fs.writeJsonSync(DATABASE_PATH, data, {
        spaces: 2
    });
}

function generateToken(user) {
    return jwt.sign(
        {
            id: user.id,
            username: user.username,
            email: user.email
        },
        JWT_SECRET,
        {
            expiresIn: '7d'
        }
    );
}

function authenticateToken(req, res, next) {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            success: false,
            message: 'Access token required.'
        });
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, JWT_SECRET, (err, user) => {

        if (err) {
            return res.status(403).json({
                success: false,
                message: 'Invalid token.'
            });
        }

        req.user = user;

        next();
    });
}

function calculateIPL(userSessions) {

    if (!userSessions.length) {
        return 0;
    }

    let totalHours = 0;
    let totalDifficulty = 0;
    let consistency = userSessions.length;

    userSessions.forEach(session => {

        totalHours += Number(session.studyTime || 0);

        totalDifficulty += Number(session.difficultyScore || 0);
    });

    const averageDifficulty = totalDifficulty / userSessions.length;

    const rawIPL =
        (totalHours * 0.35) +
        (averageDifficulty * 0.45) +
        (consistency * 0.20);

    return Math.min(100, Math.round(rawIPL));
}

function addActivityLog(database, userId, action, details) {

    const log = {
        id: uuidv4(),
        userId,
        action,
        details,
        createdAt: new Date().toISOString()
    };

    database.activityLogs.push(log);

    return log;
}
function generateSystemMetrics(database) {

    const totalUsers = database.users.length;

    const totalSessions = database.sessions.length;

    const totalSubmissions = database.submissions.length;

    const acceptedSubmissions =
        database.submissions.filter(s => s.status === 'Accepted').length;

    const averageIPL =
        database.users.reduce((sum, u) => sum + (u.ipl || 0), 0)
        / (database.users.length || 1);

    const activeUsersToday =
        new Set(
            database.sessions
                .filter(s => {
                    const today = new Date().toDateString();
                    return new Date(s.createdAt).toDateString() === today;
                })
                .map(s => s.userId)
        ).size;

    const metric = {
        id: uuidv4(),
        activeUsers: activeUsersToday,
        totalUsers,
        totalSessions,
        totalChallengesSolved: acceptedSubmissions,
        averageIPL: Math.round(averageIPL),
        systemLoadScore: Math.min(100, activeUsersToday * 2 + totalSessions * 0.3),
        recordedAt: new Date().toISOString()
    };

    database.systemMetrics.push(metric);

    return metric;
}
function analyzeCode(code, language) {

    const analysis = {
        language,
        lines: 0,
        loops: 0,
        nestedLoops: false,
        functions: 0,
        recursion: false,
        arrays: false,
        hashMaps: false,
        modularityScore: 0,
        estimatedComplexity: 'O(1)',
        recommendations: []
    };

    const lines = code.split('\n');

    analysis.lines = lines.length;

    const lowerCode = code.toLowerCase();

    if (language === 'Python') {

        analysis.loops =
            (lowerCode.match(/for /g) || []).length +
            (lowerCode.match(/while /g) || []).length;

        analysis.functions =
            (lowerCode.match(/def /g) || []).length;

        analysis.arrays =
            lowerCode.includes('list') ||
            lowerCode.includes('[]');

        analysis.hashMaps =
            lowerCode.includes('dict') ||
            lowerCode.includes('{}');

        analysis.recursion =
            lowerCode.includes('return') &&
            lowerCode.includes('(');

    }

    if (language === 'Java') {

        analysis.loops =
            (lowerCode.match(/for\s*\(/g) || []).length +
            (lowerCode.match(/while\s*\(/g) || []).length;

        analysis.functions =
            (lowerCode.match(/public /g) || []).length;

        analysis.arrays =
            lowerCode.includes('array') ||
            lowerCode.includes('arraylist');

        analysis.hashMaps =
            lowerCode.includes('hashmap');

    }

    if (language === 'C++') {

        analysis.loops =
            (lowerCode.match(/for\s*\(/g) || []).length +
            (lowerCode.match(/while\s*\(/g) || []).length;

        analysis.functions =
            (lowerCode.match(/void /g) || []).length +
            (lowerCode.match(/int /g) || []).length;

        analysis.arrays =
            lowerCode.includes('vector') ||
            lowerCode.includes('array');

        analysis.hashMaps =
            lowerCode.includes('map');

    }

    if (analysis.loops >= 2) {

        analysis.nestedLoops = true;

        analysis.estimatedComplexity = 'O(n²)';

        analysis.recommendations.push(
            'Optimize nested loops to improve performance.'
        );

    } else if (analysis.loops === 1) {

        analysis.estimatedComplexity = 'O(n)';
    }

    if (analysis.functions >= 3) {

        analysis.modularityScore = 90;

    } else if (analysis.functions >= 1) {

        analysis.modularityScore = 60;

    } else {

        analysis.modularityScore = 20;

        analysis.recommendations.push(
            'Improve modularization by creating functions.'
        );
    }

    if (analysis.recursion) {

        analysis.recommendations.push(
            'Review recursion efficiency and stack optimization.'
        );
    }

    return analysis;
}

/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: Register a new user
 */
app.post('/api/register', async (req, res) => {

    try {

        const database = readDatabase();

        const {
            username,
            email,
            password
        } = req.body;

        const existingUser = database.users.find(
            user => user.email === email
        );

        if (existingUser) {

            return res.status(400).json({
                success: false,
                message: 'Email already registered.'
            });
        }

        const hashedPassword =
            await bcrypt.hash(password, 10);

        const newUser = {
            id: uuidv4(),
            username,
            email,
            password: hashedPassword,
            createdAt: new Date().toISOString(),
            role: 'student',
            level: 1,
            experience: 0,
            ipl: 0
        };

        database.users.push(newUser);
        addActivityLog(
    database,
    newUser.id,
    "Account Created",
    "User registered in CodePulse Campus"
);

        writeDatabase(database);

        const token = generateToken(newUser);

        res.status(201).json({
            success: true,
            token,
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email
            }
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: 'Server error.'
        });
    }
});

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Login user
 */
app.post('/api/login', async (req, res) => {

    try {

        const database = readDatabase();

        const {
            email,
            password
        } = req.body;

        const user = database.users.find(
            user => user.email === email
        );

        if (!user) {

            return res.status(400).json({
                success: false,
                message: 'User not found.'
            });
        }

        const validPassword =
            await bcrypt.compare(password, user.password);

        if (!validPassword) {

            return res.status(401).json({
                success: false,
                message: 'Invalid password.'
            });
        }

        const token = generateToken(user);
addActivityLog(
    database,
    user.id,
    "Login",
    "User logged into system"
);
generateSystemMetrics(database);
        res.json({
            success: true,
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                ipl: user.ipl
            }
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: 'Internal server error.'
        });
    }
});

/**
 * @swagger
 * /api/analyze:
 *   post:
 *     summary: Analyze source code
 */
app.post('/api/analyze', authenticateToken, (req, res) => {

    try {

        const {
            code,
            language
        } = req.body;

        const database = readDatabase();

const analysis =
    analyzeCode(code, language);

addActivityLog(
    database,
    req.user.id,
    "Code Analysis",
    `Analyzed ${language} code (${analysis.estimatedComplexity})`
);
generateSystemMetrics(database);
writeDatabase(database);

res.json({
    success: true,
    analysis
});

    } catch (error) {

        res.status(500).json({
            success: false,
            message: 'Code analysis failed.'
        });
    }
});

app.post('/api/practice', authenticateToken, (req, res) => {

    try {

        const database = readDatabase();

        const session = {
            id: uuidv4(),
            userId: req.user.id,
            language: req.body.language,
            topic: req.body.topic,
            studyTime: req.body.studyTime,
            difficultyScore: req.body.difficultyScore,
            createdAt: new Date().toISOString()
        };
database.sessions.push(session);

// 🔥 NUEVO: actualizar métricas automáticamente
generateSystemMetrics(database);
        const userSessions =
            database.sessions.filter(
                item => item.userId === req.user.id
            );

        const userIPL =
            calculateIPL(userSessions);

        const userIndex =
            database.users.findIndex(
                item => item.id === req.user.id
            );

        database.users[userIndex].ipl = userIPL;
addActivityLog(
    database,
    req.user.id,
    "Practice Session",
    `Solved ${req.body.topic} in ${req.body.language}`
);
        writeDatabase(database);

        res.json({
            success: true,
            session,
            ipl: userIPL
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: 'Practice registration failed.'
        });
    }
});

app.get('/api/challenges', (req, res) => {

    try {

        const database = readDatabase();

        res.json({
            success: true,
            challenges: database.challenges
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: 'Could not load challenges.'
        });
    }
});

app.get(
    '/api/profile',
    authenticateToken,
    (req, res) => {

        try {

            const database = readDatabase();

            const user =
                database.users.find(
                    item => item.id === req.user.id
                );

            const sessions =
                database.sessions.filter(
                    item => item.userId === req.user.id
                );

            res.json({
                success: true,
                profile: {
                    user,
                    sessions
                }
            });

        } catch (error) {

            res.status(500).json({
                success: false,
                message: 'Profile error.'
            });
        }
    }
);
/**
 * GET USER NOTIFICATIONS
 */
app.get('/api/notifications', authenticateToken, (req, res) => {
    try {
        const database = readDatabase();

        const notifications = database.notifications.filter(
            n => n.userId === req.user.id
        );

        res.json({
            success: true,
            notifications
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Notifications error.'
        });
    }
});

/**
 * MARK NOTIFICATION AS READ
 */
app.patch('/api/notifications/:id/read', authenticateToken, (req, res) => {
    try {
        const database = readDatabase();

        const notificationIndex = database.notifications.findIndex(
            n =>
                n.id === req.params.id &&
                n.userId === req.user.id
        );

        if (notificationIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found.'
            });
        }

        database.notifications[notificationIndex].read = true;

        writeDatabase(database);

        res.json({
            success: true,
            message: 'Notification marked as read.'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Update failed.'
        });
    }
});
app.get('/api/leaderboard', (req, res) => {

    try {

        const database = readDatabase();

        const leaderboard =
            [...database.users]
                .sort((a, b) => b.ipl - a.ipl)
                .slice(0, 10);

        res.json({
            success: true,
            leaderboard
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: 'Leaderboard error.'
        });
    }
});
app.get('/api/activity-logs', authenticateToken, (req, res) => {

    try {

        const database = readDatabase();

        const logs = database.activityLogs
            .filter(log => log.userId === req.user.id)
            .sort((a, b) =>
                new Date(b.createdAt) - new Date(a.createdAt)
            );

        res.json({
            success: true,
            logs
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: 'Activity logs error'
        });
    }
});
app.get('/api/system-metrics', authenticateToken, (req, res) => {

    const database = readDatabase();

    const latest = database.systemMetrics.slice(-10);

    const realTimeMetrics = generateSystemMetrics(database);

    res.json({
        success: true,
        current: realTimeMetrics,
        history: latest
    });
    
});
app.get('*', (req, res) => {

    res.sendFile(
        path.join(__dirname, 'public', 'index.html')
    );
});

app.listen(PORT, () => {

    console.log(`
=========================================
🚀 CodePulse Campus Server Running
=========================================
🌐 URL:
http://localhost:${PORT}

📚 Swagger:
http://localhost:${PORT}/api-docs
=========================================
`);
});