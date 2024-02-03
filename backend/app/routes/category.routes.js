/**
 * Rutas para la gestión de las categorías.
 * @module Routes/Category
 */


module.exports = (app) => {
  /**
   * Controladores para las categorías.
   * @type {object}
   * @const
   * @requires module:controllers/category.controller
   * @requires express
   */
  const categories = require("../controllers/category.controller.js");
  var router = require("express").Router();

  /**
   * Ruta para crear una nueva categoría.
   * @name post/api/categories
   * @function
   * @memberof module:Routes/Category
    * @param {string} ruta - La ruta correspondiente.
   * @param {function} categories.create - La función controladora que crea una nueva categoría.
   */
  router.post("/", categories.create);

  /**
   * Ruta para obtener todas las categorías.
   * @name get/api/categories
   * @function
   * @memberof module:Routes/Category
    * @param {string} ruta - La ruta correspondiente.
   * @param {function} categories.findAll - La función controladora que obtiene todas las categorías.
   */
  router.get("/", categories.findAll);

  /**
   * Ruta para obtener una categoría por su ID.
   * @name get/api/categories/:id
   * @function
   * @memberof module:Routes/Category
    * @param {string} ruta - La ruta correspondiente.
   * @param {number} res.params.id - El ID de la categoría.
   * @param {function} categories.findOne - La función controladora que obtiene una categoría por su ID.
   */
  router.get("/:id", categories.findOne);

  /**
   * Ruta para actualizar una categoría por su ID.
   * @name put/api/categories/:id
   * @function
   * @memberof module:Routes/Category
    * @param {string} ruta - La ruta correspondiente.
   * @param {number} res.params.id - El ID de la categoría.
   * @param {function} categories.update - La función controladora que actualiza una categoría por su ID.
   */
  router.put("/:id", categories.update);

  /**
   * Ruta para eliminar una categoría por su ID.
   * @name delete/api/categories/:id
   * @function
   * @memberof module:Routes/Category
    * @param {string} ruta - La ruta correspondiente.
   * @param {number} res.params.id - El ID de la categoría.
   * @param {function} categories.deleteOne - La función controladora que elimina una categoría por su ID.
   */
  router.delete("/:id", categories.deleteOne);

  /**
   * Ruta para eliminar todas las categorías.
   * @name delete/api/categories
   * @function
   * @memberof module:Routes/Category
    * @param {string} ruta - La ruta correspondiente.
   * @param {function} categories.deleteAll - La función controladora que elimina todas las categorías.
   */
  router.delete("/", categories.deleteAll);

  app.use("/api/categories", router);
};