import express from "express";
import fs from "fs";
import { CartManager } from "./CartManager.js";

const PORT = 8080;
const app = express();
import { ProductManager } from "./ProductManager.js";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const productManager = new ProductManager("./products.json");
const cartManager = new CartManager("./carts.json", productManager);

app.get("/", (req, res) => {
  res.status(200).send("<h1>Estas Conectado</h1>");
});

app.get("/api/products", async (req, res) => {
  try {
    const limit = req.query.limit;

    const products = await productManager.getProducts();

    if (limit !== undefined) {
      const productsLimits = products.slice(0, limit);
      res.send({ status: "success", products: productsLimits });
      return;
    }
    return res.send({ status: "success", products: products });
  } catch (error) {
    console.log(error);
  }
});

app.get("/api/products/:pid", async (req, res) => {
  try {
    const product = await productManager.getProductById(Number(req.params.pid));

    res.send(product);
  } catch (error) {
    return res.send({ status: "error", error: error.message });
  }
});

app.post("/api/products", async (req, res) => {
  const product = req.body;

  try {
    const newProduct = await productManager.addProduct(
      product.title,
      product.description,
      product.price,
      product.thumbnail,
      product.code,
      product.status,
      product.category,
      product.stock
    );
    res.status(200).send(newProduct);
  } catch (error) {
    res.status(404).send({ error: error.message });
  }
});

app.put("/api/products/:pid", async (req, res) => {
  const { pid } = req.params;
  const product = req.body;

  try {
    const newProduct = await productManager.updateProduct(Number(pid), product);
    res.status(200).send(newProduct);
  } catch (error) {
    return res.status(400).send({
      error: error.message,
    });
  }
});

app.delete("/api/products/:pid", async (req, res) => {
  let { pid } = req.params;

  try {
    const products = await productManager.deleteProduct(Number(pid));
    res.status(200).send({ message: `Product ${pid} deleted` });
  } catch (error) {
    return res.status(400).send({
      error: error.message,
    });
  }
});

app.post("/api/carts", async (req, res) => {
  try {
    const cart = await cartManager.addCart();
    res.status(200).send(cart);
    return;
  } catch (error) {
    console.log(error);
  }
});

app.get("/api/carts/:cid", async (req, res) => {
  try {
    const cart = await cartManager.getCartById(Number(req.params.cid));
    res.send(cart);
  } catch (error) {
    return res.send({ status: "error", error: error.message });
  }
});

app.post("/api/carts/:cid/product/:pid", async (req, res) => {
  const { cid, pid } = req.params;

  try {
    const cart = await cartManager.updateProductCartById(
      Number(cid),
      Number(pid)
    );

    res.send(cart);
  } catch (error) {
    return res.send({ status: "error", error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Escuchando el puerto : ${PORT}`);
});
