const express = require('express');
const db = require('../models/friends');
const router = express.Router();

/* Get all friend pairs.
 */
router.get('/allFriends', async (req, res, next) => {
    try {
        let results = await db.all();
        res.json(results);
    } catch(err) {
        console.log(err);
        res.status(400).json({
          error: 'There was a problem retrieving all friend pairs'
        })
        throw err;
    }
});

/* Get all friends for a user by their email.
 */
router.get('/friend/:friendOne', async (req, res, next) => {
    try {
        let results = await db.friendsByUser(req.params.friendOne);
        res.json(results);
    } catch(err) {
        console.log(err);
        res.status(400).json({
          error: 'There was a problem retrieving all friends'
        })
        throw err;
    }
});

/* Put a friend pair.
 */
router.put('/update-friend', async(req, res, next) => {
    const friendOne = req.body.friendOne;
    const friendTwo = req.body.friendTwo;
    try {
      let results = await db.updateByFriendPair(friendOne, friendTwo)
      return res.status(200).json(results)
    }
    catch (err) {
      res.status(400).json({
        error: 'There was a problem processing the queried values'
      })
      throw err;
    }
});

/* Post a friend pair.
 */
router.post('/add-friend', async(req, res, next) => {
    if (!req.body) {
        res.status(400).send({
          message: "Content can not be empty!"
        });
      }
    const friendOne = req.body.friendOne;
    const friendTwo = req.body.friendTwo;


    try {
      let results = await db.createFriends(friendOne, friendTwo)
      return res.status(200).json(results)
    }
    catch (err) {
      res.status(400).json({
        error: 'There was a problem processing the queried values or user already exists'
      })
      throw err;
    }
});

/* Delete a friend pair by inputting both friends.
*/
router.delete('/delete-friend', async (req, res, next) => {
    try {
        let results = await db.deleteByFriendPair(req.body.friendOne, req.body.friendTwo);
        res.json("deleted");
    } catch(err) {
        console.log(err);
        res.status(400).json({
          error: 'There was a problem deleting friend pair'
        })
        throw err;
    }
});

module.exports = router;