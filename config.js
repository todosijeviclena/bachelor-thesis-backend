require('dotenv').config();

module.exports = {
    mongo: {
        host: process.env.MONGO_HOST || '127.0.0.1',
        port: process.env.MONGO_PORT || 27017,
        db: process.env.MONGO_DB || 'bachelor_thesis',
        eventCollection: process.env.MONGO_COLLECTION || 'events',
        venueCollection: process.env.MONGO_COLLECTION || 'venues',
        artistCollection: process.env.MONGO_COLLECTION || 'artists',
        usersCollection: process.env.MONGO_COLLECTION || 'users',
        username: process.env.MONGO_USERNAME || null,
        password: process.env.MONGO_PASSWORD || null,
    },

    allowedFrontendOrigin: 'http://localhost:3001',

    jwtConfig: {
        secret: 'viv99vfd9vdf09',
        algorithms: ['HS256']
    },

    passwordConfig: {
        salt: 'faacdcojirj90990',
        iterations: 1000,
        keylen: 64,
        digest: 'sha512',
    },
};