module.exports = (app) => {
  const pictures = require("../controllers/picture.controller.js");
  var router = require("express").Router();
  var upload = require("../config/multer.config.js");

  // Upload a new Picture
  router.post("/", upload.array("images", 10), pictures.uploadPictures);

  // Retrieve all Pictures
  router.get("/", pictures.findAll);

  // Retrieve Pictures by Category
  router.get("/category/:categoryID", pictures.findByCategory);

  // Update a Picture with id
  router.put("/:id", pictures.update);

  // Delete a Picture file
  router.delete("/deleteFile", pictures.deleteFile);

  // Delete a Picture with id
  router.delete("/:id", pictures.delete);

  // Delete all Pictures
  router.delete("/", pictures.deleteAll);

  // Delete all Pictures for a specific Category
  router.delete("/category/:categoryID", pictures.deleteAllByCategory);

  app.use("/api/pictures", router);
};
