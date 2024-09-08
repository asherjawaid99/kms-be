const auth = require("./auth");
const newsletter = require("./newsletter");
const meals = require("./meals");
const router = require("express").Router();

router.use("/auth", auth);
router.use("/newsletter", newsletter);
router.use("/meals", meals);

module.exports = router;
