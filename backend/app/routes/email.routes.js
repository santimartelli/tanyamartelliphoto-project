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
  const whatsappService = require("../services/whatsappService.js");
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
   * Test endpoint for email and WhatsApp functionality - FOR DEBUGGING ONLY
   * @name post/api/email/test
   * @function
   * @memberof module:Routes/Email
   */
  router.post("/test", async (req, res) => {
    console.log("Notification test endpoint called:", req.body);

    const testEmail = req.body.email || process.env.EMAIL_SM;
    const testPhone = req.body.phone || process.env.WHATSAPP_ADMIN_NUMBER;
    const testType = req.body.type || "message";
    const includeWhatsApp = req.body.whatsapp !== false; // Default to true unless explicitly disabled

    if (!testEmail) {
      res.status(400).send({
        message: "Email address required for testing",
        usage: "POST /api/email/test with { email: 'test@example.com', phone: '+34123456789', type: 'message|booking', whatsapp: true }"
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

        const promises = [
          emailService.sendBookingRequestConfirmationEmail(testEmail, testBookingData),
          emailService.sendBookingRequestNotificationEmail(testBookingData)
        ];

        if (includeWhatsApp && testPhone) {
          promises.push(whatsappService.sendBookingNotificationWhatsApp(testBookingData));
        }

        const results = await Promise.allSettled(promises);

        result = {
          confirmationEmail: results[0].status === "fulfilled" ? results[0].value : { error: results[0].reason },
          notificationEmail: results[1].status === "fulfilled" ? results[1].value : { error: results[1].reason }
        };

        if (includeWhatsApp && testPhone) {
          result.whatsappNotification = results[2].status === "fulfilled" ? results[2].value : { error: results[2].reason };
        }
      } else {
        const testMessageData = {
          messageName: "Test User",
          messageEmail: testEmail,
          messageContent: "This is a test message content"
        };

        const promises = [
          emailService.sendMessageConfirmationEmail(testEmail, testMessageData),
          emailService.sendMessageNotificationEmail(testMessageData)
        ];

        if (includeWhatsApp && testPhone) {
          promises.push(whatsappService.sendMessageNotificationWhatsApp(testMessageData));
        }

        const results = await Promise.allSettled(promises);

        result = {
          confirmationEmail: results[0].status === "fulfilled" ? results[0].value : { error: results[0].reason },
          notificationEmail: results[1].status === "fulfilled" ? results[1].value : { error: results[1].reason }
        };

        if (includeWhatsApp && testPhone) {
          result.whatsappNotification = results[2].status === "fulfilled" ? results[2].value : { error: results[2].reason };
        }
      }

      res.status(200).send({
        message: "Notification test completed",
        testType,
        testEmail,
        testPhone: includeWhatsApp ? testPhone : "disabled",
        whatsappEnabled: includeWhatsApp,
        whatsappStatus: whatsappService.getWhatsAppStatus(),
        results: result,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error("Notification test error:", error);
      res.status(500).send({
        message: "Notification test failed",
        error: error.message,
        whatsappStatus: whatsappService.getWhatsAppStatus(),
        timestamp: new Date().toISOString()
      });
    }
  });
  app.use("/api/email", router);
};
