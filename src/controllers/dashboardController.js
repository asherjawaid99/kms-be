const SuccessHandler = require("../utils/SuccessHandler");
const ErrorHandler = require("../utils/ErrorHandler");
const Order = require("../models/User/order");
const User = require("../models/User/user");

const dashboardStats = async (req, res) => {
  // #swagger.tags = ['Dashboard']
  try {
    const totalEarnings = await Order.aggregate([
      { $match: { status: "completed" } },
      { $group: { _id: null, subTotal: { $sum: "$subTotal" } } },
    ]);
    const totalOrders = await Order.countDocuments({
      status: "completed",
    });
    const totalCustomers = await User.countDocuments({
      role: "user",
      isActive: true,
    });
    const totalChefs = await User.countDocuments({
      role: "chef",
      isActive: true,
    });

    return SuccessHandler(
      {
        totalEarnings: totalEarnings[0]?.subTotal || 0,
        totalOrders,
        totalCustomers,
        totalChefs,
      },
      200,
      res
    );
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};
const incomeStats = async (req, res) => {
  // #swagger.tags = ['Dashboard']
  try {
    const year = req.query.year
      ? {
          createdAt: {
            $gte: new Date(new Date(req.query.year).getFullYear(), 0, 1),
            $lt: new Date(new Date(req.query.year).getFullYear(), 11, 31),
          },
        }
      : {
          createdAt: {
            $gte: new Date(new Date().getFullYear(), 0, 1),
            $lt: new Date(new Date().getFullYear(), 11, 31),
          },
        };

    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const totalOrdersByMonth = await Order.aggregate([
      { $match: { status: "completed", ...year } },
      {
        $group: {
          _id: { $month: "$createdAt" },
          total: { $sum: "$subTotal" },
        },
      },
    ]);

    const orders = months.map((month, index) => {
      const order = totalOrdersByMonth.find(
        (order) => order._id === months.indexOf(month) + 1
      );
      return { month, total: order?.total || 0 };
    });

    return SuccessHandler(orders, 200, res);
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};
const orderStats = async (req, res) => {
  // #swagger.tags = ['Dashboard']
  try {
    const year = req.query.year
      ? {
          createdAt: {
            $gte: new Date(new Date(req.query.year).getFullYear(), 0, 1),
            $lt: new Date(new Date(req.query.year).getFullYear(), 11, 31),
          },
        }
      : {
          createdAt: {
            $gte: new Date(new Date().getFullYear(), 0, 1),
            $lt: new Date(new Date().getFullYear(), 11, 31),
          },
        };
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const totalOrdersByMonth = await Order.aggregate([
      { $match: { status: "completed", ...year } },
      {
        $group: {
          _id: { $month: "$createdAt" },
          total: { $sum: 1 },
        },
      },
    ]);

    const orders = months.map((month, index) => {
      const order = totalOrdersByMonth.find(
        (order) => order._id === months.indexOf(month) + 1
      );
      return { month, total: order?.total || 0 };
    });

    return SuccessHandler(orders, 200, res);
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

module.exports = {
  dashboardStats,
  incomeStats,
  orderStats,
};
