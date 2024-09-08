const express = require("express");
const auth = require("../controllers/authController");
const {isAuthenticated} = require("../middleware/auth");
const router = express.Router();

router.route("/register").post(auth.register);
router.route("/login").post(auth.login);
router.route("/profile").get(isAuthenticated, auth.getProfile);
router.route("/profile/:id").put(isAuthenticated, auth.updateProfile);

module.exports = router;
