// Reference: https://www.bezkoder.com/node-js-rest-api-express-mysql/
const Connection = require("../app/models/connections.model.js");

// Create and Save a new Connection
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
    res.status(400).send({ // Send bad request if body is empty
        message: "Bad Request: No request can be found."
    });
    }

    // Create a Connection
    const connection = new Connection({
    socialMedia: req.body.socialMedia,
    username: req.body.name,
    email: req.body.email
    });

    // Save Connection in the database
    Connection.create(connection, (err, data) => {
    if (err)
        res.status(500).send({ // if something goes wrong while creating connection, send internal server error
        message:
            err.message || "Internal Server Error: Unable to create connection."
        });
    else res.send(data); // send data to frontend
    });
};

// Retrieve all Connections from the database.
exports.findAll = (req, res) => {
    // Retrieve all Connections in the database
    Connection.findAll(connection, (err, data) => {
        if (err)
            res.status(500).send({ // if something goes wrong while creating connection, send internal server error
            message:
                err.message || "Internal Server Error: Unable to retrieve connections."
            });
        else res.send(data); // send data to frontend
        });

};

// Find a single Connection with an email
exports.findOne = (req, res) => {
    Connection.findByEmail(req.params.email, (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({ // Send Error 404 if connection not found
              message: `Page Not Found: Connection does not exist with email ${req.params.email}.`
            });
          } else {
            res.status(500).send({ // if something goes wrong while creating connection, send internal server error
              message: "Internal Server Error: Unable to create connection."
            });
          }
        } else res.send(data);
      });
};

// Update a Connection identified by the connectionId in the request
exports.update = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({ // Send bad request if body is empty
            message: "Bad Request: No request can be found."
        });
    }

    Connection.updateByEmail(
        req.params.email,
        new Connection(req.body),
        (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
            res.status(404).send({ // Send Error 404 if connection not found
                message: `Page Not Found: Connection does not exist with email ${req.params.email}.`
            });
            } else {
            res.status(500).send({ // if something goes wrong while creating connection, send internal server error
                message: "Internal Server Error: Unable to update connection."
            });
            }
        } else res.send(data);
        }
    );
};

// Delete a Connection with the specified connectionId in the request
exports.deleteOne = (req, res) => {
    Connection.remove(req.params.email, (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({ // Send Error 404 if connection not found
                message: `Page Not Found: Connection does not exist with email ${req.params.email}.`
            });
          } else {
            res.status(500).send({ // if something goes wrong while creating connection, send internal server error
                message: "Internal Server Error: Unable to delete connection."
            });
          }
        } else res.send({ message: `Connection was deleted successfully!` });
    });
};

// Delete all Connections from the database.
exports.deleteAll = (req, res) => {
    Connection.removeAll((err, data) => {
        if (err)
          res.status(500).send({ // if something goes wrong while creating connection, send internal server error
            message:
              err.message || "Internal Server Error: Unable to delete connections."
          });
        else res.send({ message: "Internal Server Error: Unable to delete connections." });
      });
};