import { Router } from "express";
import { ProductManager } from "../ProductManager.js";

const router = Router();

const productManager = new ProductManager("./src/products.json");

router.get("chat", (req, res) => {
  res.render("chat", {});
});

router.get("/", async (req, res) => {
  const products = await productManager.getProducts();
  res.render("index", { products });
});

router.get("/realtimeproducts", async (req, res) => {
  res.render("realTimeProducts");
});

export default router;
