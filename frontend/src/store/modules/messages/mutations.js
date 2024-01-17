export default {
  setMessages(state, messages) {
    state.messages = messages;
  },
  updateMessage(state, {messageId, messageName, messageEmail, messsageContent}) {
    const index = state.messages.findIndex(m => m.messageId === messageId);
    state.messages[index].messageName = messageName;
    state.messages[index].messageEmail = messageEmail;
    state.messages[index].messageContent = messsageContent;
  },
  addNewMessage(state, { messageName, messageEmail, messageContent }) {
    state.messages.push({
      messageName,
      messageEmail,
      messageContent,
    });
  },
  deleteMessage(state, messageId) {
    state.messages = state.messages.filter(
      m => m.messageId !== messageId
    );
  }
};
