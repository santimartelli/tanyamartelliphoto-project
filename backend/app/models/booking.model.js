/**
 * @fileoverview Modelo de la tabla Bookings. Se definen los atributos de la tabla y
 * el nombre de la tabla a la que hace referencia.
 */

const sql = require("./db.js");

/**
 * Represenenta el modelo reserva.
 * @constructor
 * @param {object} booking - El objeto reserva.
 * @param {string} booking.name - El nombre de la persona que reserva.
 * @param {string} booking.email - El email de la persona que reserva.
 * @param {number} booking.categoryId - La categoría de la foto sesión de la reserva.
 * @param {string} booking.location - La localidad de la reserva.
 * @param {string} booking.place - El lugar de la reserva.
 * @param {string} booking.selectedDate - La fecha seleccionada de la reserva.
 * @param {string} booking.selectedTime - El horario seleccionado de la reserva.
 * @param {string} booking.message - El mensaje de la reserva.
 */
const Booking = function (booking) {
  this.name = booking.name;
  this.email = booking.email;
  this.categoryId = booking.categoryId;
  this.location = booking.location;
  this.place = booking.place;
  this.selectedDate = booking.selectedDate;
  this.selectedTime = booking.selectedTime;
  this.message = booking.message;
};

/**
 * Crea una nueva reserva, la guarda en la base de datos y devuelve el resultado.
 * @param {Object} newBooking - El objeto nueva reserva.
 * @param {string} newBooking.name - El nombre de la persona que reserva.
 * @param {string} newBooking.email - El email de la persona que reserva.
 * @param {number} newBooking.categoryId - La categoría de la foto sesión de la reserva.
 * @param {string} newBooking.location - La localidad de la reserva.
 * @param {string} newBooking.place - El lugar de la reserva.
 * @param {string} newBooking.selectedDate - La fecha seleccionada de la reserva.
 * @param {string} newBooking.selectedTime - El horario seleccionado de la reserva.
 * @param {string} newBooking.message - El mensaje de la reserva.
 * @param {function} result - La función de callback que maneja la respuesta de la base de datos.
 */
Booking.create = (newBooking, result) => {
  sql.query("INSERT INTO bookings SET ?", newBooking, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    console.log("booking created: ", { id: res.insertId, ...newBooking });
    result(null, { id: res.insertId, ...newBooking });
  });
};

/**
 * Obtiene todas las reservas de la base de datos y devuelve el resultado.
 * @param {function} result - La función de callback que maneja la respuesta de la base de datos.
 */
Booking.getAll = (result) => {
  sql.query("SELECT * FROM bookings", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    result(null, res);
  });
};

/**
 * Obtiene una reserva de la base de datos por su ID y devuelve el resultado.
 * @param {number} bookingId - El ID de la reserva.
 * @param {function} result - El callback que maneja la respuesta de la base de datos.
 */
Booking.findById = (bookingId, result) => {
  sql.query(
    "SELECT * FROM bookings WHERE bookingId = ?",
    bookingId,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
      if (res.length) {
        console.log("Booking found: ", res[0]);
        result(null, res[0]);
        return;
      }
      result({ kind: "not_found" }, null);
    }
  );
};

/**
 * Actualiza una reserva existente de la base de datos por su ID y devuelve el resultado.
 * @param {number} bookingId - El ID de la reserva.
 * @param {Object} booking - El objeto de la reserva.
 * @param {string} booking.name - El nombre de la persona que reserva.
 * @param {string} booking.email - El email de la persona que reserva.
 * @param {number} booking.categoryId - La categoría de la foto sesión de la reserva.
 * @param {string} booking.location - La localidad de la reserva.
 * @param {string} booking.place - El lugar de la reserva.
 * @param {string} booking.selectedDate - La fecha seleccionada de la reserva.
 * @param {string} booking.selectedTime - El horario seleccionado de la reserva.
 * @param {string} booking.message - El mensaje de la reserva.
 * @param {function} result - La función de callback que maneja la respuesta de la base de datos.
 */
Booking.updateById = (bookingId, booking, result) => {
  sql.query(
    "UPDATE bookings SET name = ?, email = ?, categoryId = ?, location = ?, place = ?, selectedDate = ?, selectedTime = ?, message = ? WHERE bookingId = ?",
    [booking.name, booking.email, booking.categoryId, booking.location, booking.place, booking.selectedDate, booking.selectedTime, booking.message, bookingId],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
      if (res.affectedRows == 0) {
        result({ kind: "not_found" }, null);
        return;
      }
      console.log("updated category: ", { id: bookingId, ...booking });
      result(null, { id: bookingId, ...booking });
    }
  );
};

/**
 * Elimina una reserva existente de la base de datos por su ID y devuelve el resultado.
 * @param {number} bookingId - El ID de la reserva.
 * @param {function} result - La función de callback que maneja la respuesta de la base de datos.
 */
Booking.removeOne = (bookingId, result) => {
  sql.query("DELETE FROM bookings WHERE bookingId = ?", bookingId, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    if (res.affectedRows == 0) {
      result({ kind: "not_found" }, null);
      return;
    } else {
      console.log("deleted booking with id:", bookingId);
      result(null, res);
    }
  });
};

/**
 * Elimina todas las reservas de la base de datos y devuelve el resultado.
 * @param {function} result - La función de callback que maneja la respuesta de la base de datos.
 */
Booking.removeAll = (result) => {
  sql.query("DELETE FROM bookings", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    } else {
      console.log(`deleted ${res.affectedRows} bookings`);
      result(null, res);
    }
  });
};

module.exports = Booking;
