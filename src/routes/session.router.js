import { Router } from "express";
import passport from "passport";
import { auth } from "../middlewares/autenticacion.middlewar.js";
import { userModel } from "../models/user.model.js";
import { isValidPassword, createHash } from "../utils/bcryptHash.js";
import { generateToken } from "../utils/jwt.js";

const router = Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.send({
      status: "error",
      message: "Deben completarse los campos de email y password",
    });
  }
  const userDB = await userModel.findOne({ email });
  console.log(userDB);
  console.log(email);

  if (!userDB) {
    return res.send({
      status: "error",
      message: "No existe ese usuario",
    });
  }

  if (!isValidPassword(password, userDB))
    return res.status(401).send({
      status: "error",
      message: "El usuario o la contraseña no es la correcta",
    });

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

  const hashedPassword = createHash(password);

  const newUser = {
    username,
    first_name,
    last_name,
    email,
    password: hashedPassword,
    role,
  };

  let resultUser = await userModel.create(newUser);

  console.log(hashedPassword);

  res
    .status(200)
    .send({ status: "success", message: "Usuario creado correctamente" });
});

// LOGIN;
router.post(
  "/login",
  passport.authenticate("login", {
    failureRedirect: "/faillogin",
  }),
  async (req, res) => {
    if (!req.user)
      return res
        .status(401)
        .send({ status: "error", message: "invalid credencial" });
    req.session.user = {
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      email: req.user.email,
    };
    res.send({ status: "success", message: "User registered" });
  }
);

router.get("/faillogin", async (req, res) => {
  console.log("Fallo la estrategia");
  res.send({ status: "error", error: "fallo autenticación" });
});

router.post(
  "/register",
  passport.authenticate("register", {
    failureRedirect: "/failregister",
  }),
  async (req, res) => {
    res.send({ status: "success", message: "User registered" });
  }
);

router.get("/faillogin", async (req, res) => {
  console.log("Fallo la estrategia");
  res.send({ status: "error", error: "fallo autenticación" });
});

router.get("/failregister", async (req, res) => {
  console.log("Fallo la estrategia");
  res.send({ status: "error", error: "fallo autenticación" });
});

///GITHUB

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  async (req, res) => {}
);

router.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  async (req, res) => {
    req.session.user = req.user;
    res.redirect("/api/products");
  }
);

//////////////////////////////////////////////////
//TOKEN

// router.post("/login", async (req, res) => {
//   const { email, password } = req.body;

//   const access_token = generateToken({
//     first_name: "Claudio",
//     last_name: "Cabanas",
//     email: "claudiocabanas@gmail.com",
//   });

//   res.send({
//     status: "success",
//     message: "login success",
//     access_token,
//   });

// });

// router.post("/register", async (req, res) => {
//   try {
//     const { username, first_name, last_name, email, password } = req.body;

//     let token = generateToken({
//       first_name: "Claudio",
//       last_name: "Cabanas",
//       email: "claudiocabanas@gmail.com",
//     });

//     res.status(200).send({
//       status: "success",
//       message: "Usuario creado correctamente",
//       token,
//     });
//   } catch (error) {
//     console.log(error);
//   }
// });

////////////////////////////////////////////////////////////////

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
