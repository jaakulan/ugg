const express = require('express');
const multer = require('multer')
const profileImageLocation = './uploads/profile_images/';
const backgroundImageLocation = './uploads/background_images/';
const profileUpload = multer({ dest: profileImageLocation })
const backgroundUpload = multer({ dest: backgroundImageLocation })
const router = express.Router();

const image = require("../controllers/image.controller");



router.post('/:username/profile-image', profileUpload.single('profile_image'), image.postProfileImage);
router.get('/:username/profile-image', image.getProfileImage);
router.delete('/:username/profile-image', image.deleteProfileImage);

router.post('/:username/background-image', backgroundUpload.single('background_image'), image.postBackgroundImage);
router.get('/:username/background-image', image.getBackgroundImage);
router.delete('/:username/background-image', image.deleteBackgroundImage);



module.exports.router = router;
module.exports.backgroundImageLocation = backgroundImageLocation;
module.exports.profileImageLocation = profileImageLocation;