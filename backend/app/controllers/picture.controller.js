const PictureModel = require("../models/picture.model.js");
const fs = require('fs');
const path = require('path');

exports.uploadPictures = (req, res) => {
  console.log("req.files", req.files);
  const picturesUploaded = req.files.map((file) => {
    return {
      picturePath: `http://localhost:3000/resources/static/assets/uploads/${file.filename}`,
      categoryId: req.body.categoryId,
    };
  });

  const values = picturesUploaded.map((picture) => [
    picture.picturePath,
    picture.categoryId,
  ]);

  PictureModel.create(values, (err, result) => {
    console.log("values", values);
    if (err){
      console.log("Error while uploading pictures: ", err);
      return res.status(500).json({ error: "Failed to upload pictures" });
    }
    console.log("Pictures added to database");
    res.send("Pictures added to database");
  });
};

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
          res
            .status(500)
            .send({
              message: "Error updating picture with id " + req.params.id,
            });
        }
      } else {
        res.send(data);
      }
    }
  );
};

exports.delete = (req, res) => {
  PictureModel.deleteById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res
          .status(404)
          .send({ message: `Picture not found with id ${req.params.id}` });
      } else {
        res
          .status(500)
          .send({
            message: "Could not delete picture with id " + req.params.id,
          });
      }
    } else {
      res.send({ message: "Picture deleted successfully!" });
    }
  });
};

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

exports.deleteAllByCategory = (req, res) => {
  PictureModel.deleteAllByCategory(req.params.categoryId, (err, data) => {
    if (err) {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while removing all pictures for the category.",
      });
    } else if (!data.affectedRows) {
      res
        .status(404)
        .send({
          message: `No pictures found for category ${req.params.categoryId}`,
        });
    } else {
      res.send({
        message: `All pictures for category ${req.params.categoryId} deleted successfully!`,
      });
    }
  });
};

// exports.deleteFile = (req, res) => {
//   const filePath = req.query.filepath;
//   console.log("filePath", filePath);
//   // Check if the file path is provided
//   if (!filePath) {
//     return res.status(400).send({ message: "File path is required" });
//   }
//   // Construct the full path (if needed) and delete the file
//   const fullPath = path.join(__dirname, '../../resources/static/assets/uploads/', filePath);

//   fs.unlink(fullPath, (err) => {
//     if (err) {
//       console.error("Error while deleting file:", err);
//       return res.status(500).send({ message: "Failed to delete file" });
//     }
//     res.send({ message: "File deleted successfully" });
//   });
// };

exports.deleteFile = (req, res) => {
  const filePath = req.query.filepath;

  if (!filePath) {
    return res.status(400).send({ message: "File path is required" });
  }

  const fullPath = path.join(__dirname, '../../', filePath);

  // Security check: Prevent directory traversal
  if (!fullPath.startsWith(path.join(__dirname, '../../resources/static/assets/uploads/'))) {
    return res.status(400).send({ message: "Invalid file path" });
  }

  // Check if file exists
  if (!fs.existsSync(fullPath)) {
    return res.status(404).send({ message: "File not found" });
  }

  fs.unlink(fullPath, (err) => {
    if (err) {
      console.error("Error while deleting file:", err);
      return res.status(500).send({ message: "Failed to delete file" });
    }
    res.send({ message: "File deleted successfully" });
  });
};