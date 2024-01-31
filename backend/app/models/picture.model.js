/**
 * @fileoverview Modelo de la tabla Pictures. Se definen los atributos de la tabla y
 * el nombre de la tabla a la que hace referencia.
 */

const sql = require("./db.js");

/**
 * Representa el modelo imagen
 * @constructor
 * @param {object} picture - El objeto imagen.
 * @param {string} picture.picturePath - La ruta de la imagen.
 * @param {number} picture.categoryId - El ID de la categoría a la que pertenece la imagen.
 */
const Picture = function (picture) {
  this.picturePath = picture.picturePath;
  this.categoryId = picture.categoryId;
};

/**
 * Crea una nueva imagen, la guarda en la base de datos y devuelve el resultado.
 * @param {array} pictureData - Los datos de la imagen a crear.
 * @param {function} callback - La función de callback que maneja la respuesta de la base de datos.
 */
Picture.create = (pictureData, callback) => {
  const query = 'INSERT INTO Pictures (picturePath, categoryId) VALUES ?';
  sql.query(query, [pictureData], callback);
};

/**
 * Obtiene todas las imágenes de la base de datos y devuelve el resultado.
 * @param {function} result - La función de callback que maneja la respuesta de la base de datos.
 */
Picture.getAll = (result) => {
  sql.query(
    `SELECT p.pictureId, p.picturePath, p.categoryId, c.categoryName
     FROM Pictures p
     INNER JOIN Categories c ON p.categoryId = c.categoryId`,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      } else if (res.length === 0) {
        result(null, { message: "No pictures found!" });
        return;
      }
      result(null, res);
    }
  );
};

/**
 * Obtiene una imagen por su ID y devuelve el resultado.
 * @param {number} categoryId - El ID de la imagen a buscar.
 * @param {function} result - La función de callback que maneja la respuesta de la base de datos.
 */

Picture.getByCategory = (categoryId, result) => {
  sql.query(
    "SELECT * FROM Pictures WHERE categoryId = ?",
    categoryId,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
      if (res.length) {
        result(null, res);
        return;
      }
      result({ kind: "not_found" }, null);
    }
  );
};

/**
 * Obtiene una imagen por su ID y devuelve el resultado.
 * @param {number} pictureId - El ID de la imagen a buscar.
 * @param {object} updatedPicture - El objeto imagen actualizado.
 * @param {string} updatedPicture.picturePath - La ruta de la imagen actualizada.
 * @param {number} updatedPicture.categoryId - El ID de la categoría a la que pertenece la imagen actualizada.
 * @param {function} result - La función de callback que maneja la respuesta de la base de datos.
 */
Picture.updateById = (pictureId, updatedPicture, result) => {
  sql.query(
    "UPDATE Pictures SET picturePath = ?, categoryId = ? WHERE pictureId = ?",
    [updatedPicture.picturePath, updatedPicture.categoryId, pictureId],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
      if (res.affectedRows === 0) {
        result({ kind: "not_found" }, null);
        return;
      }
      result(null, { id: pictureId, ...updatedPicture });
    }
  );
};

/**
 * Elimina una imagen de la base de datos por su ID.
 * @param {number} pictureId - El ID de la imagen.
 * @param {function} result - La función de callback que maneja la respuesta de la base de datos.
 */
Picture.deleteById = (pictureId, result) => {
  sql.query(
    "DELETE FROM Pictures WHERE pictureId = ?",
    pictureId,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
      if (res.affectedRows === 0) {
        result({ kind: "not_found" }, null);
        return;
      }
      result(null, res);
    }
  );
};

/**
 * Elimina todas las imágenes de una categoría.
 * @param {number} categoryId - El ID de la categoría.
 * @param {function} result - La función de callback que maneja la respuesta de la base de datos.
 */
Picture.deleteAllByCategory = (categoryId, result) => {
  sql.query(
    "DELETE FROM Pictures WHERE categoryId = ?",
    categoryId,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
      result(null, res);
    }
  );
};

/**
 * Elimina todas las imágenes de la base de datos.
 * @param {function} result - La función de callback que maneja la respuesta de la base de datos.
 */
Picture.deleteAll = (result) => {
  sql.query("DELETE FROM Pictures", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    result(null, res);
  });
};

module.exports = Picture;
