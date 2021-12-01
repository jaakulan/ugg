const express = require('express');
const db = require('../models/friends');
const router = express.Router();

/* Get all friend pairs.
 */
router.get('/allFriends', async (req, res) => {
    try {
        let results = await db.all();
        res.json(results);
    } catch(err) {
        console.log(err);
        res.status(400).json({
          error: 'There was a problem retrieving all friend pairs'
        })
    }
});

/* Get all friends for a user by their email.
 */
router.get('/friend/:friendOne', async (req, res) => {
    try {
        let results = await db.friendsByUser(req.params.friendOne);
        res.json(results);
    } catch(err) {
        console.log(err);
        res.status(400).json({
          error: 'There was a problem retrieving all friends'
        })
    }
});

/* Put a friend pair.
 */
router.put('/update-friend', async(req, res) => {
    const friendOne = req.body.friendOne;
    const friendTwo = req.body.friendTwo;

    try {
      let results = await db.updateByFriendPair(friendOne, friendTwo)
      return res.status(200).json(results)
    }
    catch (err) {
      res.status(400).json({
        error: 'Friend pair does not exist'
      })
    }
});

/* Post a friend pair.
 */
router.post('/add-friend', async(req, res) => {
    if (!req.body) {
        res.status(400).send({
          message: "Content can not be empty!"
        });
      }
    const friendOne = req.body.friendOne;
    const friendTwo = req.body.friendTwo;
    
    if (friendOne == null || friendTwo == null) {
      res.status(400).json({
        error: 'Invalid friend pair'
      })
    }
    try {
      let results = await db.createFriends(friendOne, friendTwo)
      return res.status(200).json(results)
    }
    catch (err) {
      res.status(400).json({
        error: 'Friend pair already exists'
      })
    }
});

/* Delete a friend pair by inputting both friends.
*/
router.delete('/delete-friend/:friendOne/:friendTwo', async (req, res) => {
  if (!req.params) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }
    try {
        let results = await db.deleteByFriendPair(req.params.friendOne, req.params.friendTwo);
        res.json(results);
    } catch(err) {
        console.log(err);
        res.status(400).json({
          error: "Friend pair does not exist"
        })
    }
});

module.exports = router;