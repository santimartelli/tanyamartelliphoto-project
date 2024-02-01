export default{
  /**
   * Devuelve el usuario del estado.
   * @param {Object} state - El estado actual de Vuex del módulo de autenticación.
   * @param {Object} payload - El payload con la información que se pasará a la mutación.
   */
  setUser(state, payload){
    state.token = payload.token;
    state.user = payload.user;
    state.didAutoLogout = false;
  },

  /**
   * Establece el valor de didAutoLogout en true.
   * @param {Object} state - El estado actual de Vuex del módulo de autenticación.
   */
  setAutoLogout(state){
   state.didAutoLogout = true;
  }
};