import axios from "axios";

export default {
  getBookings({ commit }) {
    axios
      .get("http://localhost:3000/api/bookings")
      .then((res) => {
        commit("setBookings", res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  },
  updateBooking({ commit, dispatch }, { bookingId, name, email, categoryId, location, place, selectedDate, selectedTime, message }) {
    return axios
      .put(`http://localhost:3000/api/bookings/${bookingId}`, {
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
        // Handle network errors or other exceptions
        console.error("Edit request failed with error:", error);
      });
  },

  addNewBooking({ commit, dispatch }, { name, email, categoryId, location, place, selectedDate, selectedTime, message }) {
    return axios
      .post(`http://localhost:3000/api/bookings`, {
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
  deleteBooking({ commit, dispatch }, bookingId) {
    return axios
      .delete(`http://localhost:3000/api/bookings/${bookingId}`)
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          // Successfully deleted, commit the mutation and dispatch any necessary actions
          console.log("Successfully deleted booking with ID:", bookingId);
          commit("deleteBooking", bookingId);
          dispatch("getBookings");
        } else {
          // Handle unexpected status codes (e.g., 404, 500, etc.)
          console.error(
            `Delete request failed with status: ${response.status}`
          );
        }
        return response;
      })
      .catch((error) => {
        // Handle network errors or other exceptions
        console.error("Delete request failed with error:", error);
      });
  },
};