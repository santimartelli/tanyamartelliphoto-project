/**
 * Este archivo contiene el servicio para el envío de emails.
 * @module Services/Email
 */

require("dotenv").config();
const nodemailer = require("nodemailer");

/**
 * Valida si un email tiene un formato válido.
 * @param {string} email - La dirección de email a validar.
 * @returns {boolean} - True si el email es válido, false en caso contrario.
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Genera un ID único para trackear requests de email.
 * @returns {string} - ID único para el request.
 */
const generateRequestId = () => {
  return `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Logger mejorado para emails con timestamps y request tracking.
 * @param {string} level - Nivel del log (INFO, ERROR, WARN).
 * @param {string} message - Mensaje a loggear.
 * @param {string} requestId - ID del request para tracking.
 * @param {object} data - Datos adicionales para loggear.
 */
const logEmail = (level, message, requestId, data = {}) => {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    level,
    service: "EmailService",
    requestId,
    message,
    ...data
  };

  if (level === "ERROR") {
    console.error(`[${timestamp}] [${level}] [EmailService] [${requestId}] ${message}`, data);
  } else {
    console.log(`[${timestamp}] [${level}] [EmailService] [${requestId}] ${message}`, data);
  }
};

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
 * @param {string} [requestId] - ID del request para tracking.
 * @memberof Services/Email
 * @returns {Promise<object>} - Devuelve una promesa con la respuesta del servidor y status.
 */
const sendEmail = async (mailOptions, retryCount = 0, requestId = null) => {
  const MAX_RETRIES = 3;
  const reqId = requestId || generateRequestId();

  // Validar emails antes de enviar
  const recipients = Array.isArray(mailOptions.to) ? mailOptions.to : [mailOptions.to];
  const invalidEmails = recipients.filter(email => !isValidEmail(email));

  if (invalidEmails.length > 0) {
    logEmail("ERROR", "Email validation failed", reqId, {
      invalidEmails,
      subject: mailOptions.subject
    });
    return {
      success: false,
      error: "Invalid email addresses",
      details: invalidEmails,
      requestId: reqId
    };
  }

  logEmail("INFO", "Attempting to send email", reqId, {
    to: mailOptions.to,
    subject: mailOptions.subject,
    attempt: retryCount + 1
  });

  try {
    const info = await transporter.sendMail(mailOptions);
    logEmail("INFO", "Email sent successfully", reqId, {
      to: mailOptions.to,
      subject: mailOptions.subject,
      messageId: info.messageId,
      response: info.response
    });

    return {
      success: true,
      response: info.response,
      messageId: info.messageId,
      requestId: reqId
    };
  } catch (error) {
    logEmail("ERROR", `Email sending failed (attempt ${retryCount + 1}/${MAX_RETRIES + 1})`, reqId, {
      to: mailOptions.to,
      subject: mailOptions.subject,
      errorCode: error.code,
      errorMessage: error.message,
      stack: error.stack
    });

    // Retry logic for transient errors like connection timeouts
    if (
      retryCount < MAX_RETRIES &&
      (error.code === "ETIMEDOUT" || error.code === "ECONNRESET" || error.code === "ECONNREFUSED" || error.code === "ESOCKET")
    ) {
      logEmail("WARN", `Retrying email send in 2 seconds`, reqId, {
        nextAttempt: retryCount + 2,
        errorCode: error.code
      });

      // Wait for 2 seconds before retrying
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return sendEmail(mailOptions, retryCount + 1, reqId);
    }

    // Final failure - log critical error for admin attention
    logEmail("ERROR", "CRITICAL: Email sending failed definitively - ADMIN ATTENTION REQUIRED", reqId, {
      to: mailOptions.to,
      subject: mailOptions.subject,
      finalErrorCode: error.code,
      finalErrorMessage: error.message,
      totalAttempts: retryCount + 1,
      adminEmail: process.env.EMAIL_SM
    });

    // Return failure but don't throw to prevent app crashes
    return {
      success: false,
      error: "Email sending failed after all retries",
      errorCode: error.code,
      errorMessage: error.message,
      requestId: reqId,
      attempts: retryCount + 1
    };
  }
};

/**
 * Envia un email de confirmación al remitente.
 * @param {string} recipentEmail - La dirección de email del remitente.
 * @param {object} messageData - Los datos del mensaje.
 * @returns {Promise} - Promesa que se resuelve cuando se intenta enviar el email.
 */
exports.sendMessageConfirmationEmail = async (recipentEmail, messageData) => {
  const requestId = generateRequestId();

  logEmail("INFO", "Starting message confirmation email", requestId, {
    recipient: recipentEmail,
    senderName: messageData.messageName
  });

  const mailOptions = {
    from: {
      name: "Tanya Martelli Photography",
      address: process.env.EMAIL_USER,
    },
    to: recipentEmail,
    bcc: process.env.EMAIL_SM,
    subject: "Hemos recibido tu mensaje!",
    text: `Hola ${messageData.messageName}!\n\nGracias por contactar con nosotros, te contestaremos lo antes posible.\n\nSaludos!\n\nTatiana - Tanya Martelli Photography`,
  };

  try {
    const result = await sendEmail(mailOptions, 0, requestId);
    if (!result.success) {
      logEmail("ERROR", "Message confirmation email failed", requestId, result);
    }
    return result;
  } catch (err) {
    logEmail("ERROR", "Unexpected error in sendMessageConfirmationEmail", requestId, {
      error: err.message,
      stack: err.stack
    });
    return {
      success: false,
      error: "Unexpected error occurred",
      requestId
    };
  }
};

/**
 * Envia un email de notificación al administrador.
 * @param {object} messageData - Los datos del mensaje.
 * @returns {Promise} - Promesa que se resuelve cuando se intenta enviar el email.
 */
exports.sendMessageNotificationEmail = async (messageData) => {
  const requestId = generateRequestId();

  logEmail("INFO", "Starting message notification email to admin", requestId, {
    senderName: messageData.messageName,
    senderEmail: messageData.messageEmail,
    admin: process.env.EMAIL_USER
  });

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

  try {
    const result = await sendEmail(mailOptions, 0, requestId);
    if (!result.success) {
      logEmail("ERROR", "Message notification email to admin failed", requestId, result);
    }
    return result;
  } catch (err) {
    logEmail("ERROR", "Unexpected error in sendMessageNotificationEmail", requestId, {
      error: err.message,
      stack: err.stack
    });
    return {
      success: false,
      error: "Unexpected error occurred",
      requestId
    };
  }
};

/**
 * Envia un email de confirmación al remitente de la recepción de la solicitud de reserva.
 * @param {string} recipentEmail - Las direcciones donde se enviará el email.
 * @param {object} bookingData - Los datos de la solicitud de reserva.
 * @returns {Promise} - Promesa que se resuelve cuando se intenta enviar el email.
 */
exports.sendBookingRequestConfirmationEmail = async (recipentEmail, bookingData) => {
  const requestId = generateRequestId();

  logEmail("INFO", "Starting booking request confirmation email", requestId, {
    recipient: recipentEmail,
    clientName: bookingData.name,
    sessionType: bookingData.sesion,
    date: bookingData.selectedDate
  });

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

  try {
    const result = await sendEmail(mailOptions, 0, requestId);
    if (!result.success) {
      logEmail("ERROR", "Booking request confirmation email failed", requestId, result);
    }
    return result;
  } catch (err) {
    logEmail("ERROR", "Unexpected error in sendBookingRequestConfirmationEmail", requestId, {
      error: err.message,
      stack: err.stack
    });
    return {
      success: false,
      error: "Unexpected error occurred",
      requestId
    };
  }
};

/**
 * Envia un email de notificación al administrador sobre la recepción de una solicitud de reserva.
 * @param {object} bookingData - Los datos de la solicitud de reserva.
 * @returns {Promise} - Promesa que se resuelve cuando se intenta enviar el email.
 */
exports.sendBookingRequestNotificationEmail = async (bookingData) => {
  const requestId = generateRequestId();

  logEmail("INFO", "Starting booking request notification email to admin", requestId, {
    clientName: bookingData.name,
    clientEmail: bookingData.email,
    sessionType: bookingData.sesion,
    date: bookingData.selectedDate,
    admin: process.env.EMAIL_USER
  });

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

  try {
    const result = await sendEmail(mailOptions, 0, requestId);
    if (!result.success) {
      logEmail("ERROR", "Booking request notification email to admin failed", requestId, result);
    }
    return result;
  } catch (err) {
    logEmail("ERROR", "Unexpected error in sendBookingRequestNotificationEmail", requestId, {
      error: err.message,
      stack: err.stack
    });
    return {
      success: false,
      error: "Unexpected error occurred",
      requestId
    };
  }
};

/**
 * Responde a un mensaje por email.
 * @param {string} recipentEmail - Las direcciones donde se enviará el email.
 * @param {object} messageData - Los datos del mensaje.
 * @returns {Promise} - Promesa que se resuelve cuando se intenta enviar el email.
 */
exports.replyEmail = async (recipentEmail, messageData) => {
  const requestId = generateRequestId();

  logEmail("INFO", "Starting reply email", requestId, {
    recipient: recipentEmail,
    originalSender: messageData.name
  });

  const mailOptions = {
    from: {
      name: "Tanya Martelli Photography",
      address: process.env.EMAIL_USER,
    },
    to: recipentEmail,
    subject: `Hola, ${messageData.name}!`,
    text: `${messageData.message}\n\nSaludos!\n\nTatiana - Tanya Martelli Photography\n\n\n***Esta es una respuesta al mensaje de abajo***\n\n${messageData.name}\n${messageData.email}\n${messageData.messageContent}`,
  };

  try {
    const result = await sendEmail(mailOptions, 0, requestId);
    if (!result.success) {
      logEmail("ERROR", "Reply email failed", requestId, result);
    }
    return result;
  } catch (err) {
    logEmail("ERROR", "Unexpected error in replyEmail", requestId, {
      error: err.message,
      stack: err.stack
    });
    return {
      success: false,
      error: "Unexpected error occurred",
      requestId
    };
  }
};
