import { createApp } from './app.js';
import { connectToDatabase } from './config/db.js';
import { env } from './config/env.js';
import { logger } from './utils/logger.js';

async function main() {
    await connectToDatabase();
    const app = createApp();
    app.listen(env.port, () => {
        logger.info(`Server listening on port ${env.port}`);
    });
}

main().catch((err) => {
    logger.error({ err }, 'Failed to start server');
    process.exit(1);
}); 