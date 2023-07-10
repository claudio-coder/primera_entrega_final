import { Router } from "express";
import { petModel } from "../models/pet.model.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const pet = req.body;

    const newPet = {
      name: pet.name,
      specie: pet.specie,
    };

    let result = await petModel.create(newPet);

    res.status(200).send({ result });
  } catch (error) {
    console.log(error);
  }
});

const nombres = ["narita", "gos"];

router.param("nombre", async (req, res, next, nombre) => {
  let petname = await petModel.findOne({ name: "nombre" });
  console.log(petname);
  if (petname) {
    req.name = null;
  } else {
    req.name = nombre;
  }
  next();
});

//   if (!nombres.includes(nombre)) {
//     req.nombre = null;
//   } else {
//     req.nombre = nombre;
//   }
//   next();
// });

router.get("/params/:nombre([a-zA-Z]+)", async (req, res) => {
  res.send({
    message: req.name,
  });
  //   try {
  //     const caca = req.params.nombre;
  //     console.log(caca);
  //     let petname = await petModel.findOne({ name: caca });
  //     res.send(petname);
  //   } catch (error) {
  //     return res.send({ status: "error", error: error.message });
  //   }
});

export default router;
