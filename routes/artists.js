const express = require('express');
const router = express.Router();
const artistService = require('../services/artist-service')

router.get('/', async (req, res) => {
    //const order = req.query.order;
    const artists = await artistService.getAll();
    res.json(artists);
})

router.get('/:id', async (req, res) => {
    const id = req.params.id
    const artist = await artistService.getById(id);

    if (artist !== undefined) {
        res.json(artist);
    } else {
        res.status(404).send("Not found");
    }
})

router.get('/name/:name', async (req, res) => {
    const name = req.params.name;
    const artist = await artistService.getByName(name);

    if (artist) {
        res.json(artist);
    } else {
        res.status(404).send("Not found");
    }
})

router.post('/create', async (req, res) => {
    const data = req.body;

    if (
        data.name === undefined || data.name?.trim() === "" ||
        data.info === undefined || data.info?.trim() === "" ||
        data.img === undefined || data.img?.trim() === "" ||
        data.genre === undefined
    ) {
        res.status(400).send("Bad input");
        return;
    }

    const artist = await artistService.create(data);
    res.status(201).json(artist);
})

router.delete('/:id', async (req, res) => {
    const id = parseInt(req.params.id)
    await artistService.delete(id);
    res.status(204).send("No content");
})

module.exports = router;