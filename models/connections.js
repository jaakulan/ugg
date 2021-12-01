// Reference: https://www.bezkoder.com/node-js-rest-api-express-mysql/
const mysql = require('mysql');
const config = require('../config.json');

const connectionsPool = mysql.createPool({
    password: config['db-password'],
    user: config['db-username'],
    database: 'UG',
    host: config['db-connection-string'],
    port: '3306'
});

let Connection = function(User) {
  this.socialMedia = User.socialMedia; // social media
  this.username = User.username; // username
  this.email = User.email; // email
};

Connection.create = (newSocialMedia, newUsername, newEmail) => {
  return new Promise((resolve, reject) => {
    const user = new Connection({socialMedia: newSocialMedia, username: newUsername, email: newEmail});
    connectionsPool.query("INSERT INTO connections SET ?", user, (err, res) => {
      if (err) {
        console.log("error: ", err);
        return reject(err);
      }

      return resolve(res);
    });
  });
};

Connection.findByEmail = (email) => {
  return new Promise((resolve, reject) => {
    connectionsPool.query("SELECT * FROM connections WHERE email = ?", email, (err, res) => {
      if (err) {
        console.log("error: ", err);
        return reject(err);
      }

      if (res.length) {
        console.log("found connection: ", res[0]);
        return resolve(res);
      }
      // not found Connection with the id
      console.log("not found");
      return reject("No connections found with email " + email);

    });
  });
};

Connection.getAll = () => {
  return new Promise((resolve, reject) => {
  connectionsPool.query("SELECT * FROM connections", (err, res) => {
      if (err) {
        console.log("error: ", err);
        return reject(err);
      }

      console.log("connections: ", res);
      return resolve(res);
    });
  });
};

Connection.updateByEmail = (email, socialMedia, username) => {
  return new Promise((resolve, reject) => {
    connectionsPool.query(
      "UPDATE connections SET socialMedia = ?, email = ?, username = ?",
      [socialMedia, email, username],
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          return reject(err);
        }

        if (res.affectedRows == 0) {
          // not found Connection with the id
          return "not found";
        }
        return resolve(res);
      }
    );
  });
};

Connection.remove = (email, socialMedia, username) => {
  return new Promise((resolve, reject) => {
    connectionsPool.query("DELETE FROM connections WHERE socialMedia = ? AND email = ? AND username = ?", [socialMedia, email, username], (err, res) => {
      if (err) {
        console.log("error: ", err);
        return reject(err);
      }

      if (res.affectedRows == 0) {
        // not found Connection with the email
        return reject("Cannot delete non-existent connection");
      }

      console.log("deleted connection with email: ", email);
      return resolve(res);
    });
  });
};

module.exports = Connection;