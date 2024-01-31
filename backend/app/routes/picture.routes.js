/**
 * @description: Rutas para gestionar las imágenes.
 */
module.exports = (app) => {
  const pictures = require("../controllers/picture.controller.js");
  var router = require("express").Router();
  var upload = require("../config/multer.config.js");

  /**
   * @description Ruta para subir imagenes.
   */
  router.post("/", upload.array("images", 10), pictures.uploadPictures);

  /**
   * @description Ruta para obtener todas las imágenes.
   */
  router.get("/", pictures.findAll);

  /**
   * @description Ruta para obtener una imagen por su ID.
   */
  router.get("/category/:categoryID", pictures.findByCategory);

  /**
   * @description Ruta para actualizar una imagen por su ID.
   */
  router.put("/:id", pictures.update);

  /**
   * @description Ruta para eliminar una archivo de imagen.
   */
  router.delete("/deleteFile", pictures.deleteFile);

  /**
   * @description Ruta para eliminar una imagen por su ID.
   */
  router.delete("/:id", pictures.delete);

  /**
   * @description Ruta para eliminar todas las imágenes.
   */
  router.delete("/", pictures.deleteAll);

  /**
   * @description Ruta para eliminar todas las imágenes de una categoría.
   */
  router.delete("/category/:categoryID", pictures.deleteAllByCategory);

  app.use("/api/pictures", router);
};
