import express from "express";
import CartManager from "../controllers/cart-manager.js";

const router = express.Router();
const cartManager = new CartManager("./src/models/carts.json");

router.post("/", async (req, res) => {
    try {
        const newCart = await cartManager.crearCarrito();
        res.json(newCart);
    } catch (error) {
        console.error("No se pudo crear el carrito", error);
        res.status(500).json({ error: "Error" });
    }
});

router.get("/:cid", async (req, res) => {
    const cartId = parseInt(req.params.cid);

    try {
        const carrito = await cartManager.getCarritoById(cartId);
        res.json(carrito.productos);
    } catch (error) {
        console.error("No se pudo obtener el carrito", error);
        res.status(500).json({ error: "Error" });
    }
});

router.post("/:cid/product/:pid", async (req, res) => {
    const cartId = parseInt(req.params.cid);
    const productId = req.params.pid;
    const quantity = req.body.quantity || 1;

    try {
        const actualizarCarrito = await cartManager.agregarProductoAlCarrito(cartId, productId, quantity);
        res.json(actualizarCarrito.products);
    } catch (error) {
        console.error("Error al agregar producto al carrito", error);
        res.status(500).json({ error: "Error" });
    }
});

export default router;