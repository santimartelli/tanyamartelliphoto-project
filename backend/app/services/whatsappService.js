/**
 * Este archivo contiene el servicio para el envío de mensajes de WhatsApp.
 * @module Services/WhatsApp
 */

require("dotenv").config();
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const path = require('path');

/**
 * Cliente de WhatsApp Web.js con autenticación local.
 * @type {object}
 * @const
 */
let client = null;
let isClientReady = false;
let isInitializing = false;
const LOCAL_AUTH_NAME = "tanya-martelli-photo";

/**
 * Genera un ID único para trackear requests de WhatsApp.
 * @returns {string} - ID único para el request.
 */
const generateRequestId = () => {
  return `whatsapp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Logger mejorado para WhatsApp con timestamps y request tracking.
 * @param {string} level - Nivel del log (INFO, ERROR, WARN).
 * @param {string} message - Mensaje a loggear.
 * @param {string} requestId - ID del request para tracking.
 * @param {object} data - Datos adicionales para loggear.
 */
const logWhatsApp = (level, message, requestId, data = {}) => {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    level,
    service: "WhatsAppService",
    requestId,
    message,
    ...data
  };

  if (level === "ERROR") {
    console.error(`[${timestamp}] [${level}] [WhatsAppService] [${requestId}] ${message}`, data);
  } else {
    console.log(`[${timestamp}] [${level}] [WhatsAppService] [${requestId}] ${message}`, data);
  }
};

/**
 * Devuelve la configuración de Puppeteer asegurando que existe un ejecutable válido.
 * @param {string} requestId - ID del request para logging.
 * @returns {object} Configuración de Puppeteer.
 */
const getPuppeteerOptions = (requestId) => {
  const candidatePaths = [
    process.env.PUPPETEER_EXECUTABLE_PATH,
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable'
  ];

  let executablePath = null;
  for (const candidate of candidatePaths) {
    if (candidate && fs.existsSync(candidate)) {
      executablePath = candidate;
      break;
    }
  }

  if (executablePath) {
    logWhatsApp("INFO", "Using Chromium executable for WhatsApp client", requestId, {
      executablePath
    });
  } else {
    logWhatsApp("WARN", "Chromium executable not found in expected locations; falling back to Puppeteer's bundled binary", requestId, {
      candidatePaths: candidatePaths.filter(Boolean)
    });
  }

  return {
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--disable-background-networking',
      '--no-first-run',
      '--no-zygote',
      '--disable-gpu'
    ],
    ...(executablePath ? { executablePath } : {})
  };
};

/**
 * Elimina archivos de bloqueo de perfiles Chromium que hayan quedado de sesiones anteriores.
 * @param {string} requestId - ID del request para logging.
 */
const releaseChromiumProfileLock = (requestId) => {
  const authBasePath = process.env.WWEBJS_AUTH_PATH || path.join(process.cwd(), '.wwebjs_auth');
  const sessionCandidates = [
    path.join(authBasePath, `session-${LOCAL_AUTH_NAME}`),
    path.join(authBasePath, 'session') // Legacy default folder created before custom name was set
  ];

  const lockCandidates = [];
  sessionCandidates.forEach((sessionPath) => {
    lockCandidates.push(
      path.join(sessionPath, 'Default', 'SingletonLock'),
      path.join(sessionPath, 'Default', 'SingletonSocket'),
      path.join(sessionPath, 'SingletonLock'),
      path.join(sessionPath, 'SingletonSocket')
    );
  });

  const removedLocks = [];

  for (const lockPath of lockCandidates) {
    if (fs.existsSync(lockPath)) {
      try {
        fs.unlinkSync(lockPath);
        removedLocks.push(lockPath);
      } catch (error) {
        logWhatsApp("WARN", "Unable to remove Chromium profile lock file", requestId, {
          lockPath,
          errorMessage: error.message
        });
      }
    }
  }

  if (removedLocks.length > 0) {
    logWhatsApp("INFO", "Removed stale Chromium profile lock files", requestId, {
      files: removedLocks
    });
  }
};

/**
 * Inicializa el cliente de WhatsApp si no está ya inicializado.
 * @returns {Promise<void>}
 */
const initializeClient = () => {
  return new Promise((resolve, reject) => {
    if (isClientReady) {
      resolve();
      return;
    }

    if (isInitializing) {
      // Wait for initialization to complete
      const checkReady = setInterval(() => {
        if (isClientReady || !isInitializing) {
          clearInterval(checkReady);
          if (isClientReady) {
            resolve();
          } else {
            reject(new Error('WhatsApp client initialization failed'));
          }
        }
      }, 1000);
      return;
    }

    let hasSettled = false;
    const initRequestId = generateRequestId();

    const safeResolve = () => {
      if (!hasSettled) {
        hasSettled = true;
        resolve();
      }
    };

    const safeReject = (error) => {
      if (!hasSettled) {
        hasSettled = true;
        isClientReady = false;
        isInitializing = false;
        client = null;
        reject(error);
      }
    };

    isInitializing = true;

    const puppeteerOptions = getPuppeteerOptions(initRequestId);
    releaseChromiumProfileLock(initRequestId);

    client = new Client({
      authStrategy: new LocalAuth({
        name: LOCAL_AUTH_NAME
      }),
      puppeteer: puppeteerOptions
    });

    client.on('qr', (qr) => {
      console.log('\n🔔 SCAN THE QR CODE BELOW TO CONNECT WHATSAPP:');
      qrcode.generate(qr, { small: true });
      console.log('\nOpen WhatsApp on your phone and scan the QR code above');
    });

    client.on('ready', () => {
      logWhatsApp("INFO", "WhatsApp client is ready", initRequestId);
      isClientReady = true;
      isInitializing = false;
      safeResolve();
    });

    client.on('authenticated', () => {
      logWhatsApp("INFO", "WhatsApp authenticated successfully", initRequestId);
    });

    client.on('auth_failure', (msg) => {
      logWhatsApp("ERROR", "WhatsApp authentication failed", initRequestId, { message: msg });
      safeReject(new Error(`WhatsApp authentication failed: ${msg}`));
    });

    client.on('disconnected', (reason) => {
      logWhatsApp("WARN", "WhatsApp client disconnected", initRequestId, { reason });
      isClientReady = false;
      isInitializing = false;
    });

    client.initialize().catch((error) => {
      logWhatsApp("ERROR", "WhatsApp client initialization threw an error", initRequestId, {
        errorMessage: error.message,
        stack: error.stack
      });
      safeReject(error);
    });
  });
};

/**
 * Valida si un número de WhatsApp tiene un formato válido.
 * @param {string} phoneNumber - El número de teléfono a validar.
 * @returns {boolean} - True si el número es válido, false en caso contrario.
 */
const isValidPhoneNumber = (phoneNumber) => {
  // Remove all non-numeric characters
  const cleanNumber = phoneNumber.replace(/\D/g, '');

  // Check if it's a valid international format (8-15 digits)
  if (cleanNumber.length < 8 || cleanNumber.length > 15) {
    return false;
  }

  // Should start with country code (not starting with 0)
  if (cleanNumber.startsWith('0')) {
    return false;
  }

  return true;
};

/**
 * Formatea un número de teléfono para WhatsApp.
 * @param {string} phoneNumber - El número de teléfono a formatear.
 * @returns {string} - Número formateado para WhatsApp.
 */
const formatPhoneNumber = (phoneNumber) => {
  // Remove all non-numeric characters
  let cleanNumber = phoneNumber.replace(/\D/g, '');

  // If number doesn't start with country code, add default (Spain +34)
  if (cleanNumber.length === 9 && !cleanNumber.startsWith('34')) {
    cleanNumber = '34' + cleanNumber;
  }

  return cleanNumber + '@c.us';
};

/**
 * Envía un mensaje de WhatsApp con los datos especificados.
 * @param {string} phoneNumber - Número de teléfono del destinatario.
 * @param {string} message - Contenido del mensaje.
 * @param {number} [retryCount=0] - Número de intentos realizados para enviar el mensaje.
 * @param {string} [requestId] - ID del request para tracking.
 * @returns {Promise<object>} - Devuelve una promesa con la respuesta del servicio y status.
 */
const sendWhatsAppMessage = async (phoneNumber, message, retryCount = 0, requestId = null) => {
  const MAX_RETRIES = 3;
  const reqId = requestId || generateRequestId();

  // Validar número de teléfono antes de enviar
  if (!isValidPhoneNumber(phoneNumber)) {
    logWhatsApp("ERROR", "WhatsApp phone number validation failed", reqId, {
      phoneNumber,
      message: message.substring(0, 100) + "..."
    });
    return {
      success: false,
      error: "Invalid phone number format",
      details: phoneNumber,
      requestId: reqId
    };
  }

  const formattedNumber = formatPhoneNumber(phoneNumber);

  logWhatsApp("INFO", "Attempting to send WhatsApp message", reqId, {
    to: formattedNumber,
    messagePreview: message.substring(0, 100) + "...",
    attempt: retryCount + 1
  });

  try {
    // Initialize client if not ready
    if (!isClientReady) {
      logWhatsApp("INFO", "Initializing WhatsApp client", reqId);
      await initializeClient();
    }

    // Send the message
    const response = await client.sendMessage(formattedNumber, message);

    logWhatsApp("INFO", "WhatsApp message sent successfully", reqId, {
      to: formattedNumber,
      messageId: response.id.id,
      timestamp: response.timestamp
    });

    return {
      success: true,
      response: response,
      messageId: response.id.id,
      requestId: reqId
    };

  } catch (error) {
    logWhatsApp("ERROR", `WhatsApp message sending failed (attempt ${retryCount + 1}/${MAX_RETRIES + 1})`, reqId, {
      to: formattedNumber,
      errorMessage: error.message,
      errorCode: error.code,
      stack: error.stack
    });

    // Retry logic for transient errors
    if (
      retryCount < MAX_RETRIES &&
      (error.message.includes('timeout') ||
       error.message.includes('connection') ||
       error.message.includes('network') ||
       error.code === 'ECONNRESET' ||
       error.code === 'ETIMEDOUT')
    ) {
      logWhatsApp("WARN", `Retrying WhatsApp message send in 3 seconds`, reqId, {
        nextAttempt: retryCount + 2,
        errorMessage: error.message
      });

      // Wait for 3 seconds before retrying
      await new Promise((resolve) => setTimeout(resolve, 3000));
      return sendWhatsAppMessage(phoneNumber, message, retryCount + 1, reqId);
    }

    // Final failure - log critical error for admin attention
    logWhatsApp("ERROR", "CRITICAL: WhatsApp message sending failed definitively - ADMIN ATTENTION REQUIRED", reqId, {
      to: formattedNumber,
      finalErrorMessage: error.message,
      finalErrorCode: error.code,
      totalAttempts: retryCount + 1,
      adminPhone: process.env.WHATSAPP_ADMIN_NUMBER
    });

    // Return failure but don't throw to prevent app crashes
    return {
      success: false,
      error: "WhatsApp message sending failed after all retries",
      errorMessage: error.message,
      errorCode: error.code,
      requestId: reqId,
      attempts: retryCount + 1
    };
  }
};

/**
 * Envía una notificación de WhatsApp al administrador sobre un nuevo mensaje.
 * @param {object} messageData - Los datos del mensaje.
 * @returns {Promise} - Promesa que se resuelve cuando se intenta enviar el mensaje.
 */
exports.sendMessageNotificationWhatsApp = async (messageData) => {
  const requestId = generateRequestId();
  const adminPhone = process.env.WHATSAPP_ADMIN_NUMBER;

  if (!adminPhone) {
    logWhatsApp("ERROR", "WhatsApp admin number not configured", requestId);
    return {
      success: false,
      error: "WhatsApp admin number not configured",
      requestId
    };
  }

  logWhatsApp("INFO", "Starting message notification WhatsApp to admin", requestId, {
    senderName: messageData.messageName,
    senderEmail: messageData.messageEmail,
    adminPhone
  });

  const message = `🔔 *Nuevo Mensaje - Tanya Martelli Photography*

👤 *De:* ${messageData.messageName}
📧 *Email:* ${messageData.messageEmail}

💬 *Mensaje:*
${messageData.messageContent}

---
📱 Notificación automática del sitio web`;

  try {
    const result = await sendWhatsAppMessage(adminPhone, message, 0, requestId);
    if (!result.success) {
      logWhatsApp("ERROR", "Message notification WhatsApp to admin failed", requestId, result);
    }
    return result;
  } catch (err) {
    logWhatsApp("ERROR", "Unexpected error in sendMessageNotificationWhatsApp", requestId, {
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
 * Envía una notificación de WhatsApp al administrador sobre una nueva reserva.
 * @param {object} bookingData - Los datos de la reserva.
 * @returns {Promise} - Promesa que se resuelve cuando se intenta enviar el mensaje.
 */
exports.sendBookingNotificationWhatsApp = async (bookingData) => {
  const requestId = generateRequestId();
  const adminPhone = process.env.WHATSAPP_ADMIN_NUMBER;

  if (!adminPhone) {
    logWhatsApp("ERROR", "WhatsApp admin number not configured", requestId);
    return {
      success: false,
      error: "WhatsApp admin number not configured",
      requestId
    };
  }

  logWhatsApp("INFO", "Starting booking notification WhatsApp to admin", requestId, {
    clientName: bookingData.name,
    clientEmail: bookingData.email,
    sessionType: bookingData.sesion,
    date: bookingData.selectedDate,
    adminPhone
  });

  const message = `📅 *Nueva Reserva - Tanya Martelli Photography*

👤 *Cliente:* ${bookingData.name}
📧 *Email:* ${bookingData.email}
📸 *Sesión:* ${bookingData.sesion}
📍 *Localidad:* ${bookingData.location}
🏠 *Lugar:* ${bookingData.place}
📆 *Fecha:* ${bookingData.selectedDate}
🕐 *Hora:* ${bookingData.selectedTime}

${bookingData.message ? `💬 *Mensaje adicional:*\n${bookingData.message}` : ''}

---
📱 Notificación automática del sitio web`;

  try {
    const result = await sendWhatsAppMessage(adminPhone, message, 0, requestId);
    if (!result.success) {
      logWhatsApp("ERROR", "Booking notification WhatsApp to admin failed", requestId, result);
    }
    return result;
  } catch (err) {
    logWhatsApp("ERROR", "Unexpected error in sendBookingNotificationWhatsApp", requestId, {
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
 * Cierra la conexión del cliente de WhatsApp.
 * @returns {Promise<void>}
 */
exports.closeWhatsAppClient = async () => {
  if (client && isClientReady) {
    console.log('🔌 Closing WhatsApp client...');
    await client.destroy();
    isClientReady = false;
    client = null;
  }
};

/**
 * Obtiene el estado del cliente de WhatsApp.
 * @returns {object} - Estado del cliente.
 */
exports.getWhatsAppStatus = () => {
  return {
    isReady: isClientReady,
    isInitializing: isInitializing,
    hasClient: !!client
  };
};
