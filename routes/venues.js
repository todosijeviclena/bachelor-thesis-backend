const express = require('express');
const router = express.Router();
const venueService = require('../services/venue-service')
router.get('/', async (req, res) => {
    //const order = req.query.order;
    const venues = await venueService.getAll();
    res.json(venues);
})

router.get('/:id', async (req, res) => {
    const id = req.params.id
    const venue = await venueService.getById(id);

    if (venue) {
        res.json(venue);
    } else {
        res.status(404).send("Not found");
    }
})

router.get('/name/:name', async (req, res) => {
    const name = req.params.name;
    const venue = await venueService.getByName(name);

    if (venue) {
        res.json(venue);
    } else {
        res.status(404).send("Not found");
    }
})

router.get('/category/:name', async (req, res) => {
    const name = req.params.name;
    const venues = await venueService.getByCategory(name);

    if (venues.length > 0) {
        res.json(venues);
    } else {
        res.status(404).send("Not found");
    }
})
router.post('/create', async (req, res) => {
    const data = req.body;

    if (
        data.name === undefined || data.name?.trim() === "" ||
        data.description === undefined || data.description?.trim() === "" ||
        data.img === undefined || data.img?.trim() === "" ||
        data.category === undefined || data.category?.trim() === "" ||
        data.address === undefined ||
        data.info === undefined
    ) {
        res.status(400).send("Bad input");
        return;
    }

    const venue = await venueService.create(data);
    res.status(201).json(venue);
})

router.delete('/:id', async (req, res) => {
    const id = parseInt(req.params.id)
    await venueService.delete(id);
    res.status(204).send("NO content");
})

module.exports = router;