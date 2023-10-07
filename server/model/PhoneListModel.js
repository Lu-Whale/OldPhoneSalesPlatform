const mongoose = require("mongoose");

const phoneListSchema = new mongoose.Schema(
  {
    title: String,
    brand: String,
    image: String,
    stock: Number,
    seller: String,
    averageRating: { type: Number, default: 0 },
    sellerName: { type: String, default: "" },
    price: Number,
    enable: { type: Boolean, default: true },
    reviews: [
      {
        reviewer: String,
        reviewerName: { type: String, default: "" },
        rating: Number,
        comment: String,
        hidden: { type: Boolean, default: false }, //should be false or ture ????
      },
    ],
  },
  {
    collection: "phonelistingdemo",
  }
);

module.exports = mongoose.model(
  "phonelistingdemo",
  phoneListSchema,
  "phonelistingdemo"
);
