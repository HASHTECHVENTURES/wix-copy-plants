import express from 'express';
import path from 'path';
import { routes } from './routes/index.js';
import { initializeDbConnection } from './db.js';

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 8080;
const isVercelService = Boolean(process.env.VERCEL);

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

if (!isVercelService) {
    app.use(express.static(path.join(__dirname, '../build')));

    app.get(/^(?!\/api).+/, (req, res) => {
        res.sendFile(path.join(__dirname, '../build/index.html'));
    });
}

routes.forEach(route => {
    app[route.method](route.path, route.handler);
});

if (!isVercelService) {
    dbReady.then(() => {
        app.listen(PORT, () => {
            console.log(`Server is listening on port ${PORT}`);
        });
    });
}

export default app;
