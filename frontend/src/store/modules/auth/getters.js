export default{
  /**
   * Devuelve el usuario del estado.
   * @param {Object} state - El estado de Vuex del módulo de autenticación.
   * @returns {Object} - El usuario del estado.
   */
  user(state){
    return state.user;
  },

  /**
   * Devuelve el token del estado.
   * @param {Object} state - El estado de Vuex del módulo de autenticación.
   * @returns {string} - El token del estado.
   */
  token(state){
    return state.token;
  },

  /**
   * Devuelve un valor booleano que indica si el usuario está autenticado o no.
   * @param {Object} state - El estado de Vuex del módulo de autenticación.
   * @returns {boolean} - Un valor booleano que indica si el usuario está autenticado o no.
   */
  isAuthenticated(state){
    return !!state.token;
  },

  /**
   * Devuelve un valor booleano que indica si el usuario está autenticado o no.
   * @param {Object} state - El estado de Vuex del módulo de autenticación.
   * @returns {boolean} - Un valor booleano que indica si el usuario está autenticado o no.
   */
  didAutoLogout (state){
    return state.didAutoLogout;
  }
};