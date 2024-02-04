import axios from "axios";

/**
 * Las acciones de Vuex para las categorías.
 */
export default {
  /**
   * Obtiene las categorías de la API y las almacena en el estado.
   * @param {Object} context - El contexto de Vuex.
   * @param {Object} context.commit - La función de Vuex para realizar una mutación.
   * @returns {Promise} - Devuelve una promesa que se resuelve cuando la solicitud se completa.
   * @throws {Error} - Si la solicitud falla, se lanza un error con el mensaje de error.
   */
  getCategories({ commit }) {
    axios
      .get(`${process.env.VUE_APP_API_URL}/categories`)
      .then((res) => {
        commit("setCategories", res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  },

  /**
   * Actualiza una categoría en la API y en el estado.
   * @param {Object} context - El contexto de Vuex.
   * @param {Object} context.commit - La función de Vuex para realizar una mutación.
   * @param {Object} context.dispatch - La función de Vuex para despachar una acción.
   * @param {string} categoryId - El ID de la categoría que se actualizará.
   * @param {string} categoryName - El nombre de la categoría que se actualizará.
   * @returns {Promise} - Devuelve una promesa que se resuelve cuando la solicitud se completa.
   * @throws {Error} - Si la solicitud falla, se lanza un error con el mensaje de error.
   */
  updateCategory({ commit, dispatch }, { categoryId, categoryName }) {
    return axios
      .put(`${process.env.VUE_APP_API_URL}/categories/${categoryId}`, {
        categoryName,
      })
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          dispatch("getCategories");
          commit("updateCategory", { categoryId, categoryName });
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
   * Agrega una nueva categoría a la API y al estado.
   * @param {Object} context - El contexto de Vuex.
   * @param {Object} context.commit - La función de Vuex para realizar una mutación.
   * @param {Object} context.dispatch - La función de Vuex para despachar una acción.
   * @param {string} newCategoryName - El nombre de la nueva categoría.
   * @returns {Promise} - Devuelve una promesa que se resuelve cuando la solicitud se completa.
   * @throws {Error} - Si la solicitud falla, se lanza un error con el mensaje de error.
   */
  addNewCategory({ commit, dispatch }, newCategoryName) {
    return axios
      .post(`${process.env.VUE_APP_API_URL}/categories`, {
        categoryName: newCategoryName,
      })
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          const responseData = response.data; // capture the response data
          dispatch("getCategories");
          commit("addNewCategory", { categoryName: responseData.categoryName });
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
   * Elimina una categoría de la API y del estado.
   * @param {Object} context - El contexto de Vuex.
   * @param {Object} context.commit - La función de Vuex para realizar una mutación.
   * @param {Object} context.dispatch - La función de Vuex para despachar una acción.
   * @param {string} categoryId - El ID de la categoría que se eliminará.
   * @returns {Promise} - Devuelve una promesa que se resuelve cuando la solicitud se completa.
   * @throws {Error} - Si la solicitud falla, se lanza un error con el mensaje de error.
   */
  deleteCategory({ commit, dispatch }, categoryId) {
    return axios
      .delete(`${process.env.VUE_APP_API_URL}/categories/${categoryId}`)
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          console.log("Successfully deleted category with ID:", categoryId);
          commit("deleteCategory", categoryId);
          dispatch("getCategories");
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
