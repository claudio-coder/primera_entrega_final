import { CartManager } from "../CartManager.js";
import { ProductManager } from "../ProductManager.js";
import express from "express";

const productManager = new ProductManager("./products.json");
const cartManager = new CartManager("./carts.json", productManager);

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const cart = await cartManager.addCart();
    res.status(200).send(cart);
    return;
  } catch (error) {
    console.log(error);
  }
});

router.get("/:cid", async (req, res) => {
  try {
    const cart = await cartManager.getCartById(Number(req.params.cid));
    res.send(cart);
  } catch (error) {
    return res.send({ status: "error", error: error.message });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
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

export default router;
