module.exports = (app) => {
  const emailService = require("../services/emailService.js");

  var router = require("express").Router();

  // Reply to a message sending an email
  router.post("/reply", (req, res) => {
    console.log(req.body);
    if (
      !req.body.name ||
      !req.body.email ||
      !req.body.message ||
      !req.body.messageContent
    ) {
      res.status(400).send({ message: "Please complete all the fields" });
      return;
    }
    res.status(202).send({ message: "Email sending initiated" });

    emailService.replyEmail(req.body.email, req.body)
    .then(() => console.log("Successfully sent reply email"))
    .catch(error => console.error("Error sending reply email:", error));
      });
  app.use("/api/email", router);
};
