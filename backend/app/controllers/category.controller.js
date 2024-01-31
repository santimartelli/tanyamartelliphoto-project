/**
 * @fileoverview Archivo que contiene el controlador de las categorías.
 */

const CategoryModel = require("../models/category.model.js");

/**
 * Crea una nueva categoría y la guarda en la base de datos.
 * @param {Object} req - El objeto de solicitud HTTP.
 * @param {Object} res - El objeto de respuesta HTTP.
 */
exports.create = (req, res) => {
  console.log(req.body);
  if (!req.body.categoryName) {
    res.status(400).send({ message: "Category name cannot be empty!" });
    return;
  }

  const newCategory = new CategoryModel({
    categoryName: req.body.categoryName,
  });

  CategoryModel.create(newCategory, (err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Category.",
      });
    } else {
      res.send(data);
    }
  });
};

/**
 * Obtiene todas las categorías almacenadas en la base de datos.
 * @param {Object} req - El objeto de solicitud HTTP.
 * @param {Object} res - El objeto de respuesta HTTP.
 */
exports.findAll = (req, res) => {
  CategoryModel.getAll((err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving categories.",
      });
    } else {
      res.send(data);
    }
  });
};

/**
 * Busca una categoría por su ID.
 * @param {Object} req - El objeto de solicitud HTTP.
 * @param {Object} res - El objeto de respuesta HTTP.
 */
exports.findOne = (req, res) => {
  CategoryModel.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({ message: `Category not found with id ${req.params.id}` });
      } else {
        res.status(500).send({ message: "Error retrieving category with id " + req.params.id });
      }
    } else {
      res.send(data);
    }
  });
};

/**
 * Actualiza una categoría existente por su ID.
 * @param {Object} req - El objeto de solicitud HTTP.
 * @param {Object} res - El objeto de respuesta HTTP.
 */
exports.update = (req, res) => {
  if (!req.body) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  CategoryModel.updateById(req.params.id, new CategoryModel(req.body), (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({ message: `Category not found with id ${req.params.id}` });
      } else {
        res.status(500).send({ message: "Error updating category with id " + req.params.id });
      }
    } else {
      res.send(data);
    }
  });
};

/**
 * Elimina una categoría por su ID.
 * @param {Object} req - El objeto de solicitud HTTP.
 * @param {Object} res - El objeto de respuesta HTTP.
 */
exports.deleteOne = (req, res) => {
  CategoryModel.removeOne(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({ message: `Category not found with id ${req.params.id}` });
      } else {
        res.status(500).send({ message: "Could not delete category with id " + req.params.id });
      }
    } else {
      res.send({ message: "Category deleted successfully!" });
    }
  });
};

/**
 * Elimina todas las categorías.
 * @param {Object} req - El objeto de solicitud HTTP.
 * @param {Object} res - El objeto de respuesta HTTP.
 */
exports.deleteAll = (req, res) => {
  CategoryModel.removeAll((err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || "Some error occurred while removing all categories.",
      });
    } else {
      res.send({ message: "All categories deleted successfully!" });
    }
  });
};
