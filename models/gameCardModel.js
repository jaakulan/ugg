const mysql = require("mysql");

const gameCardPool = mysql.createPool({
    password: '1234',
    user: 'root',
    database: 'gamecards'
});


const GameCard = (GameCard) => {
    this.username = GameCard.username,
    this.game = GameCard.game,
    this.gameid = GameCard.gameid, // in game name
    this.platform = GameCard.platform
}

GameCard.createGameCard = (username, game, gameid, platform) => {
    return new Promise((resolve, reject) => {
        const GameCard = { username: username, game: game, gameid: gameid, platform: platform };
        const newGameCard = new GameCard(GameCard);

        gameCardPool.query("INSERT INTO gamecards SET ?", newGameCard,
            (err, res) => {
                if (err) {
                    console.log("error: ", err);
                    return reject(err);
                }
                return resolve("added");
            });
    });
}

// get gamecard for user for the specified game
GameCard.getCameCard = (username, game) => {
    return new Promise((resolve, reject) => {
        gameCardPool.query("SELECT * FROM gamecards WHERE username = ? AND game = ?", [username, game],
            (err, res) => {
                if (err) {
                    console.log("error: ", err);
                    return reject(err);
                }
                // check if the result is not empty
                if (res.length != 0) {
                    return resolve(res); // might be res[0]
                }
                // at this point 
                return reject("no gamecard exists for user " + username + " for the game " + game);
            });
    });
}

GameCard.updateGameCard = (username, game, gameid, platform) => {
    return new Promise((resolve, reject) => {
        gameCardPool.query("UPDATE gamecards SET gameid = ? AND platform = ? WHERE username = ? AND game = ? ", [gameid, platform, username, game],
            (err, res) => {
                if (err) {
                    console.log("error: ", err);
                    return reject(err);
                }

                if (res.affectedRows == 0) {
                    return reject("Cant update non-existent location");
                }

                return resolve("updated");

            });
    });
}

GameCard.deleteGameCard = (username, game) => {
    return new Promise((resolve, reject) => {
        locationPool.query("DELETE FROM gamecards WHERE username = ? AND game = ?", [username, game], (err, res),
            (err, res) => {
                if (err) {
                    console.log("error: ", err);
                    return reject(err);
                }
                // cant delete location that doesnt exist
                if (res.affectedRows == 0) {
                    return reject("Cant delete non-existent game");
                }
                return resolve("deleted")
            });
    });
}

module.exports = GameCard;