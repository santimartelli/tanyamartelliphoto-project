import actions from "./actions.js";
import mutations from "./mutations.js";
import getters from "./getters.js";

/**
 * Este módulo contiene el estado, las mutaciones, las acciones y los getters
 * del módulo de reservas.
 */
export default {
  /**
   * Inicializa el estado del módulo de reservas.
   * @returns {Object} - El estado inicial del módulo de reservas.
   * @property {Object[]} bookings - Las reservas del estado.
   */
  namespaced: true,
  state() {
    return {
      bookings: [],
    };
  },

  /**
   * Mutaciones, acciones y getters del módulo de reservas.
   */
  actions,
  mutations,
  getters,
};