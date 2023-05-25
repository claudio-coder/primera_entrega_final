import { CartManager } from "../managerDaos/CartManager.js";
import { ProductManager } from "../managerDaos/ProductManager.js";
import { Router } from "express";
import { cartModel } from "../models/cart.model.js";

// const productManager = new ProductManager("./src/managerDaos/products.json");
// const cartManager = new CartManager("./src/carts.json", productManager);

const router = Router();

// router.post("/", async (req, res) => {
//   try {
//     const cart = await cartManager.addCart();
//     res.status(200).send(cart);
//     return;
//   } catch (error) {
//     console.log(error);
//   }
// });
////////////////////////
router.get(
  "/:cid",
  async (req, res) => {
    const cid = req.params;
    try {
      let { cid } = req.params;

      let result = await cartModel.findOne({ _id: cid });
      res.send({ status: "success", payload: result });
    } catch (error) {
      console.log(error);
    }

    // let carts = await cartModel.find().explain("executionStatus");
    // console.log("ESTA CART", carts);
  }

  // try {
  //   const cart = await cartManager.getCartById(Number(req.params.cid));
  //   res.send(cart);
  // } catch (error) {
  //   return res.send({ status: "error", error: error.message });
  // }
);
////////////////////////////////
router.post("/:cid", async (req, res) => {
  try {
    // const { cid, pid } = req.params;
    const newCart = req.params;

    let result = await cartModel.create(req.body);

    res.status(200).send({ result });
  } catch (error) {
    console.log(error);
  }

  // try {
  //   const cart = await cartManager.updateProductCartById(
  //     Number(cid),
  //     Number(pid)
  //   );

  //   res.send(cart);
  // } catch (error) {
  //   return res.send({ status: "error", error: error.message });
  // }
});

//////////////////////////

router.delete("/:cid", async (req, res) => {
  try {
    let { cid } = req.params;

    let result = await cartModel.deleteOne({ _id: cid });
    res.send({ status: "success", payload: result });
  } catch (error) {
    console.log(error);
  }
});

router.delete("/:cid/product/:pid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;

    let result = await cartModel.deleteOne({ _id: cid, idp: pid });
    res.send({ status: "success", payload: result });
  } catch (error) {
    console.log(error);
  }
});

export default router;
