import { Schema, model } from "mongoose";

const collection = "carts";

const cartSchema = new Schema({
  // email:String,
  products: [
    {
      products: {
        type: Schema.Types.ObjectId,
        ref: "products",
      },
      quantity: Number,
    },
  ],
});

cartSchema.pre("findeOne", function () {
  this.populate("products.product");
});

export const cartModel = model(collection, cartSchema);
