import express, { json, urlencoded } from 'express';
import { Pool } from 'pg';
import { collectDefaultMetrics, Registry, Counter, Histogram } from 'prom-client';

const app = express();
const port = process.env.PORT;
const basePath = process.env.API_BASE_PATH;

const register = new Registry();
collectDefaultMetrics({ register });

const itemsProcessed = new Counter({
    name: 'app_items_processed_total',
    help: 'Total items processed',
});
register.registerMetric(itemsProcessed);

const requestDuration = new Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [0.0001, 0.0002, 0.0003, 0.0004, 0.0006, 0.001, 0.0016, 0.0025, 0.004, 0.0063, 0.01, 0.0158, 0.0251, 0.0398, 0.0631, 0.1, 0.1585, 0.2512, 0.3981, 0.631, 1.0]
});
register.registerMetric(requestDuration);

app.use(json());
app.use(urlencoded({ extended: true }));
app.use((req, res, next) => {
    const end = requestDuration.startTimer({ method: req.method, route: req.path });
    res.on('finish', () => {
        end({ status_code: res.statusCode });
    });
    next();
});

// Add fake delay to simulate network latency
app.use((req, res, next) => {
    setTimeout(next, 50);
});

const pool = new Pool({
    host: process.env.POSTGRES_HOST,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    port: 5432,
});

app.get(`${basePath}`, (req, res) => {
    res.json({message: 'API running'});
});

app.get(`${basePath}/items`, async (req, res) => {
    const result = await pool.query('SELECT * FROM items ORDER BY id DESC');
    res.json(result.rows);
});

app.post(`${basePath}/items`, async (req, res) => {
    const { name } = req.body;
    itemsProcessed.inc(1);
    const result = await pool.query(
        'INSERT INTO items(name) VALUES($1) RETURNING *',
        [name]
    );
    res.json(result.rows[0]);
});

app.delete(`${basePath}/items/:id`, async (req, res) => {
    const { id } = req.params;

    try {
        await pool.query('DELETE FROM items WHERE id = $1', [id]);
        res.json({ message: `Deleted id ${id}` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// BELOW ARE NON-ROUTABLE VIA INGRESS

app.get('/metrics', async (req, res) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
});

app.get('/livez', (req, res) => {
    res.status(200).send('OK');
});

app.get('/readyz', async (req, res) => {
    try {
        await pool.query('SELECT 1');
        res.status(200).send('READY');
    }
    catch (err) {
        res.status(500).send('NOT OK');
    }
});

// ABOVE ARE NON-ROUTABLE VIA INGRESS

const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down...');
    server.close(() => {
        pool.end(() => {
            process.exit(0);
        });
    });
});

pool.on('error', (err) => {
  console.error('Unexpected DB error', err);
});
