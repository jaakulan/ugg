const express = require('express');
const db = require('../models/descriptions');
const router = express.Router();

router.get('/allDescriptions', async (req, res, next) => {
    try {
        let results = await db.all();
        res.json(results);
    } catch(e) {
        console.log(e);
        res.sendStatus(500);
    }
});

router.get('/description/:email', async (req, res, next) => {
    try {
        let results = await db.descriptionByEmail(req.params.email);
        res.json(results);
    } catch(e) {
        console.log(e);
        res.sendStatus(500);
    }
});

/* PUT to change the description of a user
 *   email: email of user
 *   description: new description that user wants
 *
 * Example: .../api/descriptions/update-description?email=g@g.com&description=hi
 */
router.put('/update-description', async(req, res, next) => {
    const email = req.query.email;
    const description = req.query.description;
    try {
      let results = await db.updateByEmail(email, description)
      return res.status(200).json(results)
    }
    catch (err) {
      res.status(400).json({
        error: 'There was a problem processing the queried values'
      })
      throw err;
    }
});

/* POST to add a user and description to database 
 *   email: email of user
 *   description: new description that user wants
 *
 * Example: .../api/descriptions/add-description?email=f@g.com&description=hi
 */
router.post('/add-description', async(req, res, next) => {
    if (!req.body) {
        res.status(400).send({
          message: "Content can not be empty!"
        });
      }
    const email = req.query.email;
    const description = req.query.description;
    
    try {
      let results = await db.createDescription(email, description)
      return res.status(200).json(results)
    }
    catch (err) {
      res.status(400).json({
        error: 'There was a problem processing the queried values or user already exists'
      })
      throw err;
    }
});

router.delete('/delete/:email', async (req, res, next) => {
    try {
        let results = await db.deleteByEmail(req.params.email);
        res.json("deleted");
    } catch(e) {
        console.log(e);
        res.sendStatus(500);
    }
});

module.exports = router;