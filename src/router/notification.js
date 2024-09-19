const router = require("express").Router();
const notification = require("../controllers/notificationController.js");
const { isAuthenticated, isAdmin } = require("../middleware/auth");

router.route("/").get(isAuthenticated, isAdmin, notification.getAllNotifications);
router.route("/unread-count").get(isAuthenticated, notification.getUnreadCount);

module.exports = router;