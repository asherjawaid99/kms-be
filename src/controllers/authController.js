const User = require("../models/User/user");
const SuccessHandler = require("../utils/SuccessHandler");
const ErrorHandler = require("../utils/ErrorHandler");
const path = require("path");

//register
const register = async (req, res) => {
  // #swagger.tags = ['auth']
  try {
    const { firstName, lastName, email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      return ErrorHandler("User already exists", 400, req, res);
    }
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password,
    });
    newUser.save();
    return SuccessHandler("User created successfully", 200, res);
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

//login
const login = async (req, res) => {
  // #swagger.tags = ['auth']

  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return ErrorHandler("User does not exist", 400, req, res);
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return ErrorHandler("Invalid credentials", 400, req, res);
    }
   
    jwtToken = user.getJWTToken();
    return SuccessHandler(
      {
        token: jwtToken,
        user,
      },
      200,
      res
    );
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

const getProfile = async (req, res) => {
  // #swagger.tags = ['auth']
  try {
    const user = await User.findById(req.user._id);
    return SuccessHandler(user, 200, res);
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

const updateProfile = async (req, res) => {
  // #swagger.tags = ['auth']
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return ErrorHandler("User not found", 404, req, res);
    }
    const { firstName, lastName, email } = req.body;
    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    // user.role = role;

    if (req.body.password) {
      user.password = req.body.password;
    }
    if(req.files && req.files.profileImage){
      const { profileImage } = req.files;
      const filePath = `/uploads/${profileImage.name}`;
      profileImage.mv(path.join(__dirname, `../../uploads`, profileImage.name), (err) => {
        if (err) {
          console.log(err);
          return res.json({ err });
        }
      });
      user.profileImage = filePath;
    }
    await user.save();
    return SuccessHandler(user, 200, res);
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
};
