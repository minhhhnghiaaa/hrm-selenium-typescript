import { config } from 'dotenv';
import { join } from 'path';

const getEnvFile = () => {
    const env = process.env.NODE_ENV || 'dev';
    const envMap: Record<string, string> = {
        development: 'dev.env',
        stage: 'stage.env',
        production: 'prod.env',
    };

    return envMap[env] || 'dev.env';
};

const envFile = getEnvFile();
config({
    path: join(process.cwd(), 'tests', 'env', envFile),
});

export const ENV = {
    APP_URL: process.env.APP_URL as string,
    BROWSER: process.env.BROWSER as string,
    RUN_MODE: process.env.RUN_MODE as string,
    GRID_URL: process.env.GRID_URL as string,
};
