const mysql = require("mysql");
const config = require('../config.json')

const descriptionPool = mysql.createConnection({
  password: config['db-password'],
  user: config['db-username'],
  host: config['db-connection-string'],
  database: 'UG',
  port:'3306'
  
});

descriptionPool.connect((err) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log("Connected to DB");
});

let descriptionDB = function (User) {
  this.email = User.email;
  this.description = User.description;
};

descriptionDB.createDescription = (newEmail, newDescription) => {
  return new Promise((resolve, reject) => {
    descriptionPool.query(
      "UPDATE users SET description = ? WHERE email = ?",
      [newDescription, newEmail],
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          return reject(err);
        }

        if (res.affectedRows == 0) {
          return reject("Cant add description");
        }

        return resolve("added");
      }
    );
  });
};

descriptionDB.all = () => {
  return new Promise((resolve, reject) => {
    descriptionPool.query("Select description from users", (err, results) => {
      if (err) {
        return reject(err);
      }
      return resolve(results);
    });
  });
};

descriptionDB.descriptionByEmail = (email) => {
  return new Promise((resolve, reject) => {
    descriptionPool.query(
      "Select description from users where email = ?",
      email,
      (err, results) => {
        if (err) {
          return reject(err);
        }
        if (results.length != 0) {
          return resolve(results[0]);
        }
        return reject("description not found for user with email: " + email);
      }
    );
  });
};

descriptionDB.updateByEmail = (email, description) => {
  return new Promise((resolve, reject) => {
    descriptionPool.query(
      "UPDATE users SET description = ? WHERE email = ?",
      [description, email],
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          return reject(err);
        }
        if (res.affectedRows == 0) {
          // not found user with the email
          return "not found";
        }
        return resolve(res);
      }
    );
  });
};

descriptionDB.deleteByEmail = (email) => {
  return new Promise((resolve, reject) => {
    locationPool.query(
      "UPDATE users SET description = ? WHERE email = ?",
      ["", email],
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          return reject(err);
        }

        if (res.affectedRows == 0) {
          return reject("Cant delete non-existent location");
        }

        return resolve("updated");
      }
    );
  });
};

module.exports = descriptionDB;
