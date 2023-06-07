export const auth = (req, res, next) => {
  console.log("auth", req.session);
  if (
    req.session?.user?.email !== "adminCoder@coder.com" ||
    !req.session?.user?.admin === "admin"
  ) {
    return res.status(401).send("Error de autenticación");
  }
  next();
};
