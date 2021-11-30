const mysql = require('mysql');

const gamesPool = mysql.createPool({
    user: 'root',
    password: 'secret',
    database: 'games',
});

// Repersents a tuple in the database
// PRIMARY KEY - (id, game)
let gamesDatabaseTuple = function(User) {
    this.id = User.id,
    this.game = User.game,
    this.rank = User.rank,
    this.role = User.role,
    this.last_played = User.last_played;
}

gamesDatabaseTuple.getGamesInfo = (id) => {
    return new Promise((resolve, reject) => {
        gamesPool.query(
            'SELECT * FROM games WHERE id = ?', 
            id, 
            (err, res) => {
                if (err) {
                    return reject(err);
                }
                return resolve(res);
        });
    });
};

gamesDatabaseTuple.createGame = (id, game, rank, role, last_played) => {
    return new Promise((resolve, reject) => {
        const user = new gamesDatabaseTuple({id: id, game: game, rank: rank, role: role, last_played: last_played});
        gamesPool.query(
            'INSERT INTO games SET ?', 
            user, 
            (err, res) => {
                if (err) {
                    return reject(err);
                }
                return resolve("Created");
        });
    });
};

gamesDatabaseTuple.updateGame = (id, game, rank, role, last_played) => {
    return new Promise((resolve, reject) => {
        gamesPool.query(
            'UPDATE games SET rank = ?, role = ?, last_played = ? WHERE id = ?, game = ?', 
            [rank, role, last_played, id, game], 
            (err, res) => {
                if (err) {
                    return reject(err);
                }
                if (res.affectedRows == 0) {
                    return reject("Cant update non-existent game");
                }
                return resolve("Updated");
        });
    });
};

gamesDatabaseTuple.deleteGame = (id, game) => {
    return new Promise((resolve, reject) => {
        gamesPool.query(
            'DELETE FROM games WHERE id = ?, game = ?', 
            [id, game], 
            (err, res) => {
                if (err) {
                    return reject(err);
                }
                if (res.affectedRows == 0) {
                    return reject("Cant delete non-existent game");
                }
                return resolve("Deleted");
        });
    });
};

module.exports = gamesDatabaseTuple;
