export const auth = (req, res, next) => {
  if (req.session?.user !== "claudio" || !req.session?.admin) {
    return res.status(401).send("Error de autenticación");
  }
  next();
};
