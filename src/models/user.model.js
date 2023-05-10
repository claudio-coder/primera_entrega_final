const { Schema, model } = require("mongoose");

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

const userModel = model(collection, userSchema);

model.exports = { userModel };
