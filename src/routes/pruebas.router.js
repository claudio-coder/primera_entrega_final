import { Router } from "express";
import { auth } from "../middlewares/autenticacion.middlewar.js";

const router = Router();

router.get("/", (req, res) => {
  res.render("login", {});
});
router.post("getcookieuser", (req, res) => {
  const { username, email } = req.body;

  res
    .cookie(username, email, { maxAge: 1000000, signed: true })
    .send({ mensaje: "seteado" });
});

router.get("/setCookie", (req, res) => {
  res
    .cookie("CoderCookie", "ESta es nuna cookie muy poderosa", {
      maxAge: 1000000000,
    })
    .send("cockie seteada");
});
router.get("/setSignedCookie", (req, res) => {
  res
    .cookie("SignedCookie", "ESta es nuna cookie muy poderosa", {
      maxAge: 1000000000,
      signed: true,
    })
    .send("cockie seteada");
});
router.get("/getCookie", (req, res) => {
  res.send(req.cookies);
});

router.get("/getSignedCookie", (req, res) => {
  res.send(req.signedCookies);
});

router.get("/deleteCookie", (req, res) => {
  res.clearCookie("CoderCookie").send("cookie removed");
});

export default router;
