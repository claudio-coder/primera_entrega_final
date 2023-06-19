import bcrypt from "bcrypt";

// crear el hash
export const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

// generar la funcón para compara

export const isValidPassword = (password, user) =>
  bcrypt.compareSync(password, user.password);
