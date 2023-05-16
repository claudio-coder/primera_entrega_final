import { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const collection = "products";

const productSchema = new Schema({
  title: String,
  description: {
    type: String,
    // required: true,
  },
  price: Number,
  thumbnail: String,
  code: String,
  // status: true,
  category: {
    type: String,
    // required: true,
  },
  stock: Number,
});

productSchema.plugin(mongoosePaginate);

export const productModel = model(collection, productSchema);
