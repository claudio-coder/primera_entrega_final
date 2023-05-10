import { connect } from "mongoose";

let url =
  "mongodb+srv://ccabanas:0801MJmv@cluster0.1e2x8x2.mongodb.net/CentroMedicoVeterinario?retryWrites=true&w=majority";

export const connectDB = () => connect(url);
console.log("Base de datos conectada");
