/**
 * Este archivo contiene las rutas para la gestión de los mensajes.
 * @module Routes/Message
 */

module.exports = (app) => {
  /**
   * Controladores para los mensajes.
   * @type {object}
   * @const
   * @requires module:controllers/message.controller
   * @requires express
   */
  const messages = require("../controllers/message.controller.js");
  var router = require("express").Router();

  /**
   * Ruta para crear un nuevo mensaje.
   * @name post/api/messages
   * @function
   * @memberof module:Routes/Message
   * @param {string} ruta - La ruta correspondiente.
   * @param {function} messages.create - La función controladora que crea un nuevo mensaje.
   */
  router.post("/", messages.create);

  /**
   * Ruta para obtener todos los mensajes.
   * @name get/api/messages
   * @function
   * @memberof module:Routes/Message
   * @param {string} ruta - La ruta correspondiente.
   * @param {function} messages.findAll - La función controladora que obtiene todos los mensajes.
   */
  router.get("/", messages.findAll);

  /**
   * Ruta para obtener un mensaje a través del id.
   * @name get/api/messages/:id
   * @function
   * @memberof module:Routes/Message
   * @param {string} ruta - La ruta correspondiente.
   * @param {number} res.params.id - El ID del mensaje.
   * @param {function} messages.findOne - La función controladora que obtiene un mensaje a través del id.
   */
  router.get("/:id", messages.findOne);

  /**
   * Ruta para actualizar un mensaje a través del id.
   * @name put/api/messages/:id
   * @function
   * @memberof module:Routes/Message
   * @param {string} ruta - La ruta correspondiente.
   * @param {number} res.params.id - El ID del mensaje.
   * @param {function} messages.update - La función controladora que actualiza un mensaje a través del id.
   */
  router.put("/:id", messages.update);

  /**
   * Ruta para eliminar un mensaje a través del id.
   * @name delete/api/messages/:id
   * @function
   * @memberof module:Routes/Message
   * @param {string} ruta - La ruta correspondiente.
   * @param {number} res.params.id - El ID del mensaje.
   */
  router.delete("/:id", messages.deleteOne);

  /**
   * Ruta para eliminar todos los mensajes.
   * @name delete/api/messages
   * @function
   * @memberof module:Routes/Message
   * @param {string} ruta - La ruta correspondiente.
   * @param {function} messages.deleteAll - La función controladora que elimina todos los mensajes.
   */
  router.delete("/", messages.deleteAll);

  app.use("/api/messages", router);
};
