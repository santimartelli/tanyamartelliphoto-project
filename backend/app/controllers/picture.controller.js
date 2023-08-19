const Picture = require("../models/picture.model.js");

exports.create = (req, res) => {
  if (!req.body.picturePath || !req.body.categoryID) {
    res.status(400).send({ message: "Picture path and category ID are required!" });
    return;
  }

  const newPicture = new Picture({
    picturePath: req.body.picturePath,
    categoryID: req.body.categoryID,
  });

  Picture.create(newPicture, (err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Picture.",
      });
    } else {
      res.send(data);
    }
  });
};

exports.findAll = (req, res) => {
  Picture.getAll((err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving pictures.",
      });
    } else {
      res.send(data);
    }
  });
};

exports.findByCategory = (req, res) => {
  Picture.getByCategory(req.params.categoryID, (err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving pictures for the category.",
      });
    } else {
      res.send(data);
    }
  });
};

exports.update = (req, res) => {
  if (!req.body) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  Picture.updateById(req.params.id, new Picture(req.body), (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({ message: `Picture not found with id ${req.params.id}` });
      } else {
        res.status(500).send({ message: "Error updating picture with id " + req.params.id });
      }
    } else {
      res.send(data);
    }
  });
};

exports.delete = (req, res) => {
  Picture.deleteById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({ message: `Picture not found with id ${req.params.id}` });
      } else {
        res.status(500).send({ message: "Could not delete picture with id " + req.params.id });
      }
    } else {
      res.send({ message: "Picture deleted successfully!" });
    }
  });
};

exports.deleteAll = (req, res) => {
  Picture.deleteAll((err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || "Some error occurred while removing all pictures.",
      });
    } else {
      res.send({ message: "All pictures deleted successfully!" });
    }
  });
};

exports.deleteAllByCategory = (req, res) => {
  Picture.deleteAllByCategory(req.params.categoryID, (err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || "Some error occurred while removing all pictures for the category.",
      });
    } else {
      res.send({ message: `All pictures for category ${req.params.categoryID} deleted successfully!` });
    }
  });
};
