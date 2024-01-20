export default {
  setBookings(state, bookings) {
    state.bookings = bookings;
  },
  updateBooking(state, {bookingId, name, email, categoryId, location, place, selectedDate, selectedTime, message}) {
    const index = state.bookings.findIndex(b => b.bookingId === bookingId);
    state.bookings[index].name = name;
    state.bookings[index].email = email;
    state.bookings[index].categoryId = categoryId;
    state.bookings[index].location = location;
    state.bookings[index].place = place;
    state.bookings[index].selectedDate = selectedDate;
    state.bookings[index].selectedTime = selectedTime;
    state.bookings[index].message = message;
  },
  addNewBooking(state, { name, email, categoryId, location, place, selectedDate, selectedTime, message }) {
    state.bookings.push({
      name,
      email,
      categoryId,
      location,
      place,
      selectedDate,
      selectedTime,
      message,
    });
  },
  deleteBooking(state, bookingId) {
    state.bookings = state.bookings.filter(
      b => b.messageId !== bookingId
    );
  }
};