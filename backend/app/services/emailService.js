/**
 * Modulo que envia emails a traves de nodemailer.
 * @module emailService
 */

require("dotenv").config();
const nodemailer = require("nodemailer");

/**
 * Crea el transportador de emails con los datos de autenticación.
 * @type {import("nodemailer").Transporter}
 */
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Envia un email con los datos especificados.
 * @param {import("nodemailer").SendMailOptions} mailOptions - Las opciones del email.
 * @returns {Promise<string>} - Devuelve una promesa con la respuesta del servidor.
 */
const sendEmail = (mailOptions) => {
  return new Promise((resolve, reject)=> {
    transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      reject(error);
    } else {
      console.log("Email sent:", info.response);
      resolve(info.response);
    }
  });
});
};

/**
 * Envia un email de confirmación al remitente.
 * @param {string} recipentEmail - La dirección de email del remitente.
 * @param {object} messageData - Los datos del mensaje.
 */
exports.sendMessageConfirmationEmail = (recipentEmail, messageData) => {
  const mailOptions = {
    from: {
      name: "Tanya Martelli Photography",
      address: "santimartelli@gmail.com",
    },
    to: [
      "santimartelli@gmail.com",
      "tanyamartelliphoto@gmail.com",
      recipentEmail,
    ],
    subject: "We received your message!",
    text: `Hello ${messageData.messageName},\n\nThank you for reaching out to us. We have received your message and will get back to you soon.\n\nBest regards,\n\nTatiana from Tanya Martelli Photography Team`,
  };
  sendEmail(mailOptions);
};

/**
 * Envia un email de notificación al administrador.
 * @param {object} messageData - Los datos del mensaje.
 */
exports.sendMessageNotificationEmail = (messageData) => {
  const mailOptions = {
    from: {
      name: "Tanya Martelli Photography",
      address: "santimartelli@gmail.com",
    },
    to: ["santimartelli@gmail.com", "tanyamartelliphoto@gmail.com"],
    subject:
      "Tanya Martelli Photography - New message received from " +
      messageData.messageName,
    text: `You have received a new message from ${messageData.messageName} (${messageData.messageEmail}):\n\n${messageData.messageContent}`,
  };
  sendEmail(mailOptions);
};

/**
 * Envia un email de confirmación al remitente de la recepción de la solicitud de reserva.
 * @param {string[]} to - La dirección de email del remitente.
 * @param {object} bookingData - Los datos de la solicitud de reserva.
 */
exports.sendBookingRequestConfirmationEmail = (to, bookingData) => {
  const mailOptions = {
    from: {
      name: "Tanya Martelli Photography",
      address: "santimartelli@gmail.com",
    },
    to: to,
    subject: "We received your booking request!",
    text: `Hello ${bookingData.name},\n\nThank you for your booking request. We will get back to you soon to finalize the details.\n\nBest regards!\n\nTatiana, from Tanya Martelli Photography Team`,
  };
  sendEmail(mailOptions);
};

/**
 * Envia un email de notificación al administrador sobre la recepción de una solicitud de reserva.
 * @param {object} bookingData - Los datos de la solicitud de reserva.
 */
exports.sendBookingRequestNotificationEmail = (bookingData) => {
  const mailOptions = {
    from: {
      name: "Tanya Martelli Photography",
      address: "santimartelli@gmail.com",
    },
    to: ["santimartelli@gmail.com", "tanyamartelliphoto@gmail.com"],
    subject:
      "Tanya Martelli Photography - New booking request received from " +
      bookingData.name,
    text: `You have received a new booking request with the following details:\n\nName: ${bookingData.name}\nEmail: ${bookingData.email}\nCategory: ${bookingData.categoryId}\nLocation: ${bookingData.location}\nPlace: ${bookingData.place}\nDate: ${bookingData.selectedDate}\nTime: ${bookingData.selectedTime}\n\nMessage: ${bookingData.message}`,
  };
  sendEmail(mailOptions);
};

/**
 * Responde a un mensaje por email.
 * @param {string[]} to - La dirección de email del remitente.
 * @param {object} messageData - Los datos del mensaje.
 */
exports.replyEmail = (to, messageData) => {
  const mailOptions = {
    from: {
      name: "Tanya Martelli Photography",
      address: "santimartelli@gmail.com",
    },
    to: to,
    subject: `Hello, ${messageData.name}!`,
    text: `${messageData.message}\n\nBest regards!\n\nTatiana, from Tanya Martelli Photography Team\n\n\n***This is an answer to the message below***\n\n${messageData.name}\n${messageData.email}\n${messageData.messageContent}`,
  };
  sendEmail(mailOptions);
};
