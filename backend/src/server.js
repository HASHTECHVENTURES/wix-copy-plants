import express from 'express';
import path from 'path';
import { routes } from './routes/index.js';
import { initializeDbConnection } from './db.js';

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 8080;

const app = express();

app.use(express.json());

const dbReady = initializeDbConnection()
    .catch((err) => {
        console.error('Failed to connect to Supabase:', err.message);
        throw err;
    });

app.use(async (req, res, next) => {
    try {
        await dbReady;
        next();
    } catch (err) {
        res.status(500).json({ message: 'Database unavailable' });
    }
});

app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

routes.forEach(route => {
    app[route.method](route.path, route.handler);

    if (route.path.startsWith('/api')) {
        const strippedPath = route.path.replace(/^\/api/, '') || '/';
        app[route.method](strippedPath, route.handler);
    }
});

app.use(express.static(path.join(__dirname, '../build')));

app.get(/^(?!\/api).+/, (req, res) => {
    res.sendFile(path.join(__dirname, '../build/index.html'));
});

if (!process.env.VERCEL) {
    dbReady.then(() => {
        app.listen(PORT, () => {
            console.log(`Server is listening on port ${PORT}`);
        });
    });
}

export default app;
