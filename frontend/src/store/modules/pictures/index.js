import actions from "./actions.js";
import mutations from "./mutations.js";
import getters from "./getters.js";

/**
 * Este módulo contiene el estado, las mutaciones, las acciones y los getters
 * del módulo de imágenes.
 */
export default {
  /**
   * Inicializa el estado del módulo de imágenes.
   * @returns {Object} - El estado inicial del módulo de imágenes.
   * @property {Object[]} pictures - Las imágenes del estado.
   */
  namespaced: true,
  state: {
    pictures: [],
  },

  /**
   * Mutaciones, acciones y getters del módulo de imágenes.
   */
  actions,
  mutations,
  getters,
};