const express = require("express");
const router = express.Router();
const Newsletter = require("../models/Newsletter/newsletter");

router.route("/subscribe").post(async (req, res) => {
  try {
    const { email } = req.body;
    const subscriber = await Newsletter.findOne({ email });
    if (subscriber) {
      return res
        .status(400)
        .json({ success: false, message: "Email already subscribed" });
    }
    const newSubscriber = await Newsletter.create({
      email,
    });
    newSubscriber.save();
    return res
      .status(200)
      .json({ success: true, message: "Email subscribed successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;