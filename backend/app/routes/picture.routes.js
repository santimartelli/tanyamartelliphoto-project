module.exports = app => {
  const pictures = require("../controllers/pictures.controller.js");

  var router = require("express").Router();

  // Add a new Picture
  router.post("/", pictures.create);

  // Retrieve all Pictures
  router.get("/", pictures.findAll);

  // Retrieve all the Pictures of a category
  router.get("/:categoryID", tutorials.findOne);

  // Update a Tutorial with id
  router.put("/:id", tutorials.update);

  // Delete a Tutorial with id
  router.delete("/:id", tutorials.delete);

  // Delete all Tutorials
  router.delete("/", tutorials.deleteAll);

  app.use('/api/tutorials', router);
};