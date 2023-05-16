import { Router } from "express";
import { userModel } from "../models/user.model.js";

// obj
const router = Router();

router.get("/", async (req, res) => {
  try {
    // let users = await userModel.find().explain("executionStatus");
    // let users = await userModel.find({ first_name: "Celia" });
    // console.log(users[0].id.toString());
    // let users = await userModel.find({});
    const { page = 1 } = req.query;

    let users = await userModel.paginate(
      {},
      { limit: 10, page: page, lean: true }
    );
    const { docs, hasPrevPage, hasNextPage, prevPage, nextPage } = users;
    // res.render("user", {
    res.send({
      status: "success",
      users: docs,
      hasPrevPage,
      hasNextPage,
      prevPage,
      nextPage,
    });
  } catch (error) {
    console.log(error);
  }
});

// POST http://localhost:8080 /usuarios
router.post("/", async (req, res) => {
  try {
    const user = req.body;

    const newUser = {
      first_name: user.name,
      last_name: user.last_name,
      email: user.email,
    };
    let result = await userModel.create(newUser);
    res.status(200).send({ result });
  } catch (error) {
    console.log(error);
  }

  // let user = req.body;

  // if (!user.nombre || !user.apellido) {
  //   return res
  //     .status(400)
  //     .send({ status: "error", mensaje: "todos los campos son necesarios" });
  // }
  // usuarios.push(user);
  // res.status(200).send({ usuarios });
});

// PUT http://localhost:8080 /usuarios
router.put("/:uid", async (req, res) => {
  const { uid } = req.params;
  const user = req.body;

  try {
    let userToReplace = {
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
    };

    let result = await userModel.updateOne({ _id: uid }, userToReplace);

    res.send({
      status: "success",
      payload: result,
    });
  } catch (error) {
    return res.status(400).send({
      error: error.message,
    });
  }

  // validar pid
  // if(!id)
  // validar campos
  // if (!user.nombre || !user.apellido) {
  //   return res
  //     .status(400)
  //     .send({ status: "error", mensaje: "todos los campos son necesarios" });
  // }
  // buscar por pid user
  // const index = usuarios.findIndex((usuario) => usuario.id === pid);
  //validar que exista
  // if (index === -1)
  //   res.send({ status: "error", message: "No existe el usuario" });

  // usuarios[index] = { id: pid, ...user };

  // res.send({ usuarios });
});

router.delete("/:uid", async (req, res) => {
  try {
    let { uid } = req.params;

    let result = await userModel.deleteOne({ _id: uid });
    res.send({ status: "success", payload: result });
  } catch (error) {
    console.log(error);
  }

  // buscar por pid user
  // const index = usuarios.findIndex((usuario) => usuario.id === uid);
  //validar que exista
  // if (index === -1)
  //   res.send({ status: "error", message: "No existe el usuario" });

  // usuarios = usuarios.filter((user) => user.id !== uid);

  // res.send({ status: "success", payload: usuarios });
});

export default router;
