const express = require("express");
const router = express.Router();

// Middleware Functions.
const { authentication, authorization } = require("../middleware/auth");

// Customer Functions.
const { createCustomer, login } = require("../controllers/customerController");

// Order Functions.
const { createOrder } = require("../controllers/orderController");

// --------------------------- Customer APIs. ---------------------------------
router.post("/register", createCustomer);

router.post("/login", login);

// ------------------------- Order APIs. -----------------------------------
router.post("/orders/:customerID", authentication, authorization, createOrder);

// ---------------- If API is Invalid (OR Wrong URL) -------------------------
router.all("/**", function (req, res) {
  return res
    .status(404)
    .send({ status: false, message: "Requested API is not available." });
});

module.exports = router;
