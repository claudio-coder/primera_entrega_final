import express from "express";
import productsRoutes from "./routes/products.js";
import { Server } from "socket.io";
import cartsRoutes from "../src/routes/carts.js";
import handlebars from "express-handlebars";
import viewsRouter from "./routes/views.router.js";

const PORT = 8080;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const httpServer = app.listen(PORT, () => {
  console.log(`Escuchando el puerto : ${PORT}`);
});
const socketServer = new Server(httpServer);

app.engine("handlebars", handlebars);
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
app.use(express.static(__dirname + "/public"));
app.use("/", viewsRouter);

socketServer.on("connection", (socket) => {
  console.log("nuevo cliente conectado");
});

app.use("/api/products", productsRoutes);
app.use("/api/carts", cartsRoutes);
