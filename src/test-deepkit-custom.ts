import { Database } from '@deepkit/orm';
import {MongoConnection, MongoDatabaseAdapter} from './lib/deepkit-mongo';
import { entity, MongoId, PrimaryKey } from '@deepkit/type';
import { config } from './config';

@(entity.name('TestDocument').collection(config.SEARCH.COLLECTION).excludeMigration())
class TestDocument {
    _id: MongoId & PrimaryKey = '';

    constructor(public name: string) {
    }
}

function getConnectionString() {
    const auth = (config.MONGODB.USER !== '' && config.MONGODB.PASSWORD !== '') ? `${config.MONGODB.USER}:${config.MONGODB.PASSWORD}@` : '';
    const options: string[] = [];

    if (auth !== '' && config.MONGODB.AUTH_DATABASE !== '') {
        options.push(`authSource=${config.MONGODB.AUTH_DATABASE}`);
    }

    if (config.MONGODB.MIN_POOL_SIZE) {
        options.push(`minPoolSize=${config.MONGODB.MIN_POOL_SIZE}`);
    }

    if (config.MONGODB.MAX_POOL_SIZE) {
        options.push(`maxPoolSize=${config.MONGODB.MAX_POOL_SIZE}`);
    }

    return [
        `${config.MONGODB.SCHEME}://`,
        auth,
        `${config.MONGODB.HOST}:${config.MONGODB.PORT}`,
        config.MONGODB.DATABASE !== '' ? `/${config.MONGODB.DATABASE}` : '',
        options.length ? `?${options.join('&')}` : '',
    ].join('');
}

const db = new Database(new MongoDatabaseAdapter(getConnectionString()), [TestDocument]);

async function initializeMinPool(minPoolSize: number) {
    const connectionPromises: Promise<MongoConnection>[] = [];

    for (let i=0; i < minPoolSize; i++) {
        connectionPromises.push(db.adapter.client.connectionPool.getConnection());
    }
    const connections = await Promise.all(connectionPromises);
    connections.forEach((conn) => {
        conn.release();
    });
}

(async() => {
    console.log('start');

    await initializeMinPool(config.MONGODB.MIN_POOL_SIZE);

    console.log(`connection count: ${db.adapter.client.connectionPool.connections.length}`);

    async function findById(i: number) {
        const start = new Date().getTime();
        const result = await db.query(TestDocument).filter({_id: config.SEARCH.DOCUMENT_ID}).findOne();
        console.log(`[${i}] findById (${result?._id.toString()}) - complete: ${(new Date().getTime()) - start}ms`);

        return result;
    }

    const start = new Date().getTime();
    const promises: any = [];

    for (let i=0; i < config.CONCURRENT_TASK; i++) {
        promises.push(findById(i));
    }
    await Promise.all(promises);
    console.log(`TOTAL: ${(new Date().getTime()) - start}ms`);
})().catch((e) => {
    console.error('----------------------- error -----------------------');
    console.error(e);
    console.error('-----------------------------------------------------');
}).finally(async () => {
    console.log('completed');
    db.disconnect();
});