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
  router.post("/reply", async (req, res) => {
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

    // Send email asynchronously
    emailService.replyEmail(req.body.email, req.body)
      .then(result => {
        if (result.success) {
          console.log("Successfully sent reply email:", result.requestId);
        } else {
          console.error("Failed to send reply email:", result);
        }
      })
      .catch(error => console.error("Unexpected error sending reply email:", error));
  });

  /**
   * Test endpoint for email functionality - FOR DEBUGGING ONLY
   * @name post/api/email/test
   * @function
   * @memberof module:Routes/Email
   */
  router.post("/test", async (req, res) => {
    console.log("Email test endpoint called:", req.body);

    const testEmail = req.body.email || process.env.EMAIL_SM;
    const testType = req.body.type || "message";

    if (!testEmail) {
      res.status(400).send({
        message: "Email address required for testing",
        usage: "POST /api/email/test with { email: 'test@example.com', type: 'message|booking' }"
      });
      return;
    }

    try {
      let result;

      if (testType === "booking") {
        const testBookingData = {
          name: "Test User",
          email: testEmail,
          sesion: "Test Session",
          location: "Test Location",
          place: "Test Place",
          selectedDate: "2024-01-01",
          selectedTime: "10:00",
          message: "This is a test booking message"
        };

        const [confirmResult, notifyResult] = await Promise.allSettled([
          emailService.sendBookingRequestConfirmationEmail(testEmail, testBookingData),
          emailService.sendBookingRequestNotificationEmail(testBookingData)
        ]);

        result = {
          confirmationEmail: confirmResult.status === "fulfilled" ? confirmResult.value : { error: confirmResult.reason },
          notificationEmail: notifyResult.status === "fulfilled" ? notifyResult.value : { error: notifyResult.reason }
        };
      } else {
        const testMessageData = {
          messageName: "Test User",
          messageEmail: testEmail,
          messageContent: "This is a test message content"
        };

        const [confirmResult, notifyResult] = await Promise.allSettled([
          emailService.sendMessageConfirmationEmail(testEmail, testMessageData),
          emailService.sendMessageNotificationEmail(testMessageData)
        ]);

        result = {
          confirmationEmail: confirmResult.status === "fulfilled" ? confirmResult.value : { error: confirmResult.reason },
          notificationEmail: notifyResult.status === "fulfilled" ? notifyResult.value : { error: notifyResult.reason }
        };
      }

      res.status(200).send({
        message: "Email test completed",
        testType,
        testEmail,
        results: result,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error("Email test error:", error);
      res.status(500).send({
        message: "Email test failed",
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  });
  app.use("/api/email", router);
};
