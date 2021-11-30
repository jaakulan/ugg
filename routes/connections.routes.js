// Reference: https://www.bezkoder.com/node-js-rest-api-express-mysql/
module.exports = app => {
  const connections = require("../controllers/connections.controller.js");

  // Create a new Connection
  app.post("/connections", connections.create);

  // Retrieve all Connections
  app.get("/connections", connections.findAll);

  // Retrieve a single Connection with email
  app.get("/connections/:email", connections.findOne);

  // Update a Connection with email
  app.put("/connections/:email", connections.update);

  // Delete a Connection with email
  app.delete("/connections/:email", connections.deleteOne);

  // Delete all Connections with email
  app.delete("/connections", connections.deleteAll);

};