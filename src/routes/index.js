const { Router } = require("express");

const { uploader } = require("../utils/multer");
const userRouter = require("./users.router");
const productRouter = require("./products.router");
const viewsRouter = require("./views.router");
const cartsRouter = require("./carts.router");
const pruebasRouter = require("./pruebas.router");
const sessionRouter = require("./session.router");

const router = Router();

router.use("/views", viewsRouter);
router.use("/api/session", sessionRouter);

// http://localhost:8080 /api/usuarios
router.use("/api/usuarios", userRouter);

router.use("/api/products", productRouter);
router.use("/api/carritos", cartsRouter);

router.use("/pruebas", pruebasRouter);

router.post("/single", uploader.single("myfile"), (req, res) => {
  res.status(200).send({
    status: "success",
    message: "se subió correctamente",
  });
});

module.exports = router;
