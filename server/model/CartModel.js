const mongoose = require("mongoose");
//model for checkout page, save users' shopping cart item

const CartSchema = new mongoose.Schema({
  userId: String,
  cartItems: [
    {
      phone_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "phonelisting",
      },
      title: String,
      num: Number,
      price: Number,
      brand: String,
    },
  ],
  totalPrice: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Cart", CartSchema, "cart");
