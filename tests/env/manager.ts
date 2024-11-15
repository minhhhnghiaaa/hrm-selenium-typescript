import { config } from 'dotenv';
import { join } from 'path';

const getEnvFile = () => {
    const env = process.env.NODE_ENV || 'development';
    const envMap: Record<string, string> = {
        development: 'dev.env',
        stage: 'stage.env',
        production: 'prod.env',
    };

    return envMap[env] || 'dev.env';
};

// Load base .env first
config({ path: join(process.cwd(), '.env') });

// Load environment specific variables
const envFile = getEnvFile();
config({
    path: join(process.cwd(), 'tests', 'env', envFile),
});

export const ENV = {
    APP_URL: process.env.APP_URL || '',
    BROWSER: process.env.BROWSER || 'chrome',
    RUN_MODE: process.env.RUN_MODE || 'local',
    GRID_URL: process.env.GRID_URL || '',
};
