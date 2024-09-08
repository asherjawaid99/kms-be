const express = require("express");
const chef = require("../controllers/chefController");
const { isAuthenticated, isAdmin } = require("../middleware/auth");
const router = express.Router();

router.route("/").get(isAuthenticated, isAdmin, chef.getAllChefs);
router.route("/:id").get(isAuthenticated, isAdmin, chef.getChef);
router.route("/mark-attendance").get(isAuthenticated, chef.markAttendance);
router.route("/low-stock/:mealId").get(isAuthenticated, chef.lowStock);
router.route("/get-attendance/:userId").post(isAuthenticated, chef.getAttendance);


module.exports = router;
