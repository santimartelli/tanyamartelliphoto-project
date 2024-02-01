/**
 * @fileoverview Este archivo contiene el servicio para el envío de emails.
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
      console.error("Error enviando email:", error);
      reject(error);
    } else {
      console.log("Email enviado:", info.response);
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
    subject: "Hemos recibido tu mensaje!",
    text: `Hola ${messageData.messageName}!\n\nGracias por contactar con nosotros, te contestaremos lo antes posible.\n\nSaludos!\n\nTatiana - Tanya Martelli Photography`,
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
      "Tanya Martelli Photography - Nuevo mensaje de: " +
      messageData.messageName,
    text: `Has recibido un nuevo mensaje de ${messageData.messageName} (${messageData.messageEmail}):\n\n${messageData.messageContent}`,
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
    subject: "Hemos recibido tu solicitud de reserva!",
    text: `Hola ${bookingData.name}!\n\nGracias por tu solicitud de reserva, nos pondremos en contacto contigo a la brevedad para profundizar en los detalles.\n\nSaludos!\n\nTatiana - Tanya Martelli Photography`,
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
    text: `Has recibido una nueva solicitud de reserva, los detalles son los siguientes:\n\nNombre: ${bookingData.name}\nEmail: ${bookingData.email}\nCategoría: ${bookingData.categoryId}\nLocalidad: ${bookingData.location}\nLocalización: ${bookingData.place}\nFecha: ${bookingData.selectedDate}\nHora: ${bookingData.selectedTime}\n\nMensaje: ${bookingData.message}`,
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
    subject: `Hola, ${messageData.name}!`,
    text: `${messageData.message}\n\nSaludos!\n\nTatiana - Tanya Martelli Photography\n\n\n***Esta es una respuesta al mensaje de abajo***\n\n${messageData.name}\n${messageData.email}\n${messageData.messageContent}`,
  };
  sendEmail(mailOptions);
};
