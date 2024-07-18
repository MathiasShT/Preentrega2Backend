import express from "express";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
const app = express();
import cartRouter from "./routes/cart.router.js";
import productsRouter from "./routes/products.router.js";
import viewsRouter from "./routes/views.router.js";
import "./database.js";

const PUERTO = 8080;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static("./src/public"));

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

app.use("/api/products", productsRouter);
app.use("/api/cart", cartRouter);
app.use("/", viewsRouter);


const httpServer = app.listen(PUERTO, () => {
    console.log(`Escuchando en el http://localhost:${PUERTO}`)
});

import ProductManager from "./dao/fs/product-manager.js";
const productManager = new ProductManager("./src/models/products.json");

const io = new Server(httpServer);

io.on("connection", async(socket) => {
    console.log("Conexion iniciada");
    socket.emit("productos", await productManager.getProducts());
    socket.on("eliminarProducto", async(id) => {
        await productManager.deleteProduct(id);
        io.sockets.emit("productos", await productManager.getProducts())
    })
});


