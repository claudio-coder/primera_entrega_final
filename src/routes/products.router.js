import {Router} from "express";
import {ProductManager} from "../ProductManager.js";
import {socketServer} from "../app.js";

const productManager = new ProductManager("./src/products.json");

const router = Router();

router.get("/", async (req, res) => {
    try {
        const limit = req.query.limit;

        const products = await productManager.getProducts();

        if (limit !== undefined) {
            const productsLimits = products.slice(0, limit);
            res.send({status: "success", products: productsLimits});
            return;
        }
        return res.send({status: "success", products: products});
    } catch (error) {
        return res.send({status: "error", error: error.message});
    }
});

router.get("/:pid", async (req, res) => {
    try {
        const product = await productManager.getProductById(Number(req.params.pid));

        res.send(product);
    } catch (error) {
        return res.send({status: "error", error: error.message});
    }
});

router.post("/", async (req, res) => {
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


        const newProducts = await productManager.getProducts();
        socketServer.emit('products', newProducts);

        res.status(200).send(newProduct);
    } catch (error) {
        res.status(404).send({error: error.message});
    }
});

router.put("/:pid", async (req, res) => {
    const {pid} = req.params;
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

router.delete("/:pid", async (req, res) => {
    let {pid} = req.params;

    try {
        await productManager.deleteProduct(Number(pid));

        const newProducts = await productManager.getProducts();
        socketServer.emit('products', newProducts);

        res.status(200).send({message: `Product ${pid} deleted`});
    } catch (error) {
        return res.status(400).send({
            error: error.message,
        });
    }
});

export default router;
