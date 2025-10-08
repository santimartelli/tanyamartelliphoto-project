/**
 * Servicio para el envío de notificaciones a Telegram utilizando la API HTTP oficial.
 * @module Services/Telegram
 */

require("dotenv").config();
const axios = require("axios");
const { resolveSecret } = require("../config/db.config");

const TELEGRAM_ENABLED = process.env.TELEGRAM_ENABLED !== "false";
const TELEGRAM_BOT_TOKEN = resolveSecret(process.env.TELEGRAM_BOT_TOKEN);
const TELEGRAM_CHAT_ID = resolveSecret(process.env.TELEGRAM_CHAT_ID);
const TELEGRAM_THREAD_ID = process.env.TELEGRAM_THREAD_ID;

/**
 * Genera un ID único para trackear requests de Telegram.
 * @returns {string} - ID único para el request.
 */
const generateRequestId = () => {
  return `telegram_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Logger para Telegram con timestamps y request tracking.
 * @param {string} level - Nivel del log (INFO, ERROR, WARN).
 * @param {string} message - Mensaje a loggear.
 * @param {string} requestId - ID del request para tracking.
 * @param {object} data - Datos adicionales para loggear.
 */
const logTelegram = (level, message, requestId, data = {}) => {
  const timestamp = new Date().toISOString();

  if (level === "ERROR") {
    console.error(`[${timestamp}] [${level}] [TelegramService] [${requestId}] ${message}`, data);
  } else {
    console.log(`[${timestamp}] [${level}] [TelegramService] [${requestId}] ${message}`, data);
  }
};

/**
 * Envía un mensaje de Telegram reutilizable con manejo de reintentos.
 * @param {string} message - Contenido del mensaje.
 * @param {object} [options={}] - Opciones adicionales del mensaje.
 * @param {string} [options.chatId] - Chat ID de destino. Usa TELEGRAM_CHAT_ID por defecto.
 * @param {string} [options.parseMode] - Modo de parseo (MarkdownV2, HTML, etc.).
 * @param {number} [retryCount=0] - Número de intentos realizados para enviar el mensaje.
 * @param {string} [requestId] - ID del request para tracking.
 * @returns {Promise<object>} - Respuesta estandarizada del servicio.
 */
const sendTelegramMessage = async (message, options = {}, retryCount = 0, requestId = null) => {
  const MAX_RETRIES = 3;
  const reqId = requestId || generateRequestId();

  if (!TELEGRAM_ENABLED) {
    logTelegram("INFO", "Telegram notifications disabled, skipping message send", reqId);
    return {
      success: true,
      skipped: true,
      reason: "Telegram notifications disabled",
      requestId: reqId
    };
  }

  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    logTelegram("ERROR", "Telegram service misconfigured - missing bot token or chat id", reqId);
    return {
      success: false,
      error: "Telegram service misconfigured",
      requestId: reqId
    };
  }

  const chatId = options.chatId || TELEGRAM_CHAT_ID;
  const apiUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  const payload = {
    chat_id: chatId,
    text: message,
    disable_web_page_preview: true
  };

  if (options.parseMode) {
    payload.parse_mode = options.parseMode;
  }

  if (options.replyMarkup) {
    payload.reply_markup = options.replyMarkup;
  }

  if (options.threadId || TELEGRAM_THREAD_ID) {
    payload.message_thread_id = parseInt(options.threadId || TELEGRAM_THREAD_ID, 10);
  }

  logTelegram("INFO", "Attempting to send Telegram message", reqId, {
    chatId,
    hasThreadId: Boolean(payload.message_thread_id),
    attempt: retryCount + 1
  });

  try {
    const response = await axios.post(apiUrl, payload, {
      timeout: 10000
    });

    logTelegram("INFO", "Telegram message sent successfully", reqId, {
      chatId,
      hasThreadId: Boolean(payload.message_thread_id),
      status: response.status,
      messageId: response.data?.result?.message_id
    });

    return {
      success: true,
      response: response.data,
      requestId: reqId,
      messageId: response.data?.result?.message_id
    };
  } catch (error) {
    const providerStatus = error.response?.status;
    const providerData = error.response?.data;
    const retryAfter = providerData?.parameters?.retry_after;

    logTelegram("ERROR", `Telegram message failed (attempt ${retryCount + 1}/${MAX_RETRIES + 1})`, reqId, {
      chatId,
      status: providerStatus,
      errorCode: error.code,
      errorMessage: error.message,
      providerResponse: providerData,
      retryAfter
    });

    const isRateLimited = providerStatus === 429;
    const isTransientError =
      error.code === "ETIMEDOUT" ||
      error.code === "ECONNRESET" ||
      error.code === "ECONNREFUSED" ||
      error.code === "ESOCKET" ||
      !error.response ||
      (providerStatus && providerStatus >= 500) ||
      isRateLimited;

    if (retryCount < MAX_RETRIES && isTransientError) {
      const delayMs = isRateLimited && retryAfter ? (retryAfter + 1) * 1000 : 2000;
      logTelegram("WARN", `Retrying Telegram message in ${delayMs}ms`, reqId, {
        nextAttempt: retryCount + 2,
        retryAfter
      });

      await new Promise((resolve) => setTimeout(resolve, delayMs));
      return sendTelegramMessage(message, options, retryCount + 1, reqId);
    }

    logTelegram("ERROR", "CRITICAL: Telegram message failed definitively - ADMIN ATTENTION REQUIRED", reqId, {
      chatId,
      finalStatus: providerStatus,
      finalErrorCode: error.code,
      finalErrorMessage: error.message,
      providerResponse: providerData,
      totalAttempts: retryCount + 1
    });

    return {
      success: false,
      error: "Telegram message sending failed after all retries",
      errorMessage: error.message,
      requestId: reqId,
      attempts: retryCount + 1
    };
  }
};

/**
 * Envía una notificación de Telegram al administrador sobre un nuevo mensaje.
 * @param {object} messageData - Los datos del mensaje recibido.
 * @returns {Promise<object>} - Resultado del envío.
 */
exports.sendMessageNotificationTelegram = async (messageData) => {
  const requestId = generateRequestId();

  const message = [
    "🔔 Nuevo mensaje recibido",
    `Nombre: ${messageData.messageName}`,
    `Email: ${messageData.messageEmail}`,
    "",
    "Contenido:",
    messageData.messageContent,
    "",
    "Notificación automática del sitio web."
  ].join("\n");

  try {
    const result = await sendTelegramMessage(message, {}, 0, requestId);
    if (!result.success) {
      logTelegram("ERROR", "Telegram notification for message failed", requestId, result);
    }
    return result;
  } catch (error) {
    logTelegram("ERROR", "Unexpected error sending Telegram message notification", requestId, {
      errorMessage: error.message
    });
    return {
      success: false,
      error: "Unexpected error occurred",
      requestId
    };
  }
};

/**
 * Envía una notificación de Telegram al administrador sobre una nueva reserva.
 * @param {object} bookingData - Los datos de la reserva.
 * @returns {Promise<object>} - Resultado del envío.
 */
exports.sendBookingNotificationTelegram = async (bookingData) => {
  const requestId = generateRequestId();

  const messageLines = [
    "📅 Nueva solicitud de reserva",
    `Nombre: ${bookingData.name}`,
    `Email: ${bookingData.email}`,
    `Sesión: ${bookingData.sesion}`,
    `Localidad: ${bookingData.location}`,
    `Lugar: ${bookingData.place}`,
    `Fecha: ${bookingData.selectedDate}`,
    `Hora: ${bookingData.selectedTime}`
  ];

  if (bookingData.message) {
    messageLines.push("", "Mensaje adicional:", bookingData.message);
  }

  messageLines.push("", "Notificación automática del sitio web.");

  try {
    const result = await sendTelegramMessage(messageLines.join("\n"), {}, 0, requestId);
    if (!result.success) {
      logTelegram("ERROR", "Telegram notification for booking failed", requestId, result);
    }
    return result;
  } catch (error) {
    logTelegram("ERROR", "Unexpected error sending Telegram booking notification", requestId, {
      errorMessage: error.message
    });
    return {
      success: false,
      error: "Unexpected error occurred",
      requestId
    };
  }
};

/**
 * Retorna el estado de configuración del servicio de Telegram.
 * @returns {object} - Estado actual del servicio.
 */
exports.getTelegramStatus = () => {
  return {
    enabled: TELEGRAM_ENABLED,
    hasToken: Boolean(TELEGRAM_BOT_TOKEN),
    hasChatId: Boolean(TELEGRAM_CHAT_ID),
    hasThreadId: Boolean(TELEGRAM_THREAD_ID)
  };
};
