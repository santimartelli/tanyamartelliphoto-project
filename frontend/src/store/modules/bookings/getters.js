/**
 * Define los getters del módulo de reservas.
 */
export default {
  /**
   * Devuelve las reservas del estado.
   * @param {Object} state - El estado de Vuex del módulo de reservas.
   * @returns {Object[]} - Las reservas del estado.
   */
  bookings: (state) => state.bookings,

  /**
   * Devuelve un valor booleano que indica si el usuario tiene reservas o no.
   * @param {Object} state - El estado de Vuex del módulo de reservas.
   * @returns {boolean} - Un valor booleano que indica si el usuario tiene reservas o no.
   */
  hasBookings: (state) => state.bookings.length > 0,
}


