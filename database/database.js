const {MongoClient} = require('mongodb');
const config = require('../config')

const uri = `mongodb://${config.mongo.host}:${config.mongo.port}/${config.mongo.db}`;

let collections = {
    events: null,
    venues: null,
    artist: null,
    users: null,
};

async function initializeDatabase() {
    const client = new MongoClient(uri);
    await client.connect();
    console.log('Database connected');
    const db = client.db(config.mongo.db);
    collections.events = db.collection(config.mongo.eventCollection);
    collections.venues = db.collection(config.mongo.venueCollection);
    collections.artists = db.collection(config.mongo.artistCollection);
    collections.users = db.collection(config.mongo.usersCollection);
}

module.exports = { initializeDatabase, collections };



