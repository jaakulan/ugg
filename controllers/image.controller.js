const fs = require("fs");
const imageRouter = require("../routes/imageRouter");
const path = require('path');
const fileType = require('file-type');
const fileTypes = ['jpg', 'jpeg', 'png']

exports.postProfileImage = async (req, res) => {
    return addImage(req, res, "profile");
};

exports.postBackgroundImage = async (req, res) => {
    return addImage(req, res, "background");
};

addImage = async (req, res, reqType) => {
    const filename = req.file.filename;
    const username = req.params.username;
    let oldLocation;
    let newLocation;
    if (reqType === "profile") {
        newLocation = imageRouter.profileImageLocation + username;
        oldLocation = imageRouter.profileImageLocation + filename;
    } else {
        newLocation = imageRouter.backgroundImageLocation + username;
        oldLocation = imageRouter.backgroundImageLocation + filename;
    }
    try {
        const ext = (await fileType.fromFile(oldLocation).catch()).ext;
        console.log(ext);
        if (!(fileTypes.includes(ext))) {
            fs.unlink(oldLocation, (err) => {
                if (err) throw err;
                console.log('successfully deleted ' + oldLocation);
            });
            res.status(422).json({
                error: 'Only PNG and JPEG File types are accepted'
            });
            return;
        }
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
        return;
    }

    try {
        fs.rename(oldLocation, newLocation, (err) => {
            if (err) {
                throw err;
            }
        });
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
    res.sendStatus(200);


};


exports.getProfileImage = (req, res) => {

    return getImage(req, res, "profile");
};

exports.getBackgroundImage = (req, res) => {

    return getImage(req, res, "background");
};

getImage = (req, res, reqType) => {

    const username = req.params.username;
    let location;
    if (reqType === "profile") {
        location = path.resolve(imageRouter.profileImageLocation + username);
    } else {
        location = path.resolve(imageRouter.backgroundImageLocation + username);
    }
    console.log(location);
    try {
        if (fs.existsSync(location)) {
            res.status(200).download(location, username);
        } else {
            res.status(404).json({
                error: 'Image not found for user'
            })
        }
    } catch (err) {
        console.error(err)
        res.sendStatus(500);
    }
};



exports.deleteProfileImage = (req, res) => {

    return deleteImage(req, res, "profile");
};

exports.deleteBackgroundImage = (req, res) => {

    return deleteImage(req, res, "background");
};

deleteImage = (req, res, reqType) => {

    const username = req.params.username;
    let location;
    if (reqType === "profile") {
        location = path.resolve(imageRouter.profileImageLocation + username);
    } else {
        location = path.resolve(imageRouter.backgroundImageLocation + username);
    }
    console.log(location);
    try {
        if (fs.existsSync(location)) {
            fs.unlink(location, (err) => {
                if (err) throw err;
                console.log('successfully deleted ' + location);
            });
            res.sendStatus(200);
        } else {
            res.status(404).json({
                error: 'Image not found for user'
            });

        }
    } catch (err) {
        console.error(err)
        res.sendStatus(500);
    }
};
