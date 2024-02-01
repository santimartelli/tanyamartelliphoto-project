export default {
  /**
   * Establece las reservas del estado.
   * @param {Object} state - El estado actual de Vuex del módulo de reservas.
   * @param {Object[]} bookings - Las reservas que se establecerán en el estado.
   */
  setBookings(state, bookings) {
    state.bookings = bookings;
  },

  /**
   * Actualiza una reserva del estado.
   * @param {Object} state - El estado actual de Vuex del módulo de reservas.
   * @param {string} bookingId - El ID de la reserva que se actualizará.
   * @param {string} name - El nombre de la reserva que se actualizará.
   * @param {string} email - El email de la reserva que se actualizará.
   * @param {string} categoryId - La categoría de la reserva que se actualizará.
   * @param {string} location - La ubicación de la reserva que se actualizará.
   * @param {string} place - El lugar de la reserva que se actualizará.
   * @param {string} selectedDate - La fecha seleccionada de la reserva que se actualizará.
   * @param {string} selectedTime - La hora seleccionada de la reserva que se actualizará.
   * @param {string} message - El mensaje de la reserva que se actualizará.
   * @returns {Promise} - Devuelve una promesa que se resuelve cuando la solicitud se completa.
   */
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

  /**
   * Agrega una nueva reserva al estado.
   * @param {Object} state - El estado actual de Vuex del módulo de reservas.
   * @param {string} name - El nombre de la reserva que se agregará.
   * @param {string} email - El email de la reserva que se agregará.
   * @param {string} categoryId - La categoría de la reserva que se agregará.
   * @param {string} location - La ubicación de la reserva que se agregará.
   * @param {string} place - El lugar de la reserva que se agregará.
   * @param {string} selectedDate - La fecha seleccionada de la reserva que se agregará.
   * @param {string} selectedTime - La hora seleccionada de la reserva que se agregará.
   * @param {string} message - El mensaje de la reserva que se agregará.
   * @returns {Promise} - Devuelve una promesa que se resuelve cuando la solicitud se completa.
   */
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

  /**
   * Elimina una reserva del estado.
   * @param {Object} state - El estado actual de Vuex del módulo de reservas.
   * @param {string} bookingId - El ID de la reserva que se eliminará.
   */
  deleteBooking(state, bookingId) {
    state.bookings = state.bookings.filter(
      b => b.messageId !== bookingId
    );
  }
};