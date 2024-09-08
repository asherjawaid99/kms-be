const express = require("express");
const { isAuthenticated, isAdmin } = require("../middleware/auth");
const router = express.Router();
const meals = require("../controllers/mealController");

router.route("/").get(meals.getAllMeals);
router.route("/").post(isAuthenticated, isAdmin, meals.createMeal);
router.route("/:id").get(meals.getMeal);
router.route("/:id").put(isAuthenticated, isAdmin, meals.updateMeal);
router.route("/:id").delete(isAuthenticated, isAdmin, meals.deleteMeal);

// category routes
router.route("/category").get(meals.getAllCategories);
router.route("/category").post(isAuthenticated, isAdmin, meals.createCategory);

module.exports = router;
