const mongoose = require("mongoose");

const isValid = function (value) {
  if (typeof value === "undefined" || value === null) return false;
  if (typeof value === "string" && value.trim().length === 0) return false;
  if (typeof value === "number" && value.toString().trim().length === 0)
    return false;
  return true;
};

const isValidRequestBody = function (requestBody) {
  return Object.keys(requestBody).length > 0;
};

const isValidObjectId = function (data) {
  let stringId = data.toString().toLowerCase();
  if (!mongoose.Types.ObjectId.isValid(stringId)) {
    return false;
  }
  let result = new mongoose.Types.ObjectId(stringId);
  if (result.toString() != stringId) {
    return false;
  }
  return true;
};

const isValidName = function (name) {
  return /^[a-zA-Z ]*$/.test(name);
};

const isValidPassword = function (password) {
  return password.length >= 8 && password.length <= 15;
};

module.exports = {
  isValid,
  isValidObjectId,
  isValidRequestBody,
  isValidName,
  isValidPassword,
};
