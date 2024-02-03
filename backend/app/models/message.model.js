// Representa el modelo de mensaje y contiene las funciones para interactuar con la base de datos.

const sql = require("./db.js");

/**
 * Representación del modelo de mensaje.
 * @constructor
 * @param {object} message - El objeto mensaje con los datos del mensaje.
 * @param {string} message.messageName - El nombre de la persona que envía el mensaje.
 * @param {string} message.messageEmail - El email de la persona que envía el mensaje.
 * @param {string} message.messageContent - El contenido del mensaje.
 */
const Message = function (message) {
  this.messageName = message.messageName;
  this.messageEmail = message.messageEmail;
  this.messageContent = message.messageContent;
};

/**
 * Crea un nuevo mensaje, lo guarda en la base de datos y devuelve el resultado.
 * @param {object} newMessage - El nuevo objeto mensaje.
 * @param {function} result - La función de callback que maneja la respuesta de la base de datos.
 */
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

/**
 * Obtiene todos los mensajes de la base de datos y devuelve el resultado.
 * @param {function} result - La función de callback que maneja la respuesta de la base de datos.
 */
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

/**
 * Busca un mensaje por su ID y Devuelve el resultado.
 * @param {number} messageId - El ID del mensaje a buscar.
 * @param {function} result - La función de callback que maneja la respuesta de la base de datos.
 */
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
      result({ kind: "not_found" }, null);
    }
  );
};

/**
 * Actualiza un mensaje existente de la base de datos por su ID y devuelve el resultado.
 * @param {number} messageId - El ID del mensaje a actualizar.
 * @param {object} message - El objeto mensaje actualizado.
 * @param {function} result - La función de callback que maneja la respuesta de la base de datos.
 */
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
        result({ kind: "not_found" }, null);
        return;
      }
      console.log("updated message: ", { id: messageId, ...message });
      result(null, { id: messageId, ...message });
    }
  );
};

/**
 * Elimina un mensaje de la base de datos por su ID y devuelve el resultado.
 * @param {number} messageId - El ID del mensaje a eliminar.
 * @param {function} result - La función de callback que maneja la respuesta de la base de datos.
 */
Message.removeOne = (messageId, result) => {
  sql.query("DELETE FROM messages WHERE messageId = ?", messageId, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    if (res.affectedRows == 0) {
      result({ kind: "not_found" }, null);
      return;
    } else {
      console.log("deleted message with id:", messageId);
      result(null, res);
    }
  });
};

/**
 * Elimina todos los mensajes de la base de datos y devuelve el resultado.
 * @param {function} result - La función de callback que maneja la respuesta de la base de datos.
 */
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
