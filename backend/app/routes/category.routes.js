/**
 * @fileoverview Este archivo contiene las rutas para gestionar las categorías.
 */

module.exports = (app) => {
  const categories = require("../controllers/category.controller.js");
  var router = require("express").Router();

  /**
   * @description Ruta para crear una nueva categoría.
   */
  router.post("/", categories.create);

  /**
   * @description Ruta para obtener todas las categorías.
   */
  router.get("/", categories.findAll);

  /**
   * @description Ruta para obtener una categoría por su ID.
   */
  router.get("/:id", categories.findOne);

  /**
   * @description Ruta para actualizar una categoría por su ID.
   */
  router.put("/:id", categories.update);

  /**
   * @description Ruta para eliminar una categoría por su ID.
   */
  router.delete("/:id", categories.deleteOne);

  /**
   * @description Ruta para eliminar todas las categorías.
   */
  router.delete("/", categories.deleteAll);

  app.use("/api/categories", router);
};