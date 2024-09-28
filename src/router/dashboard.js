const router = require("express").Router();
const { isAuthenticated, isAdmin } = require("../middleware/auth");
const dashboard = require("../controllers/dashboardController");

router.route("/").get(isAuthenticated, isAdmin, dashboard.dashboardStats);
router.route("/income").get(isAuthenticated, isAdmin, dashboard.incomeStats);
router.route("/orders").get(isAuthenticated, isAdmin, dashboard.orderStats);

module.exports = router;
