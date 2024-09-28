const SuccessHandler = require("../utils/SuccessHandler");
const ErrorHandler = require("../utils/ErrorHandler");
const Meal = require("../models/Meals/meals");
const Category = require("../models/Meals/category");
const path = require("path");

const getAllMeals = async (req, res) => {
  // #swagger.tags = ['meals']
  try {
    const searchFilter = req.query.search
      ? { title: { $regex: req.query.search, $options: "i" } }
      : {};

    const categoryFilter =
      req.query.category && req.query.category !== "all"
        ? { category: req.query.category }
        : {};

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const meals = await Meal.find({
      ...searchFilter,
      ...categoryFilter,
      isActive: true,
    })
      .populate("category")
      .skip(skip)
      .limit(limit);
    return SuccessHandler(meals, 200, res);
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

const getMeal = async (req, res) => {
  // #swagger.tags = ['meals']
  try {
    const meal = await Meal.findById(req.params.id).populate("category");
    if (!meal) {
      return ErrorHandler("Meal not found", 404, req, res);
    }
    return SuccessHandler(meal, 200, res);
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

const createMeal = async (req, res) => {
  // #swagger.tags = ['meals']
  try {
    const {
      title,
      description,
      servings,
      price,
      stock,
      discount,
      category,
      tags,
    } = req.body;

    if (!req.files || !req.files?.images) {
      return ErrorHandler("Images are required", 400, req, res);
    }

    const imagePaths = req.files.images.map((image) => {
      return `/uploads/${image.name}`;
    });

    Promise.all(
      req.files.images.map((image) => {
        return image.mv(path.join(__dirname, `../../uploads`, image.name));
      })
    );

    const meal = await Meal.create({
      title,
      description,
      servings,
      price,
      stock,
      discount,
      category,
      tags,
      images: imagePaths,
    });
    return SuccessHandler(meal, 201, res);
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

const updateMeal = async (req, res) => {
  // #swagger.tags = ['meals']
  try {
    const meal = await Meal.findById(req.params.id);
    if (!meal) {
      return ErrorHandler("Meal not found", 404, req, res);
    }
    const {
      title,
      description,
      servings,
      price,
      stock,
      discount,
      category,
      tags,
      previousImages,
    } = req.body;

    let images = JSON.parse(previousImages);

    if (req.files && req.files.images) {
      const imagePaths = req.files.images.map((image) => {
        return `/uploads/${image.name}`;
      });

      Promise.all(
        req.files.images.map((image) => {
          return image.mv(path.join(__dirname, `../../uploads`, image.name));
        })
      );

      images = [...images, ...imagePaths];
    }

    meal.title = title;
    meal.description = description;
    meal.servings = servings;
    meal.price = price;
    meal.stock = stock;
    meal.discount = discount;
    meal.category = category;
    meal.tags = tags;
    meal.images = images;

    await meal.save();

    return SuccessHandler(meal, 200, res);
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

const deleteMeal = async (req, res) => {
  // #swagger.tags = ['meals']
  try {
    const meal = await Meal.findById(req.params.id);
    if (!meal) {
      return ErrorHandler("Meal not found", 404, req, res);
    }
    meal.isActive = false;
    await meal.save();
    return SuccessHandler({}, 204, res);
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

const getAllCategories = async (req, res) => {
  // #swagger.tags = ['meals']
  try {
    const categories = await Category.find();
    return SuccessHandler(categories, 200, res);
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

const createCategory = async (req, res) => {
  // #swagger.tags = ['meals']
  try {
    const { category } = req.body;
    const exCategory = await Category.findOne({ 
      name: category
     });
    if (exCategory) {
      return ErrorHandler("Category already exists", 400, req, res);
    }
    const meal = await Category.create({
      name: category,
    });
    return SuccessHandler(meal, 201, res);
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

module.exports = {
  getAllMeals,
  getMeal,
  createMeal,
  updateMeal,
  deleteMeal,
  getAllCategories,
  createCategory,
};
