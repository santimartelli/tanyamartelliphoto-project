/**
 * Getters del módulo de mensajes.
 */
export default {
  /**
   * Devuelve los mensajes del estado.
   * @param {Object} state - El estado de Vuex del módulo de mensajes.
   * @returns {Object[]} - Los mensajes del estado.
   */
  messages: (state) => state.messages,

  /**
   * Devuelve un valor booleano que indica si el usuario tiene mensajes o no.
   * @param {Object} state - El estado de Vuex del módulo de mensajes.
   * @returns {boolean} - Un valor booleano que indica si el usuario tiene mensajes o no.
   */
  hasMessages: (state) => state.messages.length > 0,
}

