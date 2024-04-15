const express = require('express');
const router = express.Router();
const userService = require('../services/user-service');
const venueService = require("../services/venue-service");
const eventService = require("../services/event-service");

router.get('/', async (req, res) => {
    //const order = req.query.order;
    const users = await userService.getAll();
    res.json(users);
})

router.get('/:id', async (req, res) => {
    const id = req.params.id
    const user = await userService.getById(id);

    if (user) {
        res.json(user);
    } else {
        res.status(404).send("Not found");
    }
})

router.get('/locations/:id', async (req, res) => {
    const id = req.params.id
    const locations = await userService.getFollowedLocations(id);

    if (locations) {
        res.json(locations);
    } else {
        res.status(404).send("Not found");
    }
})

router.get('/artists/:id', async (req, res) => {
    const id = req.params.id
    const artists = await userService.getFollowedArtists(id);

    if (artists) {
        res.json(artists);
    } else {
        res.status(404).send("Not found");
    }
})

router.get('/role/:id', async (req, res) => {
    const id = req.params.id
    const role = await userService.getUserRole(id);

    if (role) {
        res.json(role);
    } else {
        res.status(404).send("Not found");
    }
})

router.get('/notifications/:id', async (req, res) => {
    const id = req.params.id
    const notifications = await userService.getNotifications(id);

    if (notifications) {
        res.json(notifications);
    } else {
        res.status(404).send("Not found");
    }
})

router.post('/create', async (req, res) => {
    const data = req.body;

    if (
        data.name === undefined || data.name?.trim() === "" ||
        data.username === undefined || data.username?.trim() === "" ||
        data.password === undefined || data.password?.trim() === "" ||
        data.email === undefined || data.email?.trim() === ""
    ) {
        res.status(400).send("Bad input");
        return;
    } else try {
        const hashedPassword = userService.hashPassword(req.body.password);
        data.password = hashedPassword;

        const userRole = "user";
        const user = {
            name: data.name,
            username: data.username,
            password: data.password,
            email: data.email,
            role: userRole,
            followedLocations: [],
            followedArtists: [],
            notifications: []
        };
        const response = await userService.create(user);
        res.status(201).json(response);
    } catch {
        res.status(500).send();
    }
})

router.post('/login', async (req, res) => {
    const data = req.body;

    if (
        data.username === undefined || data.username?.trim() === "" ||
        data.password === undefined || data.password?.trim() === ""
    ) {
        res.status(400).send("Bad input");
        return;
    } else try {
        const hashedPassword = userService.hashPassword(data.password);
        const user = await userService.getByUsername(data.username);
        if (hashedPassword === user.password) {
            const response = {
                token: userService.generateToken(user)
            };

            res.status(201).json(response)
        } else {
            res.status(401).send("Unauthorized");
            return;
        }
    } catch {
        res.status(500).send();
    }
})

router.put('/followArtist/:id', async (req, res) => {
    const data = req.body;
    const name = data.newArtist;
    const id = req.params.id;

    const user = await userService.getById(id);
    if (!user) {
        res.status(404).send("Not found")
        return;
    }

    const response = await userService.followArtist(id, name);
    res.status(202).json(response);
})

router.put('/followVenue/:id', async (req, res) => {
    const data = req.body;
    const name = data.newVenue;
    const id = req.params.id;

    const user = await userService.getById(id);
    if (!user) {
        res.status(404).send("Not found")
        return;
    }

    const response = await userService.followVenue(id, name);
    res.status(202).json(response);
})

router.put('/unfollowArtist/:id', async (req, res) => {
    const data = req.body;
    const name = data.oldArtist;
    const id = req.params.id;

    const user = await userService.getById(id);
    if (!user) {
        res.status(404).send("Not found")
        return;
    }

    const response = await userService.unfollowArtist(id, name);
    res.status(202).json(response);
})

router.put('/unfollowVenue/:id', async (req, res) => {
    const data = req.body;
    const name = data.oldVenue;
    const id = req.params.id;

    const user = await userService.getById(id);
    if (!user) {
        res.status(404).send("Not found")
        return;
    }

    const response = await userService.unfollowVenue(id, name);
    res.status(202).json(response);
})

router.put('/deleteNotification/:id', async (req, res) => {
    const data = req.body;
    const text = data.text;
    const id = req.params.id;

    const user = await userService.getById(id);
    if (!user) {
        res.status(404).send("Not found")
        return;
    }

    const response = await userService.deleteNotification(id, text);
    res.status(202).json(response);
})
module.exports = router

