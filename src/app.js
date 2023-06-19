import express from "express";
import session from "express-session";
import cookieParser from "cookie-parser";
import productsRouter from "./routes/products.router.js";
import usersRouter from "./routes/users.router.js";
import { Server } from "socket.io";
import cartsRouter from "./routes/carts.router.js";
import handlebars from "express-handlebars";
import viewsRouter from "./routes/views.router.js";
import pruebasRouter from "./routes/pruebas.router.js";
import { ProductManager } from "./managerDaos/ProductManager.js";
import { connectDB } from "./config/objectConfig.js";
import __dirname from "./dirname.js";
import FileStore from "session-file-store";
import MongoStore from "connect-mongo";
import sessionRouter from "./routes/session.router.js";
import { initPassport } from "./config/passport.config.js";
import passport from "passport";

const PORT = 8080;
const app = express();

const productManager = new ProductManager("./src/managerDaos/products.json");

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

app.use(cookieParser("P@l@br@S3cr3t0"));

// const fileStore = FileStore(session);

// app.use(
//   session({
//     store: new fileStore({
//       ttl: 100000 * 60,
//       path: "./session",
//       retries: 0,
//     }),

//     secret: "secretCoder",
//     resave: true,
//     saveUninitialized: true,
//   })
// );

app.use(
  session({
    store: MongoStore.create({
      mongoUrl:
        "mongodb+srv://ccabanas:0801MJmv@cluster0.1e2x8x2.mongodb.net/CentroMedicoVeterinario?retryWrites=true&w=majority",
      mongoOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      ttl: 100000 * 60,
    }),

    secret: "secretCoder",
    resave: false,
    saveUninitialized: false,
  })
);

initPassport();
passport.use(passport.initialize());
passport.use(passport.session());

// app.use(
//   session({
//     secret: "secretCoder",
//     resave: true,
//     saveUninitialized: true,
//   })
// );

app.use("/static", express.static(__dirname + "/public"));

app.use("/api/products", productsRouter);
app.use("/api/usuarios", usersRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);
app.use("/api/session", sessionRouter);

app.use("/pruebas", pruebasRouter);

io.on("connection", async (socket) => {
  console.log("Nuevo cliente conectado");
  const products = await productManager.getProducts();
  socket.emit("products", products);
});
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send("Todo mal");
});
