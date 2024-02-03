import mutations from "./mutations.js";
import actions from "./actions.js";
import getters from "./getters.js";

/**
 * Este módulo contiene el estado, las mutaciones, las acciones y los getters
 * del módulo de autenticación.
 */
export default {
/**
 * Inicializa el estado del módulo de autenticación.
 * @returns {Object} - El estado inicial del módulo de autenticación.
 * @property {Object} user - El usuario del estado.
 * @property {string} token - El token del estado.
 * @property {boolean} didAutoLogout - Un valor booleano que indica si el usuario ha cerrado la sesión automáticamente.
 */
state() {
  return {
    user: null,
    token: null,
    didAutoLogout: false,
  };
},
mutations,
actions,
getters
};