const jwt = require("jsonwebtoken");
const { isEmail } = require("validator");

const customerModel = require("../models/customerModel");

const {
  isValid,
  isValidName,
  isValidPassword,
  isValidRequestBody,
} = require("../util/validator");

// -------------------------------------------------------------------------
//                      1. API - POST /register
// -------------------------------------------------------------------------

const createCustomer = async function (req, res) {
  try {
    let data = req.body;

    if (!isValidRequestBody(data)) {
      return res
        .status(400)
        .send({ status: false, message: "Request Body Empty." });
    }

    // Destructuring Request-Body.
    const { name, email, password } = data;

    // <name> Validations.
    if (!isValid(name)) {
      return res.status(400).send({
        status: false,
        message: "Please enter <name>.",
      });
    }
    if (!isValidName(name)) {
      return res.status(400).send({
        status: false,
        message: "<name> should be Alphabets & Whitespace's Only.",
      });
    }

    // <email> Validations.
    if (!isValid(email)) {
      return res.status(400).send({
        status: false,
        message: "Please enter <email>.",
      });
    }
    if (!isEmail(email)) {
      return res.status(400).send({
        status: false,
        message: "<email> Format Invalid.",
      });
    }
    const emailExist = await customerModel.findOne({
      email: email,
    });
    if (emailExist) {
      return res.status(400).send({
        status: false,
        message: "<email> already registered.",
      });
    }

    // <password> Validations.
    if (!isValid(password)) {
      return res.status(400).send({
        status: false,
        message: "Please enter <password>.",
      });
    }
    if (!isValidPassword(password)) {
      return res.status(400).send({
        status: false,
        message: "<password> must be between 8 and 15 characters.",
      });
    }

    // <category> must be "Regular", when creating a customer at first.
    data.category = "Regular";

    // Create Document.
    let savedData = await customerModel.create(data);

    return res.status(201).send({
      status: true,
      message: "Customer created successfully.",
      data: savedData,
    });
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: error.message,
    });
  }
};

// -------------------------------------------------------------------------
//                        2. API - POST /login
// -------------------------------------------------------------------------

const login = async function (req, res) {
  try {
    if (!isValidRequestBody(req.body)) {
      return res
        .status(400)
        .send({ status: false, message: "Request Body Empty." });
    }

    const { email, password } = req.body;

    // <email> Validations.
    if (!isValid(email)) {
      return res
        .status(400)
        .send({ status: false, message: "Please provide <email>." });
    }
    if (!isEmail(email)) {
      return res
        .status(400)
        .send({ status: false, message: "<email> Format Invalid." });
    }

    // <password> Validations.
    if (!isValid(password)) {
      return res
        .status(400)
        .send({ status: false, message: "Please provide <password>." });
    }
    if (!isValidPassword(password)) {
      return res.status(400).send({
        status: false,
        message: "<password> must be between 8 and 15 characters.",
      });
    }

    // Check if user is Valid.
    let findCustomer = await customerModel.findOne({ email, password });
    if (!findCustomer) {
      return res.status(401).send({
        status: false,
        message: "Invalid Credentials.",
      });
    }

    // Create JWT Token.
    let token = jwt.sign(
      { customerID: findCustomer._id },
      "This-is-a-Secret-Key-for-Login(!@#$%^&*(</>)))",
      {
        expiresIn: "24h", // 24 Hours.
      }
    );

    // Data to be sent as response.
    const customerData = {
      customerID: findCustomer._id,
      token: token,
    };

    // Send Response.
    return res.status(200).send({
      status: true,
      message: "Customer logged-in successfully.",
      data: customerData,
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = {
  createCustomer,
  login,
};
