import axios from "axios";

export default {
  /**
   * Devuelve los mensajes de la API y los establece en el estado.
   * @param {Object} state - El estado de Vuex del módulo de mensajes.
   * @returns {Object[]} - Los mensajes del estado.
   */
  getMessages({ commit }) {
    axios
      .get("http://localhost:3000/api/messages")
      .then((res) => {
        commit("setMessages", res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  },

  /**
   * Actualiza un mensaje en la API y en el estado.
   * @param {Object} context - El contexto de Vuex.
   * @param {Object} context.commit - La función de Vuex para realizar una mutación.
   * @param {Object} context.dispatch - La función de Vuex para despachar una acción.
   * @param {string} messageId - El ID del mensaje que se actualizará.
   * @param {string} messageName - El nombre del mensaje que se actualizará.
   * @param {string} messageEmail - El email del mensaje que se actualizará.
   * @param {string} messageContent - El contenido del mensaje que se actualizará.
   * @returns {Promise} - Devuelve una promesa que se resuelve cuando la solicitud se completa.
   * @throws {Error} - Si la solicitud falla, se lanza un error con el mensaje de error.
   */
  updateMessage({ commit, dispatch }, { messageId, messageName, messageEmail, messageContent }) {
    return axios
      .put(`http://localhost:3000/api/messages/${messageId}`, {
        messageName,
        messageEmail,
        messageContent,
      })
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          dispatch("getMessages");
          commit("updateMessage", { messageId, messageName, messageEmail, messageContent });
        } else {
          console.error(`Edit request failed with status: ${response.status}`);
        }
        return response;
      })
      .catch((error) => {
        // Handle network errors or other exceptions
        console.error("Edit request failed with error:", error);
      });
  },

  /**
   * Agrega un nuevo mensaje a la API y al estado.
   * @param {Object} context - El contexto de Vuex.
   * @param {Object} context.commit - La función de Vuex para realizar una mutación.
   * @param {Object} context.dispatch - La función de Vuex para despachar una acción.
   * @param {string} messageName - El nombre del nuevo mensaje.
   * @param {string} messageEmail - El email del nuevo mensaje.
   * @param {string} messageContent - El contenido del nuevo mensaje.
   * @returns {Promise} - Devuelve una promesa que se resuelve cuando la solicitud se completa.
   * @throws {Error} - Si la solicitud falla, se lanza un error con el mensaje de error.
   */
  addNewMessage({ commit, dispatch }, { messageName, messageEmail, messageContent }) {
    return axios
      .post(`http://localhost:3000/api/messages`, {
        messageName: messageName,
        messageEmail: messageEmail,
        messageContent: messageContent,
      })
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          const responseData = response.data; // capture the response data
          dispatch("getMessages");
          commit("addNewMessage", { messageName: responseData.messageName, messageEmail: responseData.messageEmail, messageContent: responseData.messageContent });
        } else {
          console.error(`Add request failed with status: ${response.status}`);
          throw new Error(`Add request failed with status: ${response.status}`);
        }
        return response;
      })
      .catch((error) => {
        console.error("Add request failed with error:", error);
        throw error;
      });
  },

  /**
   * Envía un correo electrónico de respuesta a un mensaje.
   * @param {Object} context - El contexto de Vuex.
   * @param {Object} context.commit - La función de Vuex para realizar una mutación.
   * @param {string} name - El nombre del remitente del mensaje.
   * @param {string} email - El email del remitente del mensaje.
   * @param {string} message - El mensaje del remitente del mensaje.
   * @param {string} messageContent - El contenido del mensaje de respuesta.
   * @returns {Promise} - Devuelve una promesa que se resuelve cuando la solicitud se completa.
   * @throws {Error} - Si la solicitud falla, se lanza un error con el mensaje de error.
   */
  replyMessage(context, { name, email, message, messageContent }) {
    return axios
      .post(`http://localhost:3000/api/email/reply`, {
        name,
        email,
        message,
        messageContent,
      })
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          console.log("Successfully sent reply email");
        } else {
          console.error(`Reply request failed with status: ${response.status}`);
        }
        return response;
      })
      .catch((error) => {
        console.error("Reply request failed with error:", error);
      });
  },

  /**
   * Elimina un mensaje de la API y del estado.
   * @param {Object} context - El contexto de Vuex.
   * @param {Object} context.commit - La función de Vuex para realizar una mutación.
   * @param {Object} context.dispatch - La función de Vuex para despachar una acción.
   * @param {string} messageId - El ID del mensaje que se eliminará.
   * @returns {Promise} - Devuelve una promesa que se resuelve cuando la solicitud se completa.
   * @throws {Error} - Si la solicitud falla, se lanza un error con el mensaje de error.
   */
  deleteMessage({ commit, dispatch }, messageId) {
    return axios
      .delete(`http://localhost:3000/api/messages/${messageId}`)
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          // Successfully deleted, commit the mutation and dispatch any necessary actions
          console.log("Successfully deleted message with ID:", messageId);
          commit("deleteMessage", messageId);
          dispatch("getMessages");
        } else {
          // Handle unexpected status codes (e.g., 404, 500, etc.)
          console.error(
            `Delete request failed with status: ${response.status}`
          );
        }
        return response;
      })
      .catch((error) => {
        // Handle network errors or other exceptions
        console.error("Delete request failed with error:", error);
      });
  },
};