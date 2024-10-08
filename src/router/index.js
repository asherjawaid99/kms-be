const auth = require("./auth");
const newsletter = require("./newsletter");
const meals = require("./meals");
const chef = require("./chef");
const order = require("./order");
const notification = require("./notification");
const dashboard = require("./dashboard");
const router = require("express").Router();

router.use("/auth", auth);
router.use("/newsletter", newsletter);
router.use("/meals", meals);
router.use("/chef", chef);
router.use("/order", order);
router.use("/notification", notification);
router.use("/dashboard", dashboard);

module.exports = router;
