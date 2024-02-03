/**
 * Este archivo contiene las rutas para gestionar las imágenes.
 * @module Routes/Picture
 */

module.exports = (app) => {
  /**
   * Controladores para las imágenes.
   * @type {object}
   * @const
   * @requires module:controllers/picture.controller
   * @requires express
   */
  const pictures = require("../controllers/picture.controller.js");
  var router = require("express").Router();
  var upload = require("../config/multer.config.js");

  /**
   * Ruta para subir imagenes.
   * @name post/api/pictures
   * @function
   * @memberof module:Routes/Picture
   * @param {string} ruta - La ruta correspondiente.
   * @param {object} req - El objeto de solicitud.
   * @param {object} res - El objeto de respuesta.
   * @param {function} pictures.uploadPictures - La función controladora que sube imágenes.
   */
  router.post("/", upload.array("images", 10), pictures.uploadPictures);

  /**
   * Ruta para obtener todas las imágenes.
   * @name get/api/pictures
   * @function
   * @memberof module:Routes/Picture
   * @param {string} ruta - La ruta correspondiente.
   * @param {function} pictures.findAll - La función controladora que obtiene todas las imágenes.
   */
  router.get("/", pictures.findAll);

  /**
   * Ruta para obtener una imagen por su ID.
   * @name get/api/pictures/:id
   * @function
   * @memberof module:Routes/Picture
   * @param {string} ruta - La ruta correspondiente.
   * @param {number} res.params.id - El ID de la imagen.
   * @param {function} pictures.findOne - La función controladora que obtiene una imagen por su ID.
   */
  router.get("/category/:categoryID", pictures.findByCategory);

  /**
   * Ruta para actualizar una imagen por su ID.
   * @name put/api/pictures/:id
   * @function
   * @memberof module:Routes/Picture
   * @param {string} ruta - La ruta correspondiente.
   * @param {number} res.params.id - El ID de la imagen.
   * @param {function} pictures.update - La función controladora que actualiza una imagen por su ID.
   */
  router.put("/:id", pictures.update);

  /**
   * Ruta para eliminar una archivo de imagen.
   * @name delete/api/pictures/deleteFile
   * @function
   * @memberof module:Routes/Picture
   * @param {string} ruta - La ruta correspondiente.
   * @param {object} req - El objeto de solicitud.
   * @param {object} res - El objeto de respuesta.
   * @param {function} pictures.deleteFile - La función controladora que elimina un archivo de imagen.
   */
  router.delete("/deleteFile", pictures.deleteFile);

  /**
   * Ruta para eliminar una imagen por su ID.
   * @name delete/api/pictures/:id
   * @function
   * @memberof module:Routes/Picture
   * @param {string} ruta - La ruta correspondiente.
   * @param {number} res.params.id - El ID de la imagen.
   * @param {function} pictures.delete - La función controladora que elimina una imagen por su ID.
   */
  router.delete("/:id", pictures.delete);

  /**
   * Ruta para eliminar todas las imágenes.
   * @name delete/api/pictures
   * @function
   * @memberof module:Routes/Picture
   * @param {string} ruta - La ruta correspondiente.
   * @param {function} pictures.deleteAll - La función controladora que elimina todas las imágenes.
   */
  router.delete("/", pictures.deleteAll);

  /**
   * Ruta para eliminar todas las imágenes de una categoría.
   * @name delete/api/pictures/category/:categoryID
   * @function
   * @memberof module:Routes/Picture
   * @param {string} ruta - La ruta correspondiente.
   * @param {number} res.params.categoryID - El ID de la categoría.
   * @param {function} pictures.deleteAllByCategory - La función controladora que elimina todas las imágenes de una categoría.
   */
  router.delete("/category/:categoryID", pictures.deleteAllByCategory);

  app.use("/api/pictures", router);
};
