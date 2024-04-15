const {collections} = require('../database/database')
const {ObjectId} = require('mongodb')
class ArtistService {
    async getAll() {
        return await collections.artists.find({}).toArray()
    }

    async getById(id) {
        let wantedId = new ObjectId(id);
        return await collections.artists.findOne({_id: wantedId});
    }

    async getByName(name) {
        return await collections.artists.findOne({name: name});
    }


    async create(artist) {
        await collections.artists.insertOne(artist);
        return await this.getLastOne();
    }

    async delete(id) {
        let wantedId = new ObjectId(id);
        await collections.artists.deleteOne(wantedId)
    }

    async getLastOne() {
        const lastArtist = await collections.artists.findOne({}, { sort: { $natural: -1 }, limit: 1 });
        return lastArtist;
    }
}

module.exports = new ArtistService();