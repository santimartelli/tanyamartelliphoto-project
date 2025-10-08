/**
 * Controlador de reservas. Contiene funciones para manejar las solicitudes de reserva.
 * @module bookingController
 */

const BookingModel = require("../models/booking.model.js");
const emailService = require("../services/emailService.js");
const telegramService = require("../services/telegramService.js");

const BOOKING_COOLDOWN_MS = 2 * 60 * 1000;
const BOOKING_MAX_MESSAGE_LENGTH = 2000;
const MAX_BOOKING_LINKS_ALLOWED = 1;

const bookingSubmissionTracker = new Map();

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

/**
 * Crea una nueva solicitud de reserva, la guarda en la base de datos, envía un email de confirmación al usuario,
 * un email de notificación al administrador y una notificación de WhatsApp al administrador.
 * @param {Object} req - El objeto de solicitud HTTP.
 * @param {Object} res - El objeto de respuesta HTTP.
 */
exports.create = (req, res) => {
  console.log(req.body);
  if (
    !req.body.name ||
    !req.body.email ||
    !req.body.sesion ||
    !req.body.location ||
    !req.body.place ||
    !req.body.selectedDate ||
    !req.body.selectedTime
  ) {
    res.status(400).send({ message: "Please complete all the fields" });
    return;
  }

  if (req.body.message && req.body.message.length > BOOKING_MAX_MESSAGE_LENGTH) {
    res.status(400).send({ message: "Please keep the additional message below 2000 characters." });
    return;
  }

  if (req.body.message && countLinks(req.body.message) > MAX_BOOKING_LINKS_ALLOWED) {
    res.status(400).send({ message: "Please remove links from the additional message before sending." });
    return;
  }

  const normalizedEmail = req.body.email.trim().toLowerCase();
  pruneTracker(bookingSubmissionTracker, BOOKING_COOLDOWN_MS);
  const lastSubmission = bookingSubmissionTracker.get(normalizedEmail);
  const now = Date.now();

  if (lastSubmission && now - lastSubmission < BOOKING_COOLDOWN_MS) {
    res.status(429).send({
      message: "Hemos recibido recientemente una reserva con este correo. Espera un momento antes de reenviarla."
    });
    return;
  }

  bookingSubmissionTracker.set(normalizedEmail, now);

  const newBooking = new BookingModel({
    name: req.body.name,
    email: req.body.email,
    sesion: req.body.sesion,
    location: req.body.location,
    place: req.body.place,
    selectedDate: req.body.selectedDate,
    selectedTime: req.body.selectedTime,
    message: req.body.message,
  });
  BookingModel.create(newBooking, async (err, data) => {
    if (err) {
      bookingSubmissionTracker.delete(normalizedEmail);
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the booking.",
      });
    } else {
      // Enviar notificaciones (email y WhatsApp) al administrador y confirmación al usuario
      // No esperamos por las notificaciones para no bloquear la respuesta al usuario

      // Email notifications
      emailService.sendBookingRequestConfirmationEmail(req.body.email, req.body)
        .catch(emailErr => console.error("Failed to send booking confirmation email:", emailErr));

      emailService.sendBookingRequestNotificationEmail(req.body)
        .catch(emailErr => console.error("Failed to send booking notification email:", emailErr));

      // Telegram notification to admin
      telegramService.sendBookingNotificationTelegram(req.body)
        .catch(telegramErr => console.error("Failed to send booking Telegram notification:", telegramErr));

      res.send(data);
    }
  });
};

/**
 * Obtiene todas las reservas almacenadas en la base de datos.
 * @param {Object} req - El objeto de solicitud HTTP.
 * @param {Object} res - El objeto de respuesta HTTP.
 */
exports.findAll = (req, res) => {
  BookingModel.getAll((err, data) => {
    if (err) {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving the bookings.",
      });
    } else {
      res.send(data);
    }
  });
};

/**
 * Obtiene una reserva por su ID.
 * @param {Object} req - El objeto de solicitud HTTP.
 * @param {Object} res - El objeto de respuesta HTTP.
 */
exports.findOne = (req, res) => {
  BookingModel.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res
          .status(404)
          .send({ message: `Booking not found with id ${req.params.id}` });
      } else {
        res
          .status(500)
          .send({
            message: "Error retrieving booking with id " + req.params.id,
          });
      }
    } else {
      res.send(data);
    }
  });
};

/**
 * Actualiza una reserva existente con los datos enviados en el cuerpo de la solicitud.
 * @param {Object} req - El objeto de solicitud HTTP.
 * @param {Object} res - El objeto de respuesta HTTP.
 */
exports.update = (req, res) => {
  if (!req.body) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }
  BookingModel.updateById(
    req.params.id,
    new BookingModel(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res
            .status(404)
            .send({ message: `Booking not found with id ${req.params.id}` });
        } else {
          res
            .status(500)
            .send({
              message: "Error updating the booking with id " + req.params.id,
            });
        }
      } else {
        res.send(data);
      }
    }
  );
};

/**
 * Elimina una reserva por su ID.
 * @param {Object} req - El objeto de solicitud HTTP.
 * @param {Object} res - El objeto de respuesta HTTP.
 */
exports.deleteOne = (req, res) => {
  BookingModel.removeOne(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res
          .status(404)
          .send({ message: `Booking not found with id ${req.params.id}` });
      } else {
        res
          .status(500)
          .send({
            message: "Could not delete booking with id " + req.params.id,
          });
      }
    } else {
      res.send({ message: "Booking deleted successfully!" });
    }
  });
};

/**
 * Elimina todas las reservas.
 * @param {Object} req - El objeto de solicitud HTTP.
 * @param {Object} res - El objeto de respuesta HTTP.
 */
exports.deleteAll = (req, res) => {
  BookingModel.removeAll((err, data) => {
    if (err) {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all the bookings.",
      });
    } else {
      res.send({ message: "All bookings deleted successfully!" });
    }
  });
};
