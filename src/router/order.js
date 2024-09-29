const express = require("express");
const order = require("../controllers/orderController.js");
const { isAuthenticated, isAdmin } = require("../middleware/auth");
const router = express.Router();

router.route("/").get(isAuthenticated, order.getAllOrders);
router.route("/:id").get(isAuthenticated, order.getOrder);
router.route("/cart/checkout").post(order.checkout);
router.route("/").post(isAuthenticated, order.createOrder);
router.route("/update-status/:id").put(isAuthenticated, order.updateOrderStatus);

module.exports = router;