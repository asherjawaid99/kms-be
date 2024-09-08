const auth = require("./auth");
const newsletter = require("./newsletter");
const meals = require("./meals");
const chef = require("./chef");
const router = require("express").Router();

router.use("/auth", auth);
router.use("/newsletter", newsletter);
router.use("/meals", meals);
router.use("/chef", chef);

module.exports = router;
