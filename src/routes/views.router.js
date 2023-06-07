import { Router } from "express";
import { productModel } from "../models/product.model.js";

const router = Router();

router.get("/", (req, res) => {
  res.redirect("/login");
});

router.get("/login", (req, res) => {
  res.render("login", {
    style: "index.css",
  });
});

router.get("/register", (req, res) => {
  res.render("registerForm", {
    style: "index.css",
  });
});

router.get("chat", (req, res) => {
  res.render("chat", {});
});

router.get("/products", async (req, res) => {
  const products = await productModel.find({}).lean();
  res.render("index", { products, user: req.session.user });
});

router.get("/realtimeproducts", async (req, res) => {
  res.render("realTimeProducts");
});

export default router;
