/**
 * @description Rutas para las reservas.
 * @module Routes/Booking
 */


module.exports = (app) => {
  /**
   * Controladores para las reservas.
   * @type {object}
   * @const
   * @requires module:controllers/booking.controller
   * @requires express
   */
  const bookings = require("../controllers/booking.controller.js");
  var router = require("express").Router();

  /**
   * Ruta para crear una nueva reserva.
   * @name post/api/bookings
   * @function
   * @memberof module:Routes/Booking
 * @param {string} ruta - La ruta correspondiente.
   * @param {function} bookings.create - La función controladora que crea una nueva reserva.
   */
  router.post("/", bookings.create);

  /**
   * Ruta para obtener todas las reservas.
   * @name get/api/bookings
   * @function
   * @memberof module:Routes/Booking
 * @param {string} ruta - La ruta correspondiente.
   * @param {function} bookings.findAll - La función controladora que obtiene todas las reservas.
   */
  router.get("/", bookings.findAll);

  /**
   * Ruta para obtener una reserva por su ID.
   * @name get/api/bookings/:id
   * @function
   * @memberof module:Routes/Booking
 * @param {string} ruta - La ruta correspondiente.
   * @param {number} res.params.id - El ID de la reserva.
   * @param {function} bookings.findOne - La función controladora que obtiene una reserva por su ID.
   */
  router.get("/:id", bookings.findOne);

  /**
   * Ruta para actualizar una reserva por su ID.
   * @name put/api/bookings/:id
   * @function
   * @memberof module:Routes/Booking
   * @param {string} ruta - La ruta correspondiente.
   * @param {number} res.params.id - El ID de la reserva.
   * @param {function} bookings.update - La función controladora que actualiza una reserva por su ID.
   */
  router.put("/:id", bookings.update);

  /**
   * Ruta para eliminar una reserva por su ID.
   * @name delete/api/bookings/:id
   * @function
   * @memberof module:Routes/Booking
    * @param {string} ruta - La ruta correspondiente.
   * @param {number} res.params.id - El ID de la reserva.
   * @param {function} bookings.deleteOne - La función controladora que elimina una reserva por su ID.
   */
  router.delete("/:id", bookings.deleteOne);

  /**
   * Ruta para eliminar todas las reservas.
   * @name delete/api/bookings
   * @function
   * @memberof module:Routes/Booking
    * @param {string} ruta - La ruta correspondiente.
   * @param {function} bookings.deleteAll - La función controladora que elimina todas las reservas.
   */
  router.delete("/", bookings.deleteAll);

  app.use("/api/bookings", router);
};
