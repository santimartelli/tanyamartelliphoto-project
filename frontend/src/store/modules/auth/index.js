import mutations from "./mutations.js";
import actions from "./actions.js";
import getters from "./getters.js";


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

/**
 * Mutaciones, acciones y getters del módulo de autenticación.
 */
mutations,
actions,
getters
};