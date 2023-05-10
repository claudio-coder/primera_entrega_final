import { Schema, model } from "mongoose";

const collection = "products";

const productSchema = new Schema({
  title: String,
  description: {
    type: String,
    required: true,
  },
  price: Number,
  category: {
    type: String,
    required: true,
  },
});

export const productModel = model(collection, productSchema);
