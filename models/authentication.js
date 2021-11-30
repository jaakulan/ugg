const mysql = require('mysql');

const authPool = mysql.createPool({
    user: 'root',
    password: 'secret',
    database: 'games',
});

// Repersents a tuple in the database
let authDatabaseTuple = function(User) {
    this.username = User.username;
    this.password = User.password;
    this.email = User.email;
    this.location = User.location;
    this.bio = User.bio;
    this.profile_pic = User.profile_pic;
    this.gamecards = User.gamecards;
    this.social_media = User.social_media;
}

authDatabaseTuple.signup = (username, password, email, location, bio, profile_pic, gamecards, social_media) => {
    return new Promise((resolve, reject) => {
        authPool.query(
            'INSERT INTO users SET username = ?, password = ?, email = ?, location = ?, bio = ?, profile_pic = ?, gamecards = ?, social_media = ?',
            [username, password, email, location, bio, profile_pic, gamecards, social_media],
            (err, res) => {
                if (err) {
                    return reject(err);
                }
                if (res.affectedRows == 0) {
                    return reject("Reasource does not exist");
                }
                return resolve("Signed Up");
            });
    });
};


module.exports = authPool;
