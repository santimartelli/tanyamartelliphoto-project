import actions from "./actions.js";
import mutations from "./mutations.js";
import getters from "./getters.js";

/**
 * Este módulo contiene el estado, las mutaciones, las acciones y los getters
 * del módulo de mensajes.
 */
export default {
  /**
   * Inicializa el estado del módulo de mensajes.
   * @returns {Object} - El estado inicial del módulo de mensajes.
   * @property {Object[]} messages - Los mensajes del estado.
   */
  namespaced: true,
  state() {
    return {
      messages: [],
    };
  },

  /**
   * Mutaciones, acciones y getters del módulo de mensajes.
   */
  actions,
  mutations,
  getters,
};