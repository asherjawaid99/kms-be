const { sendNotificationSocket } = require("../functions/socketFunctions");
const Notification = require("../models/User/notification");

const sendNotification = async (user, title, message, type, data) => {
  try {
    const notification = new Notification({
      user,
      title,
      message,
      type,
      data,
    });
    await notification.save();

    sendNotificationSocket(user, notification);
  } catch (error) {
    console.log(error);
  }
};

module.exports = sendNotification;
