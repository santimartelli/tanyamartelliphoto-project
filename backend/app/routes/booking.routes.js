module.exports = (app) => {
  const bookings = require("../controllers/booking.controller.js");

  var router = require("express").Router();

  // Crear una nueva reserva
  router.post("/", bookings.create);

  // Retrieve all bookings
  router.get("/", bookings.findAll);

  // Retrieve a single Category with id
  router.get("/:id", bookings.findOne);

  // Update a Category with id
  router.put("/:id", bookings.update);

  // Delete a Category with id
  router.delete("/:id", bookings.deleteOne);

  // Delete all bookings
  router.delete("/", bookings.deleteAll);

  app.use("/api/bookings", router);
};
