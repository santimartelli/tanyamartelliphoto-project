/**
 * @description Rutas para gestionar las solicitudes de reservas.
 */
module.exports = (app) => {
  const bookings = require("../controllers/booking.controller.js");
  var router = require("express").Router();

  /**
   * @description Ruta para crear una nueva reserva.
   */
  router.post("/", bookings.create);

  /**
   * @description Ruta para obtener todas las reservas.
   */
  router.get("/", bookings.findAll);

  /**
   * @description Ruta para obtener una reserva por su ID.
   */
  router.get("/:id", bookings.findOne);

  /**
   * @description Ruta para actualizar una reserva por su ID.
   */
  router.put("/:id", bookings.update);

  /**
   * @description Ruta para eliminar una reserva por su ID.
   */
  router.delete("/:id", bookings.deleteOne);

  /**
   * @description Ruta para eliminar todas las reservas.
   */
  router.delete("/", bookings.deleteAll);

  app.use("/api/bookings", router);
};
