const express = require('express');
const router = express.Router();
const db = require('../models/games');

router.get("/:id", async (request, response) => {
    if (!(request.params)) {
        return response.status(400).json({ message: "Bad request, please provide an user id for whose games info you want" });
    }
    try {
        let data = await db.getGamesInfo(request.params.id);
        return response.status(200).json(data);
    } catch (err) {
        console.log(err);
        return response.status(404).json(err);
    }
});

router.post("/add-game/:id", async (request, response) => {
    if (!(request.body) || !(request.params)) {
        return response.status(400).json({ message: "Bad request, please provide a body" });
    }
    try {
        let game = request.body.game;
        let rank = request.body.rank;
        let role = request.body.role;
        let last_played = request.body.last_played;
        // ensure (id, game) primary key tuple does not exist
        let data = await db.createGame(request.params.id, game, rank, role, last_played);
        return response.status(201).json(data);
    } catch (err) {
        console.log(err);
        return response.status(400).json(err);
    }
});

router.put("/update-game/:id/:game", async (request, response) => {
    if (!(request.body) || !(request.params)) {
        return response.status(400).json({ message: "Bad request, please provide a body" });
    }
    try {
        let last_played = request.body.last_played;
        let rank = request.body.rank;
        let role = request.body.role;
        let data = await db.updateGame(request.params.id, request.params.game, last_played, rank, role);
        return response.status(200).json(data);
    } catch (err) {
        console.log(err);
        return response.status(400).json(err);
    }
});

router.delete("/delete-game/:id/:game", async (request, response) => {
    if (!(request.params)) {
        return response.status(400).json({ message: "Bad request, please provide a body" });
    }
    try {
        let data = await db.deleteGame(request.params.id, request.params.game);
        return response.status(200).json(data);
    } catch (err) {
        console.log(err);
        return response.status(400).json(err);
    }
});

module.exports = router;
