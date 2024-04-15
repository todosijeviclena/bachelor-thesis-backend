const {collections} = require('../database/database');
const {ObjectId} = require('mongodb');
const {passwordConfig, jwtConfig} = require('../config');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

class UserService {
    async getAll() {
        return await collections.users.find({}).toArray()
    }

    async getById(id) {
        let wantedId = new ObjectId(id);
        return await collections.users.findOne({_id: wantedId});
    }

    async getUserRole(id) {
        let wantedId = new ObjectId(id);
        return await collections.users.findOne({_id: wantedId}, {role: 1, _id: 0});
    }

    generateToken(user) {
        const tokenPayload = {
            username: user.username,
            role: user.role,
            id: user._id,
            name: user.name
        };
        return jwt.sign(
            tokenPayload,
            jwtConfig.secret,
            {
                algorithm: jwtConfig.algorithms[0]
            }
        );
    }

    hashPassword(password) {
        return crypto.pbkdf2Sync(
            password,
            passwordConfig.salt,
            passwordConfig.iterations,
            passwordConfig.keylen,
            passwordConfig.digest
        ).toString(`hex`);
    }

    async create(user) {
        await collections.users.insertOne(user);
        return await this.getLastOne();
    }

    async getByUsername (username) {
        return await collections.users.findOne({username: username});
    }

    async getLastOne() {
        const lastUser = await collections.users.findOne({}, { sort: { $natural: -1 }, limit: 1 });
        return lastUser;
    }

    async getFollowedLocations(id) {
        let wantedId = new ObjectId(id);
        const user =  await collections.users.findOne({_id: wantedId});
        return user.followedLocations;
    }

    async getFollowedArtists(id) {
        let wantedId = new ObjectId(id);
        const user =  await collections.users.findOne({_id: wantedId});
        return user.followedArtists;
    }

    async getNotifications(id) {
        let wantedId = new ObjectId(id);
        const user =  await collections.users.findOne({_id: wantedId});
        return user.notifications;
    }

    async followArtist(userId, artistName) {
        let wantedId = new ObjectId(userId);
        return await collections.users.updateOne({_id: wantedId}, {$push: {followedArtists: artistName}});
    }

    async followVenue(userId, venueName) {
        let wantedId = new ObjectId(userId);
        return await collections.users.updateOne({_id: wantedId}, {$push: {followedLocations: venueName}});
    }

    async unfollowArtist(userId, artistName) {
        let wantedId = new ObjectId(userId);
        return await collections.users.updateOne({_id: wantedId}, {$pull: {followedArtists: artistName}});
    }

    async unfollowVenue(userId, venueName) {
        let wantedId = new ObjectId(userId);
        return await collections.users.updateOne({_id: wantedId}, {$pull: {followedLocations: venueName}});
    }

    async deleteNotification(userId, text) {
        let wantedId = new ObjectId(userId);
        return await collections.users.updateOne({_id: wantedId}, {$pull: {notifications: text}});
    }
}

module.exports = new  UserService();