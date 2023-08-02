import { connect } from "mongoose";
import { cartModel } from "../models/cart.model.js";
import { productModel } from "../models/product.model.js";

// export const jwt_secret_key = "palabraJwtSecreto";

let url =
  "mongodb+srv://ccabanas:0801MJmv@cluster0.1e2x8x2.mongodb.net/CentroMedicoVeterinario?retryWrites=true&w=majority";
export const connectDB = () => connect(url);
console.log("Base de datos conectada");

// export const connectDB = async () => {
//   try {
//     connect(url);
//     console.log("Base de datos conectada");

//     // crear un producto
//     await productModel.create({});
//     let productos = await productModel.find({});
//     console.log(productos);

//     // crear un carrito
//     await cartModel.create({
//       products: [],
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };
