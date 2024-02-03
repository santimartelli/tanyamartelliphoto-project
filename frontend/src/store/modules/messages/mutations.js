/**
 * Las mutaciones de Vuex para el módulo de mensajes.
 */
export default {
  /**
   * Establece los mensajes del estado.
   * @param {Object} state - El estado de Vuex del módulo de mensajes.
   * @param {Object[]} messages - Los mensajes del estado.
   */
  setMessages(state, messages) {
    state.messages = messages;
  },

  /**
   * Actualiza un mensaje del estado.
   * @param {Object} state - El estado de Vuex del módulo de mensajes.
   * @param {number} messageId - El identificador del mensaje a actualizar.
   * @param {string} messageName - El nombre del mensaje a actualizar.
   * @param {string} messageEmail - El email del mensaje a actualizar.
   * @param {string} messageContent - El contenido del mensaje a actualizar.
   */
  updateMessage(state, {messageId, messageName, messageEmail, messsageContent}) {
    const index = state.messages.findIndex(m => m.messageId === messageId);
    state.messages[index].messageName = messageName;
    state.messages[index].messageEmail = messageEmail;
    state.messages[index].messageContent = messsageContent;
  },

  /**
   * Agrega un nuevo mensaje al estado.
   * @param {Object} state - El estado de Vuex del módulo de mensajes.
   * @param {string} messageName - El nombre del nuevo mensaje.
   * @param {string} messageEmail - El email del nuevo mensaje.
   * @param {string} messageContent - El contenido del nuevo mensaje.
   */
  addNewMessage(state, { messageName, messageEmail, messageContent }) {
    state.messages.push({
      messageName,
      messageEmail,
      messageContent,
    });
  },

  /**
   * Elimina un mensaje del estado.
   * @param {Object} state - El estado de Vuex del módulo de mensajes.
   * @param {number} messageId - El identificador del mensaje a eliminar.
   */
  deleteMessage(state, messageId) {
    state.messages = state.messages.filter(
      m => m.messageId !== messageId
    );
  }
};
