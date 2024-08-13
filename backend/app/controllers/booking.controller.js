/**
 * Controlador de reservas. Contiene funciones para manejar las solicitudes de reserva.
 * @module bookingController
 */

const BookingModel = require("../models/booking.model.js");
const emailService = require("../services/emailService.js");

/**
 * Crea una nueva solicitud de reserva, la guarda en la base de datos, envía un email de confirmación al usuario y
 * un email de notificación al administrador.
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
  BookingModel.create(newBooking, (err, data) => {
    if (err) {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the booking.",
      });
    } else {
      // Enviar email de confirmación al usuario
      emailService.sendBookingRequestConfirmationEmail(
        req.body.email,
        req.body
      );
      // Enviar email de notificación al administrador
      emailService.sendBookingRequestNotificationEmail(req.body);
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
