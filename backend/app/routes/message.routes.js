module.exports = (app) => {
  const messages = require("../controllers/message.controller.js");

  var router = require("express").Router();

  // Crear un nuevo mensaje
  router.post("/", messages.create);

  // Obtener todos los mensajes
  router.get("/", messages.findAll);

  // Obtener un solo mensaje a través del id
  router.get("/:id", messages.findOne);

  // Actualizar un mensaje a través del id
  router.put("/:id", messages.update);

  // Eliminar un mensaje a través del id
  router.delete("/:id", messages.deleteOne);

  // Eliminar todos los mensajes
  router.delete("/", messages.deleteAll);

  app.use("/api/messages", router);
};
