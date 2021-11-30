const express = require('express');
const db = require('../models/location');
const router = express.Router();

// get location for a specific user
router.get("/:id", async (request, response) => {
    if(!request.params){
        return response.status(400).json({message: "Bad request, please provide an id for whose location you want"})
    }
    try{
        let location = await db.getLocation(request.params.id);
        return response.status(200).json(location);
    } catch(err){
        console.log(err);
        return response.status(404).json(err)
    }
});

// Add location to a user
router.post("/addLocation", async (request, response) => {
    if(!request.body){
        return response.status(400).json({message: "Bad request, please provide an id and location"});
    }
    try{
        let id = request.body.id;
        let location = request.body.location;
        
        let success = await db.createLocation(id, location);
        return response.status(201).json(success);
    } catch(e){
        console.log(e);
        return response.status(400).json(e);
    }
});

//Update the location for a user
router.put("/updateLocation", async (request, response) => {
    if(!request.body){
        return response.status(400).json({message: "Bad request, please provide an id and location"});
    }
    try{
        let id = request.body.id;
        let location = request.body.location;
        
        let success = await db.updateLocation(id, location);
        return response.status(200).json(success);
    } catch(e){
        console.log(e);
        return response.status(400).json(e);
    }
});

// Delete a users location
router.delete("/removeLocation/:id", async (request, response) => {
    if(!request.params){
        return response.status(400).json({message: "Bad request, please provide an id and location"});
    }
    try{
        let id = request.params.id;

        let success = db.deleteLocation(id);
        return response.status(200).json(success);

    } catch(e){
        console.log(e);
        response.status(400).json(e);
    }
});

module.exports = router;
