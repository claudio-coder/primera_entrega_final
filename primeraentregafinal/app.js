import express from "express";
import fs from "fs";
import { Server } from "socket.io";
import { CartManager } from "../src/CartManager.js";
import { ProductManager } from "./ProductManager.js";
import { CARTS_URL, CART_BY_ID_URL, UPDATE_CART_URL } from "./routes/carts.js";
import { PRODUCTS_URL, PRODUCT_BY_ID_URL } from "./routes/products.js";
import handlebars from "express-handlebars";
import viewsRouter from "./routes/views.router.js";

const PORT = 8080;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const httpServer = app.listen(PORT, () => {
  console.log(`Escuchando el puerto : ${PORT}`);
});
const socketServer = new Server(httpServer);

app.engine("handlebars", handlebars);
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
app.use(express.static(__dirname + "/public"));
app.use("/", viewsRouter);

socketServer.on("connection", (socket) => {
  console.log("nuevo cliente conectado");
});

const productManager = new ProductManager("./products.json");
const cartManager = new CartManager("./carts.json", productManager);

app.get(PRODUCTS_URL, async (req, res) => {
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

app.get(PRODUCT_BY_ID_URL, async (req, res) => {
  try {
    const product = await productManager.getProductById(Number(req.params.pid));

    res.send(product);
  } catch (error) {
    return res.send({ status: "error", error: error.message });
  }
});

app.post(PRODUCTS_URL, async (req, res) => {
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

app.put(PRODUCT_BY_ID_URL, async (req, res) => {
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

app.delete(PRODUCT_BY_ID_URL, async (req, res) => {
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

app.post(CARTS_URL, async (req, res) => {
  try {
    const cart = await cartManager.addCart();
    res.status(200).send(cart);
    return;
  } catch (error) {
    console.log(error);
  }
});

app.get(CART_BY_ID_URL, async (req, res) => {
  try {
    const cart = await cartManager.getCartById(Number(req.params.cid));
    res.send(cart);
  } catch (error) {
    return res.send({ status: "error", error: error.message });
  }
});

app.post(UPDATE_CART_URL, async (req, res) => {
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
