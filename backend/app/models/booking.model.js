const sql = require("./db.js");

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

      // not found Category with the id
      result({ kind: "not_found" }, null);
    }
  );
};

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
        // not found Category with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated category: ", { id: bookingId, ...booking });
      result(null, { id: bookingId, ...booking });
    }
  );
};

Booking.removeOne = (bookingId, result) => {
  sql.query("DELETE FROM bookings WHERE bookingId = ?", bookingId, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    if (res.affectedRows == 0) {
      // not found Category with the id
      result({ kind: "not_found" }, null);
      return;
    } else {
      console.log("deleted booking with id:", bookingId);
      result(null, res);
    }
  });
};

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
