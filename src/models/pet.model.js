import { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const collection = "pets";

const petSchema = new Schema({
  name: String,
  specie: String,
});

petSchema.plugin(mongoosePaginate);

export const petModel = model(collection, petSchema);
