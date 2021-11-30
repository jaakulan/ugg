const express = require('express');
const router = express.Router();
const apexApi = require("../models/apexStatsModel");
const fortniteApi = require("../models/fortniteStatsModel");
const overwatchApi = require("../models/overwatchModel");


router.get("/apex/:id/:platform", async (request, response) => {
    if(!request.params){
        return response.status(400).json({message: "Bad request, please provide an apex usersname and the platform which they play on"});
    }
    try{
        let stats = await apexApi.getStats(request.params.id, request.params.platform);
        return response.status(200).json(JSON.parse(stats));
    } catch(err) {
        console.log(err);
        return response.status(404).json(err);
    }
});

router.get("/fortnite/:id", async (request, response) => {
    if(!request.params){
        return response.status(400).json({message: "Bad request, please provide a fortnite usersname"});
    }
    try{
        let stats = await fortniteApi.getStats(request.params.id);
        return response.status(200).json(JSON.parse(stats));
    } catch(err) {
        console.log(err);
        return response.status(404).json(err);
    }
})

router.get("/overwatch/:id/:platform", async (request, response) => {
    if(!request.params){
        return response.status(400).json({message: "Bad request, please provide a battle-net usersname along with the 4 digits and platform"});
    }
    try{
        let stats = await overwatchApi.getStats(request.params.id, request.params.platform);
        return response.status(200).json(JSON.parse(stats));
    } catch(err) {
        console.log(err);
        return response.status(404).json(err);
    }
})

module.exports = router;