/**
 * Este archivo contiene el servicio para el envío de emails.
 * @module Services/Email
 */

require("dotenv").config();
const nodemailer = require("nodemailer");

/**
 * Crea el transportador de emails con los datos de autenticación.
 * @type {object}
 * @const
 * @property {string} service - El servicio de email.
 * @property {string} host - El servidor de email.
 * @property {number} port - El puerto del servidor de email.
 * @property {boolean} secure - Un valor booleano que indica si el servidor de email es seguro.
 * @property {object} auth - Las credenciales de autenticación.
 * @property {string} auth.user - El usuario del email.
 * @property {string} auth.pass - La contraseña del usuario del email.
 * @memberof Services/Email
 */
const transporter = nodemailer.createTransport({
  service: process.env.NODEMAILER_SERVICE,
  host: process.env.NODEMAILER_HOST,
  port: process.env.NODEMAILER_PORT,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  // Adding timeout option to prevent hanging connections
  connectionTimeout: 10000, // 10 seconds
  greetingTimeout: 10000,
});

/**
 * Envia un email con los datos especificados.
 * @param {object} mailOptions - Las opciones del email.
 * @param {string} mailOptions.from - El remitente del email.
 * @param {string} mailOptions.to - El destinatario del email.
 * @param {string} mailOptions.subject - El asunto del email.
 * @param {string} mailOptions.text - El contenido del email.
 * @param {number} [retryCount=0] - Número de intentos realizados para enviar el email.
 * @memberof Services/Email
 * @returns {Promise<string>} - Devuelve una promesa con la respuesta del servidor.
 */
const sendEmail = async (mailOptions, retryCount = 0) => {
  const MAX_RETRIES = 3;

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email enviado:", info.response);
    return info.response;
  } catch (error) {
    console.error(`Error enviando email (intento ${retryCount + 1}/${MAX_RETRIES + 1}):`, error);

    // Retry logic for transient errors like connection timeouts
    if (
      retryCount < MAX_RETRIES &&
      (error.code === "ETIMEDOUT" || error.code === "ECONNRESET" || error.code === "ECONNREFUSED")
    ) {
      console.log(`Reintentando envío de email en 2 segundos...`);
      // Wait for 2 seconds before retrying
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return sendEmail(mailOptions, retryCount + 1);
    }

    // Log the error but don't reject the promise to prevent app crashes
    console.error("Fallo definitivo al enviar email:", error);
    return "Email sending failed, but operation continued";
  }
};

/**
 * Envia un email de confirmación al remitente.
 * @param {string} recipentEmail - La dirección de email del remitente.
 * @param {object} messageData - Los datos del mensaje.
 * @returns {Promise} - Promesa que se resuelve cuando se intenta enviar el email.
 */
exports.sendMessageConfirmationEmail = (recipentEmail, messageData) => {
  const mailOptions = {
    from: {
      name: "Tanya Martelli Photography",
      address: process.env.EMAIL_USER,
    },
    to: [recipentEmail],
    bcc: process.env.EMAIL_SM,
    subject: "Hemos recibido tu mensaje!",
    text: `Hola ${messageData.messageName}!\n\nGracias por contactar con nosotros, te contestaremos lo antes posible.\n\nSaludos!\n\nTatiana - Tanya Martelli Photography`,
  };
  // Return promise but don't wait for it - non-blocking
  return sendEmail(mailOptions).catch((err) => {
    console.error("Error en sendMessageConfirmationEmail:", err);
    // Prevent unhandled promise rejection
    return null;
  });
};

/**
 * Envia un email de notificación al administrador.
 * @param {object} messageData - Los datos del mensaje.
 * @returns {Promise} - Promesa que se resuelve cuando se intenta enviar el email.
 */
exports.sendMessageNotificationEmail = (messageData) => {
  const mailOptions = {
    from: {
      name: "Tanya Martelli Photography",
      address: process.env.EMAIL_USER,
    },
    to: process.env.EMAIL_USER,
    bcc: process.env.EMAIL_SM,
    subject: "Tanya Martelli Photography - Nuevo mensaje de: " + messageData.messageName,
    text: `Has recibido un nuevo mensaje de ${messageData.messageName} (${messageData.messageEmail}):\n\n${messageData.messageContent}`,
  };
  return sendEmail(mailOptions).catch((err) => {
    console.error("Error en sendMessageNotificationEmail:", err);
    return null;
  });
};

/**
 * Envia un email de confirmación al remitente de la recepción de la solicitud de reserva.
 * @param {string} recipentEmail - Las direcciones donde se enviará el email.
 * @param {object} bookingData - Los datos de la solicitud de reserva.
 * @returns {Promise} - Promesa que se resuelve cuando se intenta enviar el email.
 */
exports.sendBookingRequestConfirmationEmail = (recipentEmail, bookingData) => {
  const mailOptions = {
    from: {
      name: "Tanya Martelli Photography",
      address: process.env.EMAIL_USER,
    },
    to: recipentEmail,
    bcc: process.env.EMAIL_SM,
    subject: "Hemos recibido tu solicitud de reserva!",
    text: `Hola ${bookingData.name}!\n\nGracias por tu solicitud de reserva, nos pondremos en contacto contigo a la brevedad para profundizar en los detalles.\n\nSaludos!\n\nTatiana - Tanya Martelli Photography`,
  };
  return sendEmail(mailOptions).catch((err) => {
    console.error("Error en sendBookingRequestConfirmationEmail:", err);
    return null;
  });
};

/**
 * Envia un email de notificación al administrador sobre la recepción de una solicitud de reserva.
 * @param {object} bookingData - Los datos de la solicitud de reserva.
 * @returns {Promise} - Promesa que se resuelve cuando se intenta enviar el email.
 */
exports.sendBookingRequestNotificationEmail = (bookingData) => {
  const mailOptions = {
    from: {
      name: "Tanya Martelli Photography",
      address: process.env.EMAIL_USER,
    },
    to: process.env.EMAIL_USER,
    bcc: process.env.EMAIL_SM,
    subject: "Tanya Martelli Photography - New booking request received from " + bookingData.name,
    text: `Has recibido una nueva solicitud de reserva, los detalles son los siguientes:\n\nNombre: ${bookingData.name}\nEmail: ${bookingData.email}\nTipo de sesión: ${bookingData.sesion}\nLocalidad: ${bookingData.location}\nLocalización: ${bookingData.place}\nFecha: ${bookingData.selectedDate}\nHora: ${bookingData.selectedTime}\n\nMensaje: ${bookingData.message}`,
  };
  return sendEmail(mailOptions).catch((err) => {
    console.error("Error en sendBookingRequestNotificationEmail:", err);
    return null;
  });
};

/**
 * Responde a un mensaje por email.
 * @param {string} recipentEmail - Las direcciones donde se enviará el email.
 * @param {object} messageData - Los datos del mensaje.
 * @returns {Promise} - Promesa que se resuelve cuando se intenta enviar el email.
 */
exports.replyEmail = (recipentEmail, messageData) => {
  const mailOptions = {
    from: {
      name: "Tanya Martelli Photography",
      address: process.env.EMAIL_USER,
    },
    to: recipentEmail,
    subject: `Hola, ${messageData.name}!`,
    text: `${messageData.message}\n\nSaludos!\n\nTatiana - Tanya Martelli Photography\n\n\n***Esta es una respuesta al mensaje de abajo***\n\n${messageData.name}\n${messageData.email}\n${messageData.messageContent}`,
  };
  return sendEmail(mailOptions).catch((err) => {
    console.error("Error en replyEmail:", err);
    return null;
  });
};
