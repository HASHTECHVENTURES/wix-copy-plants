import express from 'express';
import path from 'path';
import { routes } from './routes/index.js';
import { initializeDbConnection } from './db.js';

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 8080;
const isVercel = Boolean(process.env.VERCEL);

const app = express();

app.use(express.json({ limit: '10mb' }));

// Health check must not wait on the database
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        hasSupabaseUrl: Boolean(process.env.SUPABASE_URL),
        hasServiceKey: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
    });
});

let dbReady = null;
const ensureDb = () => {
    if (!dbReady) {
        dbReady = initializeDbConnection().catch((err) => {
            console.error('Failed to connect to Supabase:', err.message);
            dbReady = null;
            throw err;
        });
    }
    return dbReady;
};

app.use('/api', async (req, res, next) => {
    if (req.path === '/health') return next();
    try {
        await ensureDb();
        next();
    } catch (err) {
        res.status(500).json({
            message: 'Database unavailable',
            detail: err.message,
        });
    }
});

routes.forEach((route) => {
    app[route.method](route.path, route.handler);
});

if (!isVercel) {
    app.use(express.static(path.join(__dirname, '../build')));

    app.get(/^(?!\/api).+/, (req, res) => {
        res.sendFile(path.join(__dirname, '../build/index.html'));
    });

    ensureDb()
        .then(() => {
            app.listen(PORT, () => {
                console.log(`Server is listening on port ${PORT}`);
            });
        })
        .catch((err) => {
            console.error('Failed to start server:', err.message);
            process.exit(1);
        });
}

export default app;
