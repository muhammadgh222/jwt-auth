const jwt = require("jsonwebtoken");
const { promisify } = require("util");

const User = require("../models/userModel");

const jwtToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY,
  });
};
const signup = async (req, res) => {
  try {
    // Here we specify the fields we want to get from the request body
    //so that the user cannot set the role to admin with a post request
    const { username, email, password, passwordConfirm } = req.body;

    const newUser = await User.create({
      username,
      email,
      password,
      passwordConfirm,
    });

    const token = jwtToken(newUser._id);

    res.status(201).json({
      status: "success",
      newUser,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: "failed",
      error,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: "failed",
        message: "Please provied email and password",
      });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({
        status: "failed",
        message: "Invalid email or password",
      });
    }
    const token = jwtToken(user._id);

    res.status(201).json({
      status: "success",
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: "failed",
      error,
    });
  }
};

const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(403).json({
      message: "You are not logged in to access this route",
    });
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return res.status(401).json({
      message: "You are not logged in to access this route",
    });
  }
  req.user = currentUser;
  next();
};

const anycon = (req, res) => {
  res.send({
    status: "success",
    message: "hi",
  });
};
module.exports = { signup, login, protect, anycon };
