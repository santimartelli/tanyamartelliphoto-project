/**
 * Rutas para enviar emails.
 * @module Routes/Email
 */

module.exports = (app) => {
  /**
   * Controladores para los emails.
   * @type {object}
   * @const
   * @requires module:controllers/email.controller
   * @requires express
   */
  const emailService = require("../services/emailService.js");
  var router = require("express").Router();

  /**
   * Ruta para responder un email.
   * @name post/api/email/reply
   * @function
   * @memberof module:Routes/Email
    * @param {string} ruta - La ruta correspondiente.
   * @param {object} req - El objeto de solicitud.
   * @param {object} res - El objeto de respuesta.
   * @param {function} emailService.replyEmail - La función controladora que responder un email.
   */
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
