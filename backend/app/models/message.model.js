const sql = require("./db.js");

const Message = function (message) {
  this.messageName = message.messageName;
  this.messageEmail = message.messageEmail;
  this.messageContent = message.messageContent;
};

Message.create = (newMessage, result) => {
  sql.query("INSERT INTO messages SET ?", newMessage, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("Message created: ", { id: res.insertId, ...newMessage });
    result(null, { id: res.insertId, ...newMessage });
  });
};

Message.getAll = (result) => {
  sql.query("SELECT * FROM messages", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    result(null, res);
  });
};

Message.findById = (messageId, result) => {
  sql.query(
    "SELECT * FROM messages WHERE messageId = ?",
    messageId,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.length) {
        console.log("found message: ", res[0]);
        result(null, res[0]);
        return;
      }
      // not found Category with the id
      result({ kind: "not_found" }, null);
    }
  );
};

Message.updateById = (messageId, message, result) => {
  sql.query(
    "UPDATE messages SET messageName = ?, messageEmail = ?, messageContent = ? WHERE messageId = ?",
    [message.messageName, message.messageEmail, message.messageContent, messageId],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.affectedRows == 0) {
        // not found Category with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated message: ", { id: messageId, ...message });
      result(null, { id: messageId, ...message });
    }
  );
};

Message.removeOne = (messageId, result) => {
  sql.query("DELETE FROM messages WHERE messageId = ?", messageId, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    if (res.affectedRows == 0) {
      // not found Category with the id
      result({ kind: "not_found" }, null);
      return;
    } else {
      console.log("deleted message with id:", messageId);
      result(null, res);
    }
  });
};

Message.removeAll = (result) => {
  sql.query("DELETE FROM messages", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    } else {
      console.log(`deleted ${res.affectedRows} messages`);
      result(null, res);
    }
  });
};

module.exports = Message;
