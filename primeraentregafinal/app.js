import express from "express";
import productsRoutes from "./routes/products.js";
import cartsRoutes from "./routes/carts.js";

const PORT = 8080;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/products", productsRoutes);
app.use("/api/carts", cartsRoutes);

app.get("/", (req, res) => {
  res.status(200).send("<h1>Estas Conectado</h1>");
});

app.listen(PORT, () => {
  console.log(`Escuchando el puerto : ${PORT}`);
});
