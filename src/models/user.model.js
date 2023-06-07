import { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const collection = "usuarios";

const userSchema = new Schema({
  username: String,
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
  password: String,
  role: { type: String, enum: ["admin", "usuario"] },
});

userSchema.plugin(mongoosePaginate);

export const userModel = model(collection, userSchema);
