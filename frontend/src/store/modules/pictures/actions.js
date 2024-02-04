import axios from "axios";

/**
 * Las acciones de Vuex para el módulo de imágenes.
 */
export default {
  /**
   * Devuelve las imágenes de la API y las guarda en el estado.
   * @param {Object} state - El estado de Vuex del módulo de imágenes.
   * @returns {Object[]} - Las imágenes del estado.
   */
  getPictures({ commit }) {
    axios
      .get(`${process.env.VUE_APP_API_URL}/pictures`)
      .then((response) => {
        const pictures = Array.isArray(response.data) ? response.data : [];
        commit("setPictures", pictures);
      })
      .catch((error) => {
        console.error(error);
        commit("setPictures", []);
      });
  },

  /**
   * Elimina una imagen en la API y en el estado.
   * @param {Object} context - El contexto de Vuex.
   * @param {Object} context.commit - La función de Vuex para realizar una mutación.
   * @param {Object} context.dispatch - La función de Vuex para despachar una acción.
   * @param {string} pictureId - El ID de la imagen que se eliminará.
   * @returns {Promise} - Devuelve una promesa que se resuelve cuando la solicitud se completa.
   * @throws {Error} - Si la solicitud falla, se lanza un error con el mensaje de error.
   */
  deletePicture({ commit, dispatch }, pictureId) {
    return axios
      .delete(`${process.env.VUE_APP_API_URL}/pictures/${pictureId}`)
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
