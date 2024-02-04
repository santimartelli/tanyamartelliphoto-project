// Representa el modelo de categoría y contiene las funciones para interactuar con la base de datos.

const sql = require("./db.js");

/**
 * Representación del modelo de categoría.
 * @constructor
 * @param {object} category - El objeto de la categoría con los datos de la categoría.
 * @param {string} category.categoryName - El nombre de la categoría.
 */
const Category = function (category) {
  this.categoryName = category.categoryName;
};

/**
 * Crea una nueva categoría, la guarda en la base de datos y devuelve el resultado.
 * @param {object} newCategory - El objeto de la nueva categoría.
 * @param {function} result - La función de callback que maneja la respuesta de la base de datos.
 */
Category.create = (newCategory, result) => {
  sql.query("INSERT INTO categories SET ?", newCategory, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    console.log("created category: ", { id: res.insertId, ...newCategory });
    result(null, { id: res.insertId, ...newCategory });
  });
};

/**
 * Obtiene todas las categorías de la base de datos y devuelve el resultado.
 * @param {function} result - La función de callback que maneja la respuesta de la base de datos.
 */
Category.getAll = (result) => {
  sql.query("SELECT * FROM categories", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    result(null, res);
  });
};

/**
 * Busca una categoría por su ID y Devuelve el resultado.
 * @param {number} categoryId - El ID de la categoría a buscar.
 * @param {function} result - La función de callback que maneja la respuesta de la base de datos.
 */
Category.findById = (categoryId, result) => {
  sql.query(
    "SELECT * FROM categories WHERE categoryId = ?",
    categoryId,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.length) {
        console.log("found category: ", res[0]);
        result(null, res[0]);
        return;
      }
      result({ kind: "not_found" }, null);
    }
  );
};

/**
 * Actualiza en la base de datos una categoría existente por su ID y devuelve el resultado.
 * @param {number} categoryId - El ID de la categoría a actualizar.
 * @param {object} category - El objeto de la categoria actualizado.
 * @param {function} result - La función de callback que maneja la respuesta de la base de datos.
 */
Category.updateById = (categoryId, category, result) => {
  sql.query(
    "UPDATE categories SET categoryName = ? WHERE categoryId = ?",
    [category.categoryName, categoryId],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
      if (res.affectedRows == 0) {
        result({ kind: "not_found" }, null);
        return;
      }
      console.log("updated category: ", { id: categoryId, ...category });
      result(null, { id: categoryId, ...category });
    }
  );
};

/**
 * Elimina una categoría de la base de datos por su ID y devuelve el resultado.
 * @param {number} categoryId - El ID de la categoría a eliminar.
 * @param {function} result - La función de callback que maneja la respuesta de la base de datos.
 */
Category.removeOne = (categoryId, result) => {
  sql.query(
    "DELETE FROM categories WHERE categoryId = ?",
    categoryId,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
      if (res.affectedRows == 0) {
        result({ kind: "not_found" }, null);
        return;
      } else {
        console.log("deleted category with id:", categoryId);
        result(null, res);
      }
    }
  );
};

/**
 * Elimina todas las categorías de la base de datos y devuelve el resultado.
 * @param {function} result - La función de callback que maneja la respuesta de la base de datos.
 */
Category.removeAll = (result) => {
  sql.query("DELETE FROM categories", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    } else {
      console.log(`deleted ${res.affectedRows} categories`);
      result(null, res);
    }
  });
};

module.exports = Category;
