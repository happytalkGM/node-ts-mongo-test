import { MongoClient, ObjectId } from 'mongodb';
import { config } from './config';

const client = new MongoClient(
    `${config.MONGODB.SCHEME}://${config.MONGODB.HOST}:${config.MONGODB.PORT}`,
    {
        authSource: config.MONGODB.AUTH_DATABASE,
        auth: {
            username: config.MONGODB.USER,
            password: config.MONGODB.PASSWORD,
        },
        minPoolSize: config.MONGODB.MIN_POOL_SIZE,
        maxPoolSize: config.MONGODB.MAX_POOL_SIZE,
    },
);
const collection = client.db(config.MONGODB.DATABASE).collection(config.SEARCH.COLLECTION);

async function findById(i: number) {
    const start = new Date().getTime();
    const result = await collection.findOne({_id: new ObjectId(config.SEARCH.DOCUMENT_ID)});
    console.log(`[${i}] findById (${result?._id.toString()}) - complete: ${(new Date().getTime()) - start}ms`);

    return result;
}

(async() => {
    console.log('start');

    await client.connect();

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
    await client.close();
});