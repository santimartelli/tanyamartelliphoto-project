const MessageModel = require("../models/message.model.js");
const emailService = require("../services/emailService.js");


exports.create = (req, res) => {
  console.log(req.body);
  if (
    !req.body.messageName ||
    !req.body.messageEmail ||
    !req.body.messageContent
  ) {
    res.status(400).send({ message: "Please complete all the fields" });
    return;
  }
  const newMessage = new MessageModel({
    messageName: req.body.messageName,
    messageEmail: req.body.messageEmail,
    messageContent: req.body.messageContent,
  });

  MessageModel.create(newMessage, (err, data) => {
    if (err) {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the message.",
      });
    } else {
      // Send email to the client
      emailService.sendMessageConfirmationEmail(req.body.messageEmail, req.body);
      // Send email to the admin
      emailService.sendMessageNotificationEmail(req.body);
      res.send(data);
    }
  });
};

exports.findAll = (req, res) => {
  MessageModel.getAll((err, data) => {
    if (err) {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving the messages.",
      });
    } else {
      res.send(data);
    }
  });
};

exports.findOne = (req, res) => {
  MessageModel.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res
          .status(404)
          .send({ message: `Message not found with id ${req.params.id}` });
      } else {
        res
          .status(500)
          .send({
            message: "Error retrieving message with id " + req.params.id,
          });
      }
    } else {
      res.send(data);
    }
  });
};

exports.update = (req, res) => {
  if (!req.body) {
    res.status(400).send({ message: "Message can not be empty!" });
    return;
  }

  MessageModel.updateById(
    req.params.id,
    new MessageModel(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res
            .status(404)
            .send({ message: `Message not found with id ${req.params.id}` });
        } else {
          res
            .status(500)
            .send({
              message: "Error updating message with id " + req.params.id,
            });
        }
      } else {
        res.send(data);
      }
    }
  );
};

exports.deleteOne = (req, res) => {
  MessageModel.removeOne(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res
          .status(404)
          .send({ message: `Message not found with id ${req.params.id}` });
      } else {
        res
          .status(500)
          .send({
            message: "Could not delete the message with id " + req.params.id,
          });
      }
    } else {
      res.send({ message: "Message deleted successfully!" });
    }
  });
};

exports.deleteAll = (req, res) => {
  MessageModel.removeAll((err, data) => {
    if (err) {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all messages.",
      });
    } else {
      res.send({ message: "All messages deleted successfully!" });
    }
  });
};
