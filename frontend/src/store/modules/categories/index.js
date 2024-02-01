import actions from "./actions.js";
import mutations from "./mutations.js";
import getters from "./getters.js";

export default {
  /**
   * Inicializa el estado del módulo de categorías.
   * @returns {Object} - El estado inicial del módulo de categorías.
   * @property {Object[]} categories - Las categorías del estado.
   */
  namespaced: true,
  state: {
    categories: [],
  },

  /**
   * Mutaciones, acciones y getters del módulo de categorías.
   */
  actions,
  mutations,
  getters,
};
