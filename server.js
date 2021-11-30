const PORT = 5000;
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors")
const jwt = require('jsonwebtoken');
const authenticationRouter = require('./routes/authenticationRouter');
const descriptionRouter = require('./routes/descriptionRouter');
const imageRouter = require('./routes/imageRouter');
const locationRouter = require('./routes/locationRouter');
const gamesRouter = require('./routes/gamesRouter');
const gameStatsRouter = require("./routes/gameStatsRouter");

const app = express();

app.use(express.json());

//app.use('/api/auth', authenticationRouter);
app.use('/api/descriptions', descriptionRouter);
app.use('/api/images', imageRouter.router);
app.use('/api/location', locationRouter);
app.use('/api/games', gamesRouter);
app.use('/api/game-stats', gameStatsRouter);

app.use(express.static('static_content'));
app.use(cors());
// parse requests of content-type: application/json
app.use(bodyParser.json());

// parse requests of content-type: application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to Thomas." });
});

app.post("/register", (req, res) => {
  res.status(200).json({ message: "Thanks for registering!" });
})

app.post("/login", (req, res) => {
  res.status(200).json({ message: "Logged in!" });
})

const checkToken = (req, res, next) => {
    const header = req.headers['authorization'];

    if (typeof header !== 'undefined') {
        const bearer = header.split(' ');
        const token = bearer[1];

        jwt.verify(token, 'privatekey', (err, decoded) => {
          if (err) {
            console.log('ERROR: Could not connect to the protected route');
            return res.sendStatus(403);
          }
        });
        req.token = token;
        next();
    } else {
        //If header is undefined return Forbidden (403)
        return res.sendStatus(403);
    }
}

app.use("/test-html", express.static(__dirname + '/test-HTML'));

// set port to 3000, listen for requests
app.listen(process.env.PORT || 5000)

