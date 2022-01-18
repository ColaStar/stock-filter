// https://docs.mongodb.com/drivers/node/current/fundamentals/connection/

// mongod --dbpath=/Users/manble/dev/db/mongo/stock --logpath=/Users/manble/dev/db/mongo/log/stock.log --logappend --fork

'use strict';

const { MongoClient } = require('mongodb');

const CONFIG = {
    dbs: {
        stock: {
            uri: 'mongodb://127.0.0.1?maxPoolSize=100',
            collections: []
        }
    }
};

const run = async (dbName, cb) => {
    const client = new MongoClient(CONFIG.dbs[dbName].uri);
    try {
        await client.connect();
        const database = client.db(dbName);
        await cb(database);
    } catch (err) {
        throw err;
    }
    finally {
        await client.close();
    }
};

const createActions = (collectionName, dbName = 'stock') => {
    const create = (method, arg) => new Promise(async (resolve, reject) => {
        run(dbName, async db => {
            const result = await db.collection(collectionName)[method](...arg);
            resolve(result);
        }).catch(err => {
            console.error(`mongo:error:collectionName:-----------${collectionName}------------------`);
            reject(err);
        });
    });

    return {
        findOne: async (query = {}, options = { projection: { _id: 0 } }) => {
            return create('findOne', [query, options]);
        },
        findMany: async (query = {}, options = { projection: { _id: 0 } }) => {
            return new Promise(async (resolve, reject) => {
                run(dbName, async db => {
                    let result = await db.collection(collectionName).find(query, options);
                    result = await result.toArray();
                    resolve(result);
                }).catch(err => reject(err));
            })
        },
        insertOne: (doc) => {
            return create('insertOne', [doc]);
        },
        insertMany: (docs) => {
            return create('insertMany', [docs]);
        },
        updateOne: (filter, updateDoc, options = {}) => {
            return create('updateOne', [filter, updateDoc, options]);
        },
        updateMany: (filter, updateDoc, options = {}) => {
            return create('updateMany', [filter, updateDoc, options]);
        },
        replaceOne: (query, replacement) => {
            return create('replaceOne', [filter, updateDoc, options]);
        },
        deleteOne: (query) => {
            return create('deleteOne', [query]);
        },
        deleteMany: (query) => {
            return create('deleteMany', [query]);
        },
    }
};

module.exports = {
    createActions
};