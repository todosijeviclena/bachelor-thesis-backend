const {collections} = require('../database/database')
const {ObjectId} = require('mongodb')
class VenueService {
    async getAll() {
        return await collections.venues.find({}).toArray()
    }

    async getById(id) {
        let wantedId = new ObjectId(id);
        return await collections.venues.findOne({_id: wantedId});
    }

    async getByName(name) {
        return await collections.venues.findOne({name: name});
    }

    async getByCategory(name) {
        return await collections.venues.find({category: name}).toArray();
    }

    async create(venue) {
        await collections.venues.insertOne(venue);
        return await this.getLastOne();
    }

    async delete(id) {
        let wantedId = new ObjectId(id);
        await collections.venues.deleteOne(wantedId)
    }

    async getLastOne() {
        const lastVenue = await collections.venues.findOne({}, { sort: { $natural: -1 }, limit: 1 });
        return lastVenue;
    }
}

module.exports = new VenueService();