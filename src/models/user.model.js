import { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const collection = "usuarios";

const userSchema = new Schema({
  first_name: String,
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

userSchema.plugin(mongoosePaginate);

export const userModel = model(collection, userSchema);
