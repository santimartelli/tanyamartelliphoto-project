/**
 * Acciones generales
 */

export default {
  /**
   * Cuando la pantalla cambia de tamaño hace un commit de la mutación updateScreenWidth.
   * @param {Object} context - El contexto de Vuex.
   * @param {Object} context.commit - El commit de Vuex.
   */
  onResize({ commit }) {
    commit('updateScreenWidth');
  },
};