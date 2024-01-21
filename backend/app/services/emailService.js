const nodemailer = require("nodemailer");
// require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "santimartelli@gmail.com",
    pass: "bdpt kdap zbdm zpsc",
  },
});

const sendEmail = (mailOptions) => {
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};

exports.sendMessageConfirmationEmail = (recipentEmail, messageData) => {
  const mailOptions = {
    from: {
      name: "Tanya Martelli Photography",
      address: "santimartelli@gmail.com",
    },
    to: [
      "santimartelli@gmail.com",
      "tanyamartelliphoto@gmail.com",
      recipentEmail,
    ], //Agregar el email del cliente req.body.messageEmail
    subject: "We received your message!",
    text: `Hello ${messageData.messageName},\n\nThank you for reaching out to us. We have received your message and will get back to you soon.\n\nBest regards,\nTatiana from Tanya Martelli Photography Team`,
  };
  sendEmail(mailOptions);
};

exports.sendMessageNotificationEmail = (messageData) => {
  const mailOptions = {
    from: {
      name: "Tanya Martelli Photography",
      address: "santimartelli@gmail.com",
    },
    to: ["santimartelli@gmail.com", "tanyamartelliphoto@gmail.com"], // Your own email to receive notifications
    subject:
      "Tanya Martelli Photography - New message received from " +
      messageData.messageName,
    text: `You have received a new message from ${messageData.messageName} (${messageData.messageEmail}): ${messageData.messageContent}`,
  };
  sendEmail(mailOptions);
};

exports.sendBookingRequestConfirmationEmail = (to, bookingData) => {
  const mailOptions = {
    from: {
      name: "Tanya Martelli Photography",
      address: "santimartelli@gmail.com",
    },
    to: to,
    subject: "We received your booking request!",
    text: `Hello ${bookingData.name},\n\nThank you for your booking request. We will get back to you soon to finalize the details.\n\nBest regards,\nTatiana\nfrom Tanya Martelli Photography Team`,
  };
  sendEmail(mailOptions);
};

exports.sendBookingRequestNotificationEmail = (bookingData) => {
  const mailOptions = {
    from: {
      name: "Tanya Martelli Photography",
      address: "santimartelli@gmail.com",
    },
    to: ["santimartelli@gmail.com", "tanyamartelliphoto@gmail.com"],
    subject:
      "Tanya Martelli Photography - New booking request received from " +
      bookingData.name,
    text: `You have received a new booking request with the following details:\n\nName: ${bookingData.name}\nEmail: ${bookingData.email}\nCategory: ${bookingData.categoryId}\nLocation: ${bookingData.location}\nPlace: ${bookingData.place}\nDate: ${bookingData.selectedDate}\nTime: ${bookingData.selectedTime}\n\nMessage: ${bookingData.message}`,
  };
  sendEmail(mailOptions);
};

exports.updated
