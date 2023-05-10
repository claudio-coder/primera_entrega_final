const { Router } = require("express");
const { userModel } = require("../models/user.model");

// obj
const router = Router();

router.get("/", async (req, res) => {
  try {
    let users = await userModel.find();
    console.log(users);
    res.send("Hola mundo");
  } catch (error) {
    console.log(error);
  }
});

// POST http://localhost:8080 /usuarios
router.post("/", (req, res) => {
  let user = req.body;

  if (!user.nombre || !user.apellido) {
    return res
      .status(400)
      .send({ status: "error", mensaje: "todos los campos son necesarios" });
  }
  usuarios.push(user);
  res.status(200).send({ usuarios });
});

// PUT http://localhost:8080 /usuarios
router.put("/:pid", (req, res) => {
  const { pid } = req.params;
  const user = req.body;

  // validar pid
  // if(!id)
  // validar campos
  if (!user.nombre || !user.apellido) {
    return res
      .status(400)
      .send({ status: "error", mensaje: "todos los campos son necesarios" });
  }
  // buscar por pid user
  const index = usuarios.findIndex((usuario) => usuario.id === pid);
  //validar que exista
  if (index === -1)
    res.send({ status: "error", message: "No existe el usuario" });

  usuarios[index] = { id: pid, ...user };

  res.send({ usuarios });
});

router.delete("/:uid", (req, res) => {
  let { uid } = req.params;
  // buscar por pid user
  const index = usuarios.findIndex((usuario) => usuario.id === uid);
  //validar que exista
  if (index === -1)
    res.send({ status: "error", message: "No existe el usuario" });

  usuarios = usuarios.filter((user) => user.id !== uid);

  res.send({ status: "success", payload: usuarios });
});

module.exports = router;
