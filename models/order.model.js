const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    // user_id:String, //chua cần vì chưa làm đăng ký
    cart_id: String,
    userInfo: {
      fullName: String,
      phone: String,
      address: String
    },
    products: [
      {
        Product_id: String,
        price: Number,
        discountPercentage: Number,
        quantity: Number
      }
    ],
    deleted: {
      type: Boolean,
      default: false
    },
    deletedAt: Date
  },
  {
    timestamps: true
  }
);
const Order = mongoose.model('Order', orderSchema, "orders");
module.exports = Order;