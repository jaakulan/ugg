const mysql = require("mysql");

const locationPool = mysql.createPool({
  password: "1234",
  user: "root",
  database: "locations",
});

const location = (User) => {
  (this.id = User.id), (this.location = User.location);
};

// Add a new location to a new user
location.createLocation = (id, location) => {
  return new Promise((resolve, reject) => {
    locationPool.query(
      "UPDATE users SET location = ? WHERE id = ?",
      [location, id],
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          return reject(err);
        }

        if (res.affectedRows == 0) {
          return reject("Cant add location");
        }

        return resolve("added");
      }
    );
  });
};

// Get a users location
location.getLocation = (id) => {
  return new Promise((resolve, reject) => {
    locationPool.query(
      "SELECT location FROM users WHERE id = ?",
      id,
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          return reject(err);
        }
        // check if the result is not empty
        if (res.length != 0) {
          return resolve(res[0]);
        }
        // at this point
        return reject("no location found for user with id: " + id);
      }
    );
  });
};

// update a users location
location.updateLocation = (id, location) => {
  return new Promise((resolve, reject) => {
    locationPool.query(
      "UPDATE users SET location = ? WHERE id = ?",
      [location, id],
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          return reject(err);
        }

        if (res.affectedRows == 0) {
          return reject("Cant update non-existent location");
        }

        return resolve("updated");
      }
    );
  });
};

// delete a users location
location.deleteLocation = (id) => {
  return new Promise((resolve, reject) => {
    locationPool.query(
      "UPDATE users SET location = ? WHERE id = ?",
      ["", id],
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

module.exports = location;
