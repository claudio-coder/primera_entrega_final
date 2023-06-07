import { Router } from "express";
import { auth } from "../middlewares/autenticacion.middlewar.js";
import { userModel } from "../models/user.model.js";

const router = Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.send({
      status: "error",
      message: "Deben completarse los campos de email y password",
    });
  }

  const userDB = await userModel.findOne({ email, password });

  if (!userDB) {
    return res.send({
      status: "error",
      message: "No existe ese usuario",
    });
  }

  res.session = {};
  req.session.user = {
    first_name: userDB.first_name,
    last_name: userDB.last_name,
    email: userDB.email,
    role: userDB.role,
  };

  res.redirect("/products");
});

router.post("/register", async (req, res) => {
  const { username, first_name, last_name, email, password } = req.body;

  const existUser = await userModel.findOne({ email });

  if (existUser) {
    return res.send({
      status: "error",
      message: "el email ya esta registrado",
    });
  }

  const role =
    email === "adminCoder@coder.com" && password === "adminCod3r123"
      ? "admin"
      : "usuario";

  const newUser = {
    username,
    first_name,
    last_name,
    email,
    password,
    role,
  };

  let resultUser = await userModel.create(newUser);

  res
    .status(200)
    .send({ status: "success", message: "Usuario creado correctamente" });
});

router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.send({ status: "error", error: err });
    }
    res.redirect("/login");

    // res.send("logout ok");
  });
});

router.get("/counter", (req, res) => {
  if (req.session.counter) {
    req.session.counter++;
    res.send(`se ha visitado el sitio ${req.session.counter} veces`);
  } else {
    req.session.counter = 1;
    res.send("Bienvenido");
  }
});

router.get("/privada", auth, (req, res) => {
  res.send("Todo lo que esta acá solo lo puede ver un admin logueado");
});

export default router;
