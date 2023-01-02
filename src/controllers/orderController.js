const customerModel = require("../models/customerModel");
const orderModel = require("../models/orderModel");

const { isValidObjectId } = require("../util/validator");

// -------------------------------------------------------------------------
//                   1. API - POST /orders/:customerID
//                  (Create an order for the customer).
// -------------------------------------------------------------------------

const createOrder = async (req, res) => {
  try {
    const customerID_Params = req.params.customerID.trim();
    if (!isValidObjectId(customerID_Params)) {
      return res.status(400).send({
        status: false,
        message: `customerID in Params: <${customerID_Params}> NOT a Valid Mongoose Object ID.`,
      });
    }
    //- Make sure the customer exist.
    const findCustomer = await customerModel.findById(customerID_Params);
    if (!findCustomer) {
      return res.status(404).send({
        status: false,
        message: `USER with ID: <${customerID_Params}> NOT Found in Database.`,
      });
    }

    //- Check if "ORDER" exists.
    let findOrder = await orderModel.findOne({ customerID: customerID_Params });

    let createOrder;

    // IF: ORDER does not Exist.
    if (!findOrder) {
      let order = { customerID: customerID_Params };

      createOrder = await orderModel.create(order);
    }
    // ELSE: ORDER Exists.
    else {
      findOrder.totalOrders += 1;

      if (findOrder.totalOrders == 20) {
        const updateCustomer = await customerModel.findOneAndUpdate(
          { _id: customerID_Params },
          { category: "Platinum" },
          { new: true }
        );
      } else if (findOrder.totalOrders == 10) {
        const updateCustomer = await customerModel.findOneAndUpdate(
          { _id: customerID_Params },
          { category: "Gold" },
          { new: true }
        );
      }

      //   console.log("\nfindCustomer.category: ", findCustomer.category);

      if (findOrder.totalOrders >= 20) {
        findOrder.discount = "20 %";
      } else if (findOrder.totalOrders >= 10) {
        findOrder.discount = "10 %";
      }

      createOrder = await orderModel.create(findOrder);

      if (findOrder.totalOrders == 9) {
        return res.status(201).send({
          status: true,
          message:
            "You have placed < 9 > orders with us. Buy one more stuff and you will be promoted to GOLD customer and enjoy 10% discounts!",
          data: createOrder,
        });
      }

      if (findOrder.totalOrders == 19) {
        return res.status(201).send({
          status: true,
          message:
            "You have placed < 19 > orders with us. Buy one more stuff and you will be promoted to PLATINUM customer and enjoy 20% discounts!.",
          data: createOrder,
        });
      }
    }

    // message: "Success",
    return res.status(201).send({
      status: true,
      message: "Order Placed Successfully.",
      data: createOrder,
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = {
  createOrder,
};
