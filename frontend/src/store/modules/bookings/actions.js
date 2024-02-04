import axios from "axios";

/**
 * Este archivo contiene las acciones de Vuex para el módulo de reservas.
 */
export default {
  /**
   * Obtiene las reservas de la API y las almacena en el estado.
   * @param {Object} context - El objeto context de Vuex.
   * @returns {Promise} - Devuelve una promesa que se resuelve cuando la solicitud se completa.
   * @throws {Error} - Si la solicitud falla, se lanza un error con el mensaje de error.
   */
  getBookings({ commit }) {
    axios
      .get(`${process.env.VUE_APP_API_URL}/bookings`)
      .then((res) => {
        commit("setBookings", res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  },

  /**
   * Actualiza una reserva en la API y en el estado.
   * @param {Object} context - El objeto context de Vuex.
   * @param {Object} payload - El payload de la reserva que contiene el ID de la reserva y los datos de la reserva.
   * @returns {Promise} - Devuelve una promesa que se resuelve cuando la solicitud se completa.
   * @throws {Error} - Si la solicitud falla, se lanza un error con el mensaje de error.
   */
  updateBooking({ commit, dispatch }, { bookingId, name, email, categoryId, location, place, selectedDate, selectedTime, message }) {
    return axios
      .put(`${process.env.VUE_APP_API_URL}/bookings/${bookingId}`, {
        name,
        email,
        categoryId,
        location,
        place,
        selectedDate,
        selectedTime,
        message,
      })
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          dispatch("getBookings");
          commit("updateBooking", { bookingId, name, email, categoryId, location, place, selectedDate, selectedTime, message });
        } else {
          console.error(`Edit request failed with status: ${response.status}`);
        }
        return response;
      })
      .catch((error) => {
        console.error("Edit request failed with error:", error);
      });
  },

  /**
   * Agrega una nueva reserva a la API y al estado.
   * @param {Object} context - El objeto context de Vuex.
   * @param {Object} payload - El payload de la reserva que contiene todos los datos de la reserva.
   * @returns {Promise} - Devuelve una promesa que se resuelve cuando la solicitud se completa.
   * @throws {Error} - Si la solicitud falla, se lanza un error con el mensaje de error.
   */
  addNewBooking({ commit, dispatch }, { name, email, categoryId, location, place, selectedDate, selectedTime, message }) {
    return axios
      .post(`${process.env.VUE_APP_API_URL}/bookings`, {
        name: name,
        email: email,
        categoryId: categoryId,
        location: location,
        place: place,
        selectedDate: selectedDate,
        selectedTime: selectedTime,
        message: message,
      })
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          const responseData = response.data; // capture the response data
          dispatch("getBookings");
          commit("addNewBooking", { name: responseData.name, email: responseData.email, categoryId: responseData.categoryId, location: responseData.location, place: responseData.place, selectedDate: responseData.selectedDate, selectedTime: responseData.selectedTime, message: responseData.message });
        } else {
          console.error(`Add request failed with status: ${response.status}`);
          throw new Error(`Add request failed with status: ${response.status}`);
        }
        return response;
      })
      .catch((error) => {
        console.error("Add request failed with error:", error);
        throw error;
      });
  },

  /**
   * Elimina una reserva de la API y del estado.
   * @param {Object} context - El objeto context de Vuex.
   * @param {string} bookingId - El ID de la reserva que se va a eliminar.
   * @returns {Promise} - Devuelve una promesa que se resuelve cuando la solicitud se completa.
   * @throws {Error} - Si la solicitud falla, se lanza un error con el mensaje de error.
   */
  deleteBooking({ commit, dispatch }, bookingId) {
    return axios
      .delete(`${process.env.VUE_APP_API_URL}/bookings/${bookingId}`)
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          console.log("Successfully deleted booking with ID:", bookingId);
          commit("deleteBooking", bookingId);
          dispatch("getBookings");
        } else {
          console.error(
            `Delete request failed with status: ${response.status}`
          );
        }
        return response;
      })
      .catch((error) => {
        console.error("Delete request failed with error:", error);
      });
  },
};