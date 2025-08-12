import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import pinoHttp from 'pino-http';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import { logger } from './utils/logger.js';
import { env } from './config/env.js';
import { apiLimiter } from './middleware/rateLimit.js';
import routes from './routes/index.js';
import { openapi } from './docs/openapi.js';

export function createApp() {
    const app = express();

    app.use(pinoHttp({ logger }));
    app.use(helmet());
    app.use(cors());
    app.use(compression());
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true }));

    app.use('/uploads', express.static(path.join(process.cwd(), env.uploadsDir)));

    app.get('/health', (_req, res) => {
        res.json({ status: 'ok' });
    });

    // OpenAPI/Swagger
    app.get('/openapi.json', (_req, res) => res.json(openapi));
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapi));

    app.use('/api', apiLimiter, routes);

    app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
        logger.error({ err }, 'Unhandled error');
        res.status(500).json({ message: 'Internal server error' });
    });

    return app;
} 