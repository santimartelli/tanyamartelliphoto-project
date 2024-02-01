export default{
  /**
   * Actualiza las categorías del estado.
   * @param {Object} state - El estado de Vuex del módulo de categorías.
   * @param {Object[]} categories - Las categorías con las que actualizar el estado.
   */
  setCategories(state, categories) {
    state.categories = categories;
  },

  /**
   * Actualiza el nombre de una categoría del estado.
   * @param {Object} state - El estado de Vuex del módulo de categorías.
   * @param {Object} payload - El payload con la información que se pasará a la mutación.
   * @param {string} payload.categoryId - El id de la categoría a actualizar.
   * @param {string} payload.categoryName - El nombre de la categoría a actualizar.
   * @returns {Promise} - Devuelve una promesa que se resuelve cuando la solicitud se completa.
   */
  updateCategory(state, {categoryId, categoryName}) {
    const index = state.categories.findIndex(c => c.categoryId === categoryId);
    state.categories[index].categoryName = categoryName;
  },

  /**
   * Agrega una nueva categoría al estado.
   * @param {Object} state - El estado de Vuex del módulo de categorías.
   * @param {Object} payload - El payload con la información que se pasará a la mutación.
   * @param {string} payload.categoryName - El nombre de la categoría a agregar.
   * @returns {Promise} - Devuelve una promesa que se resuelve cuando la solicitud se completa.
   */
  addNewCategory(state, { categoryName }) {
    state.categories.push({
      categoryName,
    });
  },

  /**
   * Elimina una categoría del estado.
   * @param {Object} state - El estado de Vuex del módulo de categorías.
   * @param {string} categoryId - El id de la categoría a eliminar.
   * @returns {Promise} - Devuelve una promesa que se resuelve cuando la solicitud se completa.
   */
  deleteCategory(state, categoryId) {
    state.categories = state.categories.filter(
      c => c.categoryId !== categoryId
    );
  }
}