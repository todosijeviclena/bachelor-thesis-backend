const {collections} = require('../database/database')
const {ObjectId} = require('mongodb');

class EventService {
    async getAll() {
        return await collections.events.find({}).toArray()
    }

    async getById(id) {
        let wantedId = new ObjectId(id);
        return await collections.events.findOne({_id: wantedId})
    }

    async getByLocation(name) {
        return await collections.events.find({location: name}).toArray();
    }

    async getByArtist(name) {
        return await collections.events.find({artist: name}).toArray();
    }

    async getByCategory(name) {
        return await collections.events.find({category: name}).toArray();
    }

    async getByDate(date) {
        let wantedDate = new Date(date);
        return await collections.events.find({dateTime: wantedDate}).toArray();
    }

    async getToday() {
        return await collections.events.find({
            dateTime: {
                $gte: new Date(new Date().setHours(0, 0, 0, 0)),
                $lt: new Date(new Date().setHours(23, 59, 59, 999))
            }
        }).toArray();
    }

    async getTomorrow() {
        let tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        return await collections.events.find({
            dateTime: {
                $gte: new Date(tomorrow.setHours(0,0,0,0)),
                $lt: new Date(tomorrow.setHours(23,59,59,999))
            }
        }).toArray();
    }

    async getPopular() {
        return await collections.events.find({}, {sort: {dateTime: 1}, limit: 3}).toArray()
    }
    async delete(id) {
        let wantedId = new ObjectId(id);
        await collections.events.deleteOne({_id: wantedId})
    }

    async getLastOne() {
        const lastEvent = await collections.events.findOne({}, { sort: { $natural: -1 }, limit: 1 });
        return lastEvent;
    }

    async create(event) {
        await collections.events.insertOne(event);
        return await this.getLastOne();
    }

    async sendArtistNotification(artistName) {
        const notification = `Artist you follow has a new event! Go click on ${artistName} to see this upcoming event`;

        const response = await collections.users.updateMany({followedArtists: artistName}, {$push: {notifications: notification}});
        return response;
    }

    async sendVenueNotification(venueName) {
        const notification = `Venue you follow has a new event! Go click on ${venueName} to see this upcoming event`;

        const response = await collections.users.updateMany({followedLocations: venueName}, {$push: {notifications: notification}});
        return response;
    }
}

module.exports = new EventService();