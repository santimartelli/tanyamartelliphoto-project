import axios from "axios";

export default {
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