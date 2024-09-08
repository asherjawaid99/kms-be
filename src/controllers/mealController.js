const SuccessHandler = require("../utils/SuccessHandler");
const ErrorHandler = require("../utils/ErrorHandler");
const Meal = require("../models/Meals/meals");
const path = require("path");

const getAllMeals = async (req, res) => {
  // #swagger.tags = ['meals']
  try {
    const meals = await Meal.find({
      isActive: true,
    });
    return SuccessHandler(meals, 200, res);
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

const getMeal = async (req, res) => {
  // #swagger.tags = ['meals']
  try {
    const meal = await Meal.findById(req.params.id);
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

    let images = previousImages;

    if (req.files && req.files.images) {
      const imagePaths = req.files.images.map((image) => {
        return `/uploads/${image.name}`;
      });

      Promise.all(
        req.files.images.map((image) => {
          return image.mv(path.join(__dirname, `../../uploads`, image.name));
        })
      );

      images = [...previousImages, ...imagePaths];
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

module.exports = {
  getAllMeals,
  getMeal,
  createMeal,
  updateMeal,
  deleteMeal,
};
