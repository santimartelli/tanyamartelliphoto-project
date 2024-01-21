const BookingModel = require("../models/booking.model.js");
const emailService = require("../services/emailService.js");

exports.create = (req, res) => {
  console.log(req.body);
  if (!req.body.name
    || !req.body.email
    || !req.body.categoryId
    || !req.body.location
    || !req.body.place
    || !req.body.selectedDate
    || !req.body.selectedTime) {
    res.status(400).send({ message: "Please complete all the fields" });
    return;
  }
  const newBooking = new BookingModel({
    name: req.body.name,
    email: req.body.email,
    categoryId: req.body.categoryId,
    location: req.body.location,
    place: req.body.place,
    selectedDate: req.body.selectedDate,
    selectedTime: req.body.selectedTime,
    message: req.body.message,
  });
  BookingModel.create(newBooking, (err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the booking.",
      });
    } else {
      // Send email to the client
      emailService.sendBookingRequestConfirmationEmail(req.body.email, req.body);
      // Send email to the admin
      emailService.sendBookingRequestNotificationEmail(req.body);
      res.send(data);
    }
  });
};

exports.findAll = (req, res) => {
  BookingModel.getAll((err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving the bookings.",
      });
    } else {
      res.send(data);
    }
  });
};

exports.findOne = (req, res) => {
  BookingModel.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({ message: `Booking not found with id ${req.params.id}` });
      } else {
        res.status(500).send({ message: "Error retrieving booking with id " + req.params.id });
      }
    } else {
      res.send(data);
    }
  });
};

exports.update = (req, res) => {
  if (!req.body) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  BookingModel.updateById(req.params.id, new BookingModel(req.body), (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({ message: `Booking not found with id ${req.params.id}` });
      } else {
        res.status(500).send({ message: "Error updating the booking with id " + req.params.id });
      }
    } else {
      res.send(data);
    }
  });
};

exports.deleteOne = (req, res) => {
  BookingModel.removeOne(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({ message: `Booking not found with id ${req.params.id}` });
      } else {
        res.status(500).send({ message: "Could not delete booking with id " + req.params.id });
      }
    } else {
      res.send({ message: "Booking deleted successfully!" });
    }
  });
};

exports.deleteAll = (req, res) => {
  BookingModel.removeAll((err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || "Some error occurred while removing all the bookings.",
      });
    } else {
      res.send({ message: "All bookings deleted successfully!" });
    }
  });
};
