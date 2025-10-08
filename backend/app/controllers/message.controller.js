/**
 * Controlador de mensajes. Contiene funciones para manejar los mensajes.
 * @module messageController
 */

const MessageModel = require("../models/message.model.js");
const emailService = require("../services/emailService.js");
const telegramService = require("../services/telegramService.js");

const MESSAGE_COOLDOWN_MS = 60 * 1000;
const MESSAGE_MAX_LENGTH = 1500;
const MAX_LINKS_ALLOWED = 2;
const SUSPICIOUS_KEYWORDS = ["viagra", "casino", "loan", "crypto", "investment", "betting"];

const messageSubmissionTracker = new Map();

const pruneTracker = (tracker, windowMs) => {
  const now = Date.now();
  tracker.forEach((timestamp, key) => {
    if (now - timestamp > windowMs * 5) {
      tracker.delete(key);
    }
  });
};

const countLinks = (text) => {
  if (!text) {
    return 0;
  }
  const matches = text.match(/https?:\/\//gi);
  return matches ? matches.length : 0;
};

const containsSuspiciousKeyword = (text) => {
  if (!text) {
    return false;
  }
  const lowered = text.toLowerCase();
  return SUSPICIOUS_KEYWORDS.some((keyword) => lowered.includes(keyword));
};

/**
 * Crea un nuevo mensaje.
 * @param {Object} req - El objeto de solicitud HTTP.
 * @param {Object} res - El objeto de respuesta HTTP.
 */
exports.create = (req, res) => {
  console.log(req.body);
  if (
    !req.body.messageName ||
    !req.body.messageEmail ||
    !req.body.messageContent
  ) {
    res.status(400).send({ message: "Please complete all the fields" });
    return;
  }

  if (req.body.messageContent.length > MESSAGE_MAX_LENGTH) {
    res.status(400).send({ message: "Please keep the message below 1500 characters." });
    return;
  }

  if (countLinks(req.body.messageContent) > MAX_LINKS_ALLOWED) {
    res.status(400).send({ message: "Please remove links from the message before sending." });
    return;
  }

  if (containsSuspiciousKeyword(req.body.messageContent)) {
    res.status(400).send({ message: "The message contains blocked keywords." });
    return;
  }

  const normalizedEmail = req.body.messageEmail.trim().toLowerCase();
  pruneTracker(messageSubmissionTracker, MESSAGE_COOLDOWN_MS);
  const lastSubmission = messageSubmissionTracker.get(normalizedEmail);
  const now = Date.now();

  if (lastSubmission && now - lastSubmission < MESSAGE_COOLDOWN_MS) {
    res.status(429).send({
      message: "Has enviado un mensaje hace muy poco. Por favor espera unos segundos antes de intentarlo nuevamente."
    });
    return;
  }

  messageSubmissionTracker.set(normalizedEmail, now);

  const newMessage = new MessageModel({
    messageName: req.body.messageName,
    messageEmail: req.body.messageEmail,
    messageContent: req.body.messageContent,
  });

  MessageModel.create(newMessage, async (err, data) => {
    if (err) {
      messageSubmissionTracker.delete(normalizedEmail);
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the message.",
      });
    } else {
      // Enviar notificaciones (email y WhatsApp) al administrador y confirmación al usuario
      // No esperamos por las notificaciones para no bloquear la respuesta al usuario

      // Email notifications
      emailService.sendMessageConfirmationEmail(req.body.messageEmail, req.body)
        .catch(emailErr => console.error("Failed to send confirmation email:", emailErr));

      emailService.sendMessageNotificationEmail(req.body)
        .catch(emailErr => console.error("Failed to send notification email:", emailErr));

      // Telegram notification to admin
      telegramService.sendMessageNotificationTelegram(req.body)
        .catch(telegramErr => console.error("Failed to send Telegram notification:", telegramErr));

      res.send(data);
    }
  });
};

/**
 * Obtiene todos los mensajes.
 * @param {Object} req - El objeto de solicitud HTTP.
 * @param {Object} res - El objeto de respuesta HTTP.
 */
exports.findAll = (req, res) => {
  MessageModel.getAll((err, data) => {
    if (err) {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving the messages.",
      });
    } else {
      res.send(data);
    }
  });
};

/**
 * Obtiene un mensaje por su ID.
 * @param {Object} req - El objeto de solicitud HTTP.
 * @param {Object} res - El objeto de respuesta HTTP.
 */
exports.findOne = (req, res) => {
  MessageModel.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res
          .status(404)
          .send({ message: `Message not found with id ${req.params.id}` });
      } else {
        res
          .status(500)
          .send({
            message: "Error retrieving message with id " + req.params.id,
          });
      }
    } else {
      res.send(data);
    }
  });
};

/**
 * Actualiza un mensaje existente por su ID.
 * @param {Object} req - El objeto de solicitud HTTP.
 * @param {Object} res - El objeto de respuesta HTTP.
 */
exports.update = (req, res) => {
  if (!req.body) {
    res.status(400).send({ message: "Message can not be empty!" });
    return;
  }

  MessageModel.updateById(
    req.params.id,
    new MessageModel(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res
            .status(404)
            .send({ message: `Message not found with id ${req.params.id}` });
        } else {
          res
            .status(500)
            .send({
              message: "Error updating message with id " + req.params.id,
            });
        }
      } else {
        res.send(data);
      }
    }
  );
};

/**
 * Elimina un mensaje por su ID.
 * @param {Object} req - El objeto de solicitud HTTP.
 * @param {Object} res - El objeto de respuesta HTTP.
 */
exports.deleteOne = (req, res) => {
  MessageModel.removeOne(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res
          .status(404)
          .send({ message: `Message not found with id ${req.params.id}` });
      } else {
        res
          .status(500)
          .send({
            message: "Could not delete the message with id " + req.params.id,
          });
      }
    } else {
      res.send({ message: "Message deleted successfully!" });
    }
  });
};

/**
 * Elimina todos los mensajes.
 * @param {Object} req - El objeto de solicitud HTTP.
 * @param {Object} res - El objeto de respuesta HTTP.
 */
exports.deleteAll = (req, res) => {
  MessageModel.removeAll((err, data) => {
    if (err) {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all messages.",
      });
    } else {
      res.send({ message: "All messages deleted successfully!" });
    }
  });
};
