/**
 * Define los getters del módulo de categorías.
 */
export default {
  /**
   * Devuelve las categorías del estado.
   * @param {Object} state - El estado de Vuex del módulo de categorías.
   * @returns {Object[]} - Las categorías del estado.
   */
  categories: (state) => state.categories,

  /**
   * Devuelve un valor booleano que indica si el usuario tiene categorías o no.
   * @param {Object} state - El estado de Vuex del módulo de categorías.
   * @returns {boolean} - Un valor booleano que indica si el usuario tiene categorías o no.
   */
  hasCategories: (state) => state.categories.length > 0,
}
