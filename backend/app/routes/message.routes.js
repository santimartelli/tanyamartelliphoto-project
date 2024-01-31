/**
 * @fileoverview Este archivo contiene las rutas para la gestión de los mensajes.
 */

module.exports = (app) => {
  const messages = require("../controllers/message.controller.js");
  var router = require("express").Router();

  /**
   * @description Ruta para crear un nuevo mensaje.
   */
  router.post("/", messages.create);

  /**
   * @description Ruta para obtener todos los mensajes.
   */
  router.get("/", messages.findAll);

  /**
   * @description Ruta para obtener un mensaje a través del id.
   */
  router.get("/:id", messages.findOne);

  /**
   * @description Ruta para actualizar un mensaje a través del id.
   */
  router.put("/:id", messages.update);

  /**
   * @description Ruta para eliminar un mensaje a través del id.
   */
  router.delete("/:id", messages.deleteOne);

  /**
   * @description Ruta para eliminar todos los mensajes.
   */
  router.delete("/", messages.deleteAll);

  app.use("/api/messages", router);
};
