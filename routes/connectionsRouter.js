// Reference: https://www.bezkoder.com/node-js-rest-api-express-mysql/
const express = require('express');
const db = require('../models/connections');
const router = express.Router();

/* Get all connections.
 */
router.get('/connections', async (req, res) => {
    try {
        let results = await db.getAll();
        res.json(results);
    } catch(err) {
        console.log(err);
        res.status(400).json({
          error: 'There was a problem retrieving all connections'
        })
    }
});

/* Get all connections for a user by their email.
 */
router.get('/connections/:email', async (req, res) => {
  if (!(req.params)) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }
    try {
        let results = await db.findByEmail(req.params.email);
        res.status(200).json(results);
    } catch(err) {
        console.log(err);
        res.status(400).json({
          error: err
        })
    }
    
});

/* Put a connection by email, socialmedia and username.
 */
router.put('/update-connection/:socialMedia/:email/:username', async(req, res) => {
  if (!req.body || !(req.params)) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

    try {
      const email = req.params.email;
      const socialMedia = req.params.socialMedia;
      const username = req.params.username;
  
      if (socialMedia == null) {
        socialMedia = '';
      }
      let results = await db.updateByEmail(email, socialMedia, username)
      return res.status(200).json(results)
    }
    catch (err) {
      res.status(400).json({
        error: 'There was a problem processing the queried values'
      })
    }
});

/* Post a connection.
 */
router.post('/add-connection/:socialMedia/:email/:username', async(req, res) => {
    if (!req.body || !(req.params)) {
        res.status(400).send({
          message: "Content can not be empty!"
        });
      }


    try {
      const email = req.params.email;
      const socialMedia = req.params.socialMedia;
      const username = req.params.username;
  
      if (socialMedia == null) {
        socialMedia = '';
      }
      let results = await db.create(socialMedia, username, email)
      return res.status(200).json(results)
    }
    catch (err) {
      res.status(400).json({
        error: 'There was a problem processing the queried values. Connection may already exist or not enough parameters.'
      })
    }
});


/* Delete a connection by inputting both email and social media.
*/
router.delete('/delete-connection/:socialMedia/:email/:username', async (req, res) => {
  if (!(req.params)) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }
    try {
      const email = req.params.email;
      const socialMedia = req.params.socialMedia;
      const username = req.params.username;
    
      if (socialMedia == null) {
        socialMedia = '';
      }
      let results = await db.remove(email, socialMedia, username);
      res.status(200).json(results);
    } catch(err) {
        console.log(err);
        res.status(400).json({
          error: err
        })
    }
});

module.exports = router;