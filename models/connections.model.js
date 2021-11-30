// Reference: https://www.bezkoder.com/node-js-rest-api-express-mysql/
const sql = require("./db.js");

// constructor
const Connection = function(connection) {
  this.socialMedia = connection.socialMedia; // social media
  this.username = connection.username; // username for social media
  this.email = connection.email; // user's email address
};

Connection.create = (newConnection, result) => {
  sql.query("INSERT INTO connections SET ?", newConnection, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created connection: ", { id: res.insertId, ...newConnection });
    result(null, { id: res.insertId, ...newConnection });
  });
};

Connection.findByEmail = (email, result) => {
  sql.query(`SELECT * FROM connections WHERE email = ${email}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found connection: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found Connection with the email
    result({ kind: "not_found" }, null);
  });
};

Connection.getAll = result => {
  sql.query("SELECT * FROM connections", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("connections: ", res);
    result(null, res);
  });
};

Connection.updateByEmail = (email, connection, result) => {
  sql.query(
    "UPDATE connections SET socialMedia = ?, email = ?, username = ?",
    [connection.socialMedia, email, connection.username],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found Connection with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated connection: ", { email: email, ...connection });
      result(null, { email: email, ...connection });
    }
  );
};

Connection.remove = (email, result) => {
  sql.query("DELETE FROM connections WHERE email = ?", email, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Connection with the email
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted connection with email: ", email);
    result(null, res);
  });
};

Connection.removeAll = result => {
  sql.query("DELETE FROM connections", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} connections`);
    result(null, res);
  });
};

module.exports = Connection;