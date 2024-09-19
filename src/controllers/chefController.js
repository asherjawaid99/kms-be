const SuccessHandler = require("../utils/SuccessHandler");
const ErrorHandler = require("../utils/ErrorHandler");
const path = require("path");
const User = require("../models/User/user");
const Attendance = require("../models/User/attendance");
const Meal = require("../models/Meals/meals");
const sendNotification = require("../utils/sendNotification");

const getAllChefs = async (req, res) => {
  // #swagger.tags = ['chefs']
  try {
    const searchFilter = req.query.search
      ? {
          $or: [
            { firstName: { $regex: req.query.search, $options: "i" } },
            { lastName: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const chefs = await User.find({ role: "chef", ...searchFilter })
      .skip(skip)
      .limit(limit);
    return SuccessHandler(chefs, 200, res);
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

const getChef = async (req, res) => {
  // #swagger.tags = ['chefs']
  try {
    const chef = await User.findById(req.params.id);
    if (!chef) {
      return ErrorHandler("Chef not found", 404, req, res);
    }
    return SuccessHandler(chef, 200, res);
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

const updateChef = async (req, res) => {
  // #swagger.tags = ['chefs']
  try {
    const chef = await User.findById(req.params.id);
    if (!chef) {
      return ErrorHandler("Chef not found", 404, req, res);
    }
    const { firstName, lastName, kitchenNo, status } = req.body;
    chef.firstName = firstName;
    chef.lastName = lastName;
    chef.kitchenNo = kitchenNo;
    chef.status = status;
    // chef.email = email;
    // chef.role = role;

    if (req.body.password) {
      chef.password = req.body.password;
    }

    if (req.files && req.files.profileImage) {
      const { profileImage } = req.files;
      const filePath = `/uploads/${profileImage.name}`;
      profileImage.mv(
        path.join(__dirname, `../../uploads`, profileImage.name),
        (err) => {
          if (err) {
            console.log(err);
            return res.json({ err });
          }
        }
      );
      chef.profileImage = filePath;
    }

    await chef.save();
    return SuccessHandler(chef, 200, res);
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

const lowStock = async (req, res) => {
  // #swagger.tags = ['chefs']
  try {
    const { mealId } = req.params;
    const meal = await Meal.findById(mealId);
    if (!meal) {
      return ErrorHandler("Meal not found", 404, req, res);
    }
    if (meal.stock < 10) {
      return ErrorHandler("Stock is not low", 200, req, res);
    }
    SuccessHandler("Notification sent", 200, res);
    const admins = await User.find({ role: "admin" });
    Promise.all(
      admins.map(async (admin) => {
        await sendNotification(
          admin._id,
          "Low stock",
          `${meal.title} is running low in stock`,
          "lowStock",
          {
            mealId: meal._id,
          }
        );
      })
    );
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

const markAttendance = async (req, res) => {
  // #swagger.tags = ['chefs']
  try {
    const chef = await User.findById(req.user._id);
    if (!chef) {
      return ErrorHandler("Chef not found", 404, req, res);
    }
    const attendance = await Attendance.findOne({
      user: req.user._id,
      date: new Date().toDateString(),
    });
    if (attendance) {
      return ErrorHandler("Attendance already marked", 400, req, res);
    }
    const newAttendance = await Attendance.create({
      user: req.user._id,
      date: new Date().toDateString(),
    });
    await newAttendance.save();
    await chef.save();
    return SuccessHandler(`Attendance marked`, 200, res);
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

const getAttendance = async (req, res) => {
  // #swagger.tags = ['chefs']
  try {
    const { userId } = req.params;
    // if not startDate is provided, default to current month
    const startDate =
      req.body.startDate || new Date().toISOString().slice(0, 8) + "01";
    const endDate = req.body.endDate || new Date().toISOString().slice(0, 10);

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const attendance = await Attendance.find({
      user: userId,
      date: { $gte: startDate, $lte: endDate },
    })
      .populate("user")
      .skip(skip)
      .limit(limit);
    return SuccessHandler(attendance, 200, res);
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

module.exports = {
  getAllChefs,
  getChef,
  updateChef,
  lowStock,
  markAttendance,
  getAttendance,
};
