import express from "express";
import fs from "fs";

const PORT = 8080;
const app = express();
import { ProductManager } from "./ProductManager.js";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const productManager = new ProductManager("./products.json");

app.get("/products", async (req, res) => {
  const limit = req.query.limit;

  const products = await productManager.getProducts();

  if (limit !== undefined) {
    const productsLimits = products.slice(0, limit);
    res.send(productsLimits);
    return;
  }

  res.send(products);
});

app.get("/products/:pid", async (req, res) => {
  const product = await productManager.getProductById(Number(req.params.pid));
  if (product === undefined) {
    const error = {
      error: "El producto no existe",
    };
    res.send(error);
    return;
  }

  res.send(product);
});

app.post("/products", async (req, res) => {
  let product = req.body;

  try {
    const products = await productManager.addProduct(
      product.title,
      product.description,
      product.price,
      product.thumbnail,
      product.code,
      product.status,
      product.category,
      product.stock
    );
    res.status(200).send({ products });
  } catch (error) {
    res.status(404).send({ error: error.message });
  }
});

app.put("/products/:pid", async (req, res) => {
  const { pid } = req.params;
  let product = req.body;

  try {
    const products = await productManager.updateProduct(Number(pid), product);
    res.status(200).send({ products });
  } catch (error) {
    return res.status(400).send({
      error: error.message,
    });
  }
});

app.delete("/products/:pid", async (req, res) => {
  let { pid } = req.params;

  try {
    const products = await productManager.deleteProduct(Number(pid));
    res.status(200).send({ products });
  } catch (error) {
    return res.status(400).send({
      error: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Escuchando el puerto : ${PORT}`);
});
