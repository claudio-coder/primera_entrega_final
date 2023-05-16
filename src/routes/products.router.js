import { Router } from "express";
// import { ProductManager } from "../managerDaos/ProductManager.js";
// import { io } from "../app.js";
import { productModel } from "../models/product.model.js";

// const productManager = new ProductManager("./src/managerDaos/products.json");

const router = Router();

const SORT = { asc: 1, desc: -1 };

router.get("/", async (req, res) => {
  try {
    // let users = await userModel.find().explain("executionStatus");
    // let users = await userModel.find({ first_name: "Celia" });
    // console.log(users[0].id.toString());
    // let users = await userModel.find({});
    // const { page = 1 } = req.query;
    // const page = req.query.page;

    const limit = req.query.limit;

    const page = req.query.page;

    const sortParam = req.query.sort;

    let products = await productModel.paginate(
      {},
      {
        limit: !!limit ? limit : 10,
        page: !!page ? page : 1,
        lean: true,
        sort: !!SORT[sortParam] ? { price: SORT[sortParam] } : undefined,
      }
    );
    const {
      docs,
      totalPages,
      hasPrevPage,
      hasNextPage,
      prevPage,
      nextPage,
      prevLink,
      nextLink,
    } = products;
    // res.render("product", {
    res.send({
      status: "success",
      products: docs,
      totalPages,
      prevPage,
      nextPage,
      hasPrevPage,
      hasNextPage,
      prevLink,
      nextLink,
    });
  } catch (error) {
    console.log(error);
  }
});
// try {
//   let products = await productModel.find().explain("executionStatus");
//   console.log(products);
//   res.send({
//     status: "success",
//     payload: products,
//   });
// } catch (error) {
//   console.log(error);
// }
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
// });

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
      price: product.price,
      code: product.code,
      category: product.category,
      stock: product.stock,
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
// PUT http://localhost:8080 /products
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
