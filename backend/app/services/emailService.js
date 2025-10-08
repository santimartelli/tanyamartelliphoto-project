/**
 * Este archivo contiene el servicio para el envío de emails.
 * @module Services/Email
 */

require("dotenv").config();
const { Resend } = require("resend");

const EMAIL_ENABLED = process.env.EMAIL_ENABLED === "true";
const EMAIL_PROVIDER = "Resend";
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const DEFAULT_SENDER_EMAIL = process.env.RESEND_FROM_EMAIL || process.env.EMAIL_USER;
const DEFAULT_SENDER_NAME = process.env.RESEND_FROM_NAME || "Tanya Martelli Photography";

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

let resendClient = null;

/**
 * Configura el proveedor HTTP utilizado para el envío de emails.
 */
if (EMAIL_ENABLED) {
  if (!RESEND_API_KEY) {
    logEmail("ERROR", "Email service enabled but RESEND_API_KEY is missing", generateRequestId());
  } else if (!DEFAULT_SENDER_EMAIL) {
    logEmail("ERROR", "Email service enabled but RESEND_FROM_EMAIL/EMAIL_USER is missing", generateRequestId());
  } else {
    resendClient = new Resend(RESEND_API_KEY);
    logEmail("INFO", "Email HTTP provider configured", generateRequestId(), {
      provider: EMAIL_PROVIDER,
      defaultSender: DEFAULT_SENDER_EMAIL
    });
  }
} else {
  logEmail("WARN", "Email service disabled, skipping HTTP provider setup", generateRequestId());
}

/**
 * Normaliza un destinatario de email a la estructura esperada por el proveedor HTTP.
 * @param {string|object} entry - El destinatario a normalizar.
 * @returns {{email: string, name?: string}|null} - Objeto con email y nombre opcional.
 */
const normalizeEmailAddress = (entry) => {
  if (!entry) {
    return null;
  }

  if (typeof entry === "string") {
    return { email: entry.trim() };
  }

  if (typeof entry === "object") {
    if (entry.email) {
      return { email: entry.email.trim(), ...(entry.name ? { name: entry.name } : {}) };
    }

    if (entry.address) {
      return { email: entry.address.trim(), ...(entry.name ? { name: entry.name } : {}) };
    }
  }

  return null;
};

/**
 * Construye un listado normalizado de destinatarios.
 * @param {string|object|Array} input - Los destinatarios a procesar.
 * @returns {Array<{email: string, name?: string}>} - Lista normalizada de destinatarios.
 */
