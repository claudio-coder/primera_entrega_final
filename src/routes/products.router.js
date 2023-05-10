import { Router } from "express";
import { ProductManager } from "../ProductManager.js";
import { io } from "../app.js";
import { productModel } from "../models/product.model.js";

const productManager = new ProductManager("./src/products.json");

const router = Router();

router.get("/", async (req, res) => {
  try {
    let products = await productModel.find();
    console.log(products);
    res.send({
      status: "success",
      payload: products,
    });
  } catch (error) {
    console.log(error);
  }

  // try {
  //   const limit = req.query.limit;
  //   const products = await productManager.getProducts();
  //   if (limit !== undefined) {
  //     const productsLimits = products.slice(0, limit);
  //     res.send({ status: "success", products: productsLimits });
  //     return;
  //   }
  //   return res.send({ status: "success", products: products });
  // } catch (error) {
  //   return res.send({ status: "error", error: error.message });
  // }
});

router.get("/:pid", async (req, res) => {
  try {
    const product = await productManager.getProductById(Number(req.params.pid));

    res.send(product);
  } catch (error) {
    return res.send({ status: "error", error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const product = req.body;

    const newProduct = {
      title: product.title,
      description: product.description,
      category: product.category,
    };

    let result = await productModel.create(newProduct);

    res.status(200).send({ result });
  } catch (error) {
    console.log(error);
  }

  // try {
  //   const newProduct = await productManager.addProduct(
  //     product.title,
  //     product.description,
  //     product.price,
  //     product.thumbnail,
  //     product.code,
  //     product.status,
  //     product.category,
  //     product.stock
  //   );

  //   const newProducts = await productManager.getProducts();
  //   socketServer.emit("products", newProducts);
  //   res.status(200).send(newProduct);
  // } catch (error) {
  //   res.status(404).send({ error: error.message });
  // }
});

router.put("/:pid", async (req, res) => {
  const { pid } = req.params;
  const product = req.body;

  try {
    let productToReplace = {
      title: product.title,
      description: product.description,
      category: product.category,
    };

    let result = await productModel.updateOne({ _id: pid }, productToReplace);

    res.send({
      status: "success",
      payload: result,
    });
  } catch (error) {
    return res.status(400).send({
      error: error.message,
    });
  }
});
// try {
//   const newProduct = await productManager.updateProduct(Number(pid), product);
//   res.status(200).send(newProduct);
// } catch (error) {
//   return res.status(400).send({
//     error: error.message,
//   });
// }

router.delete("/:pid", async (req, res) => {
  try {
    let { pid } = req.params;

    let result = await productModel.deleteOne({ _id: pid });
    res.send({ status: "success", payload: result });
  } catch (error) {
    console.log(error);
  }

  // try {
  //   await productManager.deleteProduct(Number(pid));

  //   const newProducts = await productManager.getProducts();
  //   io.emit("products", newProducts);

  //   res.status(200).send({ message: `Product ${pid} deleted` });
  // } catch (error) {
  //   return res.status(400).send({
  //     error: error.message,
  //   });
  // }
});

export default router;
