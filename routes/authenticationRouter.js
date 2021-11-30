const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../models/authentication');

router.post("/signup", async (request, response) => {
    if (!(request.body.username || request.body.password || request.body.email)) {
        return response.status(400).json({ message: "Credentials Missing" });
    }
    try {
        // pls ignore bad code I know i can just destrcute it but allow for now
        var username = request.body.username;
        var password = request.body.password;
        var email = request.body.email;
        var location = request.body.location ? request.body.location : null;
        var bio = request.body.bio ? request.body.bio : null;
        var profile_pic = request.body.profile_pic ? request.body.profile_pic : null;
        var gamecards = request.body.gamecards ? request.body.gamecards : null;
        var social_media = request.body.social_media ? request.body.social_media : null;
        let data = await db.signup(username, password, email, location, bio, profile_pic, gamecards, social_media);
        if (data == "Signed Up") {
            return response.status(201).json(data);
        }
        return response.status(400).json({message: "Not Signed Up"});
    } catch {
        console.log(err);
        return response.status(400).json(err);
    }
});

router.post("login", async (request, response) => {
    if (!(request.body.username || request.body.password)) {
        return response.status(400).json({ message: "Credentials Missing" });
    }
    try {
        // let data = await db.login(request.body.username, request.body.password);

        // if (data == "Logged in") {
        //     return response.status(201).json(data);
        // }
        // return response.status(400).json({ message: "Not Signed Up" });
        
        // Just like this for testing purposes
        var username = request.body.username;
        var password = request.body.password;
        if (username && password) {
            jwt.sign({username}, 'privatekey', {}, (err, token) => {
                if (err) {
                    console.log(err);
                }
                return response.status(200).send(token);
            })
        } else {
            console.log('ERROR: Could not log in');
        }
    } catch {
        console.log(err);
        return response.status(400).json(err);
    }
});

module.exports = router;
