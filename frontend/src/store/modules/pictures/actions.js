import axios from "axios";

export default {
  getPictures({ commit }) {
    axios
      .get("http://localhost:3000/api/pictures")
      .then((response) => {
        commit("setPictures", response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  },
  deletePicture({ commit, dispatch }, pictureId) {
    return axios
      .delete(`http://localhost:3000/api/pictures/${pictureId}`)
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          // Successfully deleted, commit the mutation and dispatch any necessary actions
          console.log("Successfully deleted picture with ID:", pictureId);
          commit("deletePicture", pictureId);
          dispatch("getPictures");
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
