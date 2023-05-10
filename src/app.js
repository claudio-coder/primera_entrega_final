import express from "express";
import cookieParser from "cookie-parser";
import productsRouter from "./routes/products.router.js";
// import usersRouter from "./routes/users.router.js";
import { Server } from "socket.io";
import cartsRouter from "./routes/carts.router.js";
import handlebars from "express-handlebars";
import viewsRouter from "./routes/views.router.js";
import __dirname from "./utils.js";
import { ProductManager } from "./ProductManager.js";
import { connectDB } from "./config/objectConfig.js";

const PORT = 8080;
const app = express();

const productManager = new ProductManager("./src/products.json");

const httpServer = app.listen(PORT, () => {
  console.log(`Escuchando el puerto : ${PORT}`);
});
export const io = new Server(httpServer);

connectDB();
//hbs
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
// hbs

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/static", express.static(__dirname + "/public"));

app.use("/api/products", productsRouter);
// app.use("/api/usuarios", usersRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

io.on("connection", async (socket) => {
  console.log("Nuevo cliente conectado");
  const products = await productManager.getProducts();
  socket.emit("products", products);
});