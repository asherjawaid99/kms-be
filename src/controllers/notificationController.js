const SuccessHandler = require("../utils/SuccessHandler");
const ErrorHandler = require("../utils/ErrorHandler");
const Notification = require("../models/User/notification");

const getAllNotifications = async (req, res) => {
  // #swagger.tags = ['Notifications']
  try {
    const notifications = await Notification.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    SuccessHandler(notifications, 200, res);
    await Notification.updateMany(
      { user: req.user._id, isRead: false },
      { isRead: true }
    );
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};
const getUnreadCount = async (req, res) => {
  // #swagger.tags = ['Notifications']
  try {
    const count = await Notification.countDocuments({
      user: req.user._id,
      isRead: false,
    });
    return SuccessHandler(count, 200, res);
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

module.exports = {
  getAllNotifications,
  getUnreadCount,
};
