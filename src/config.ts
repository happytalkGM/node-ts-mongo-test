import 'dotenv/config';
import * as process from "node:process";

export const config = {
    CONCURRENT_TASK: parseInt(process.env.CONCURRENT_TASK ?? '10', 10),
    SEARCH: {
        COLLECTION: process.env.COLLECTION ?? '',
        DOCUMENT_ID: process.env.DOCUMENT_ID ?? '',
    },
    MONGODB: {
        SCHEME: process.env.MONGODB_SCHEME ?? 'mongodb',
        HOST: process.env.MONGODB_HOST ?? '127.0.0.1',
        PORT: parseInt(process.env.MONGODB_PORT ?? '27017', 10),
        USER: process.env.MONGODB_USER ?? '',
        PASSWORD: process.env.MONGODB_PASSWORD ?? '',
        DATABASE: process.env.MONGODB_DATABASE ?? '',
        AUTH_DATABASE: process.env.MONGODB_AUTH_DATABASE ?? '',
        MIN_POOL_SIZE: parseInt(process.env.MONGODB_MIN_POOL_SIZE ?? '10', 10),
        MAX_POOL_SIZE: parseInt(process.env.MONGODB_MAX_POOL_SIZE ?? '10', 10),
    },
};
