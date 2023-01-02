const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const orderSchema = new mongoose.Schema(
  {
    customerID: { type: ObjectId, ref: "Customer", required: true, trim: true },

    totalOrders: { type: Number, default: 1 },

    discount: {
      type: String,
      default: "0 %",
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
