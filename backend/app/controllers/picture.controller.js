/**
 * Controlador de las imágenes. Contiene funciones para manejar las imágenes en la base de datos y en el servidor.
 * @module pictureController
 */

const PictureModel = require("../models/picture.model.js");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

/**
 * Sube una o varias imágenes al servidor y las registra en la base de datos.
 * @param {Object} req - El objeto de solicitud HTTP.
 * @param {Object} req.files - El objeto de archivos subidos.
 * @param {Array} req.files - El array de archivos subidos.
 * @param {string} req.body.categoryId - El ID de la categoría a la que pertenecen las imágenes.
 * @param {Object} res - La respuesta HTTP.
 */
exports.uploadPictures = (req, res) => {
  console.log("req.files", req.files);
  console.log("req.body", req.body);
  const picturesUploaded = req.files.map((file) => {
    console.log("BASE URL:", process.env.BASE_URL);
    return {
      picturePath: `${process.env.BASE_URL}/resources/static/assets/uploads/${file.filename}`,
      categoryId: req.body.categoryId,
    };
  });

  const values = picturesUploaded.map((picture) => [
    picture.picturePath,
    picture.categoryId,
  ]);

  PictureModel.create(values, (err, result) => {
    console.log("values", values);
    if (err) {
      console.log("Error while uploading pictures: ", err);
      return res.status(500).json({ error: "Failed to upload pictures" });
    }
    console.log("Pictures added to database");
    res.send("Pictures added to database");
  });
};

/**
 * Obtiene todas las imágenes de la base de datos.
 * @param {Object} req - El objeto de solicitud HTTP.
 * @param {Object} res - El objeto de respuesta HTTP.
 */
exports.findAll = (req, res) => {
  PictureModel.getAll((err, data) => {
    if (err) {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving pictures.",
      });
    } else {
      res.send(data);
    }
  });
};

/**
 * Obtiene imagenes según el ID su categoría.
 * @param {Object} req - El objeto de solicitud HTTP.
 * @param {string} req.params.categoryId - El ID de la categoría.
 * @param {Object} res - El objeto de respuesta HTTP.
 */
exports.findByCategory = (req, res) => {
  PictureModel.getByCategory(req.params.categoryId, (err, data) => {
    if (err) {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while retrieving pictures for the category.",
      });
    } else {
      res.send(data);
    }
  });
};

/**
 * Actualiza una imagen existente por su ID.
 * @param {Object} req - El objeto de solicitud HTTP.
 * @param {string} req.params.id - El ID de la imagen.
 * @param {Object} req.body - Los datos de la imagen a actualizar.
 * @param {Object} res - El objeto de respuesta HTTP.
 */
exports.update = (req, res) => {
  if (!req.body) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  PictureModel.updateById(
    req.params.id,
    new PictureModel(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res
            .status(404)
            .send({ message: `Picture not found with id ${req.params.id}` });
        } else {
          res.status(500).send({
            message: "Error updating picture with id " + req.params.id,
          });
        }
      } else {
        res.send(data);
      }
    }
  );
};

/**
 * Elimina una imagen de la base de datos por su ID.
 * @param {Object} req - El objeto de solicitud HTTP.
 * @param {string} req.params.id - El ID de la imagen.
 * @param {Object} res - El objeto de respuesta HTTP.
 */
exports.delete = (req, res) => {
  PictureModel.deleteById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res
          .status(404)
          .send({ message: `Picture not found with id ${req.params.id}` });
      } else {
        res.status(500).send({
          message: "Could not delete picture with id " + req.params.id,
        });
      }
    } else {
      res.send({ message: "Picture deleted successfully!" });
    }
  });
};

/**
 * Elimina todas las imágenes de la base de datos.
 * @param {Object} req - El objeto de solicitud HTTP.
 * @param {Object} res - El objeto de respuesta HTTP.
 */
exports.deleteAll = (req, res) => {
  PictureModel.deleteAll((err, data) => {
    if (err) {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all pictures.",
      });
    } else {
      res.send({ message: "All pictures deleted successfully!" });
    }
  });
};

/**
 * Elimina todas las imágenes de una categoría de la base de datos.
 * @param {Object} req - El objeto de solicitud HTTP.
 * @param {string} req.params.categoryId - El ID de la categoría.
 * @param {Object} res - El objeto de respuesta HTTP.
 */
exports.deleteAllByCategory = (req, res) => {
  PictureModel.deleteAllByCategory(req.params.categoryId, (err, data) => {
    if (err) {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while removing all pictures for the category.",
      });
    } else if (!data.affectedRows) {
      res.status(404).send({
        message: `No pictures found for category ${req.params.categoryId}`,
      });
    } else {
      res.send({
        message: `All pictures for category ${req.params.categoryId} deleted successfully!`,
      });
    }
  });
};

/**
 * Elimina un archivo del servidor.
 * @param {Object} req - El objeto de solicitud HTTP.
 * @param {string} req.query.filepath - La ruta del archivo a eliminar.
 * @param {Object} res - El objeto de respuesta HTTP.
 */
exports.deleteFile = (req, res) => {
  const filePath = req.query.filepath;

  if (!filePath) {
    return res.status(400).send({ message: "File path is required" });
  }
  const fullPath = path.join(__dirname, "../../", filePath);
  // Comprobación de seguridad para evitar que se eliminen archivos fuera de la carpeta de uploads
  if (
    !fullPath.startsWith(
      path.join(__dirname, "../../resources/static/assets/uploads/")
    )
  ) {
    return res.status(400).send({ message: "Invalid file path" });
  }
  // Comprobación de si el archivo existe
  if (!fs.existsSync(fullPath)) {
    return res.status(404).send({ message: "File not found" });
  }
  // Eliminación del archivo
  fs.unlink(fullPath, (err) => {
    if (err) {
      console.error("Error while deleting file:", err);
      return res.status(500).send({ message: "Failed to delete file" });
    }
    res.send({ message: "File deleted successfully" });
  });
};
