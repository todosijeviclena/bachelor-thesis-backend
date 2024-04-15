const express = require('express');
const router = express.Router();
const eventService = require('../services/event-service')
router.get('/', async (req, res) => {
    //const order = req.query.order;
    const events = await eventService.getAll();
    res.json(events);
})

router.get('/:id', async (req, res) => {
    const id = req.params.id;
    const event = await eventService.getById(id);

    if (event) {
        res.json(event);
    } else {
        res.status(404).send("Not found");
    }
})

router.get('/location/:name', async (req, res) => {
    const name = req.params.name;
    const events = await eventService.getByLocation(name);

    if (events.length > 0) {
        res.json(events);
    } else {
        res.status(404).send("Not found");
    }
})

router.get('/artist/:name', async (req, res) => {
    const name = req.params.name;
    const events = await eventService.getByArtist(name);

    if (events.length > 0) {
        res.json(events);
    } else {
        res.status(404).send("Not found");
    }
})

router.get('/category/:name', async (req, res) => {
    const name = req.params.name;
    const events = await eventService.getByCategory(name);

    if (events.length > 0) {
        res.json(events);
    } else {
        res.status(404).send("Not found");
    }
})

router.get('/date/:date', async (req, res) => {
    const date = req.params.date;
    const events = await eventService.getByDate(date);

    if (events.length > 0) {
        res.json(events);
    } else {
        res.status(404).send("Not found");
    }
})

router.get('/today/events/', async (req, res) => {
    const events = await eventService.getToday();

    if (events.length > 0) {
        res.json(events);
    } else {
        res.status(404).send("Not found");
    }
})

router.get('/tomorrow/events/', async (req, res) => {
    const events = await eventService.getTomorrow();

    if (events.length > 0) {
        res.json(events);
    } else {
        res.status(404).send("Not found");
    }
})

router.get('/popular/top', async (req, res) => {
    const events = await eventService.getPopular();
    res.json(events);
})

router.get('/last/added', async (req, res) => {
    const event = await eventService.getLastOne();
    res.json(event);
})

router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    await eventService.delete(id);
    res.status(204).send("NO content");
})

router.post('/create', async (req, res) => {
    const data = req.body;

    if (
        data.name === undefined || data.name?.trim() === "" ||
        data.description === undefined || data.description?.trim() === "" ||
        data.img === undefined || data.img?.trim() === "" ||
        data.category === undefined || data.category?.trim() === "" ||
        data.price === undefined || data.price.standard === undefined || data.price.standard === null ||
        data.location === undefined || data.location?.trim() === "" ||
        data.dateTime === undefined || data.dateTime?.trim() === ""
    ) {
        res.status(400).send("Bad input");
        return;
    }

    const eventDate = new Date(data.dateTime);
    const event = {
        name: data.name,
        description: data.description,
        img: data.img,
        category: data.category,
        capacity: data.capacity,
        price: data.price,
        dateTime: eventDate,
        duration: data.duration,
        location: data.location,
        artist: data.artist
    };

    const response = await eventService.create(event);

    const artistNotification = await eventService.sendArtistNotification(event.artist);
    if (!artistNotification) {
        console.log("No notifications about artist were send")
    }

    const venueNotification = await eventService.sendVenueNotification(event.location);
    if (!venueNotification) {
        console.log("No notifications about venue were send")
    }

    res.status(201).json(response);
})

module.exports = router;