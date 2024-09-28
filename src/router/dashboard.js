const router = require("express").Router();
const { isAuthenticated, isAdmin } = require("../middleware/auth");
const dashboard = require("../controllers/dashboardController");

router.route("/").get(dashboard.dashboardStats);
router.route("/income").get(dashboard.incomeStats);
router.route("/orders").get(dashboard.orderStats);

module.exports = router;