const buildRecipientList = (input) => {
  if (!input) {
    return [];
  }

  const values = Array.isArray(input) ? input : [input];
  return values
    .map(normalizeEmailAddress)
    .filter((entry) => entry && isValidEmail(entry.email));
};

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
  const rawRecipients = Array.isArray(mailOptions.to) ? mailOptions.to : [mailOptions.to];
  const invalidEmails = rawRecipients
    .map((entry) => {
      if (typeof entry === "string") {
        return entry;
      }
      if (entry && typeof entry === "object") {
        return entry.email || entry.address;
      }
      return null;
    })
    .filter(Boolean)
    .filter(email => !isValidEmail(email));

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

  if (!EMAIL_ENABLED) {
    logEmail("INFO", "Email send skipped because email service is disabled", reqId, {
      to: mailOptions.to,
      subject: mailOptions.subject
    });
    return {
      success: true,
      skipped: true,
      reason: "Email service disabled",
      requestId: reqId
    };
  }

  if (!RESEND_API_KEY || !resendClient || !DEFAULT_SENDER_EMAIL) {
    logEmail("ERROR", "Email service misconfigured - missing API key, sender email or client", reqId);
    return {
      success: false,
      error: "Email service misconfigured",
      requestId: reqId
    };
  }

  const sender = normalizeEmailAddress(mailOptions.from) || {
    email: DEFAULT_SENDER_EMAIL,
    name: DEFAULT_SENDER_NAME
  };

  const toList = buildRecipientList(mailOptions.to);
  const ccList = buildRecipientList(mailOptions.cc);
  const bccList = buildRecipientList(mailOptions.bcc);
  const replyTo = normalizeEmailAddress(mailOptions.replyTo);
  const recipientEmails = toList.map((entry) => entry.email);

  if (!recipientEmails.length) {
    logEmail("ERROR", "No valid recipients found for email", reqId, {
      originalRecipients: mailOptions.to
    });
    return {
      success: false,
      error: "No valid email recipients",
      requestId: reqId
    };
  }

  logEmail("INFO", "Attempting to send email", reqId, {
    to: recipientEmails,
    subject: mailOptions.subject,
    attempt: retryCount + 1
  });

  try {
    const formatAddressList = (list) => {
      return list.map((entry) => {
        if (entry.name) {
          return `${entry.name} <${entry.email}>`;
        }
        return entry.email;
      });
    };

    const response = await resendClient.emails.send({
      from: sender.name ? `${sender.name} <${sender.email}>` : sender.email,
      to: formatAddressList(toList),
      subject: mailOptions.subject,
      ...(mailOptions.text ? { text: mailOptions.text } : {}),
      ...(mailOptions.html ? { html: mailOptions.html } : {}),
      ...(ccList.length ? { cc: formatAddressList(ccList) } : {}),
      ...(bccList.length ? { bcc: formatAddressList(bccList) } : {}),
      ...(replyTo && isValidEmail(replyTo.email)
        ? { reply_to: replyTo.name ? `${replyTo.name} <${replyTo.email}>` : replyTo.email }
        : {})
    });

    if (response.error) {
      throw new Error(response.error?.message || "Resend returned an error response");
    }

    const messageId = response.data?.id || null;

    logEmail("INFO", "Email sent successfully", reqId, {
      to: recipientEmails,
      subject: mailOptions.subject,
      provider: EMAIL_PROVIDER,
      messageId
    });

    return {
      success: true,
      response: response.data,
      messageId,
      requestId: reqId
    };
  } catch (error) {
    const providerStatus = error.response?.status;
    const providerData = error.response?.data;
    const errorMessage = error.message || providerData?.message || "Unknown error";
    const errorCode = error.code || providerData?.name;

    logEmail("ERROR", `Email sending failed (attempt ${retryCount + 1}/${MAX_RETRIES + 1})`, reqId, {
      to: recipientEmails,
      subject: mailOptions.subject,
      errorCode,
      errorMessage,
      status: providerStatus,
      providerResponse: providerData,
      stack: error.stack
    });

    const isTransientError =
      error.code === "ETIMEDOUT" ||
      error.code === "ECONNRESET" ||
      error.code === "ECONNREFUSED" ||
      error.code === "ESOCKET" ||
      !error.response ||
      (providerStatus && providerStatus >= 500);

    if (retryCount < MAX_RETRIES && isTransientError) {
      logEmail("WARN", `Retrying email send in 2 seconds`, reqId, {
        nextAttempt: retryCount + 2,
        errorCode: error.code,
        status: providerStatus
      });

      await new Promise((resolve) => setTimeout(resolve, 2000));
      return sendEmail(mailOptions, retryCount + 1, reqId);
    }

    logEmail("ERROR", "CRITICAL: Email sending failed definitively - ADMIN ATTENTION REQUIRED", reqId, {
      to: recipientEmails,
      subject: mailOptions.subject,
      finalErrorCode: errorCode,
      finalErrorMessage: errorMessage,
      finalStatus: providerStatus,
      providerResponse: providerData,
      totalAttempts: retryCount + 1,
      adminEmail: process.env.EMAIL_SM
    });

    return {
      success: false,
      error: "Email sending failed after all retries",
      errorCode,
      errorMessage,
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
