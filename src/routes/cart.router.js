import express from "express";
import CartManager from "../dao/db/cart-manager-db.js";
import CartModel from "../dao/models/cart.model.js";
import mongoose from "mongoose";

const router = express.Router();
const cartManager = new CartManager();

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
    const cartId = req.params.cid;

    try {
        const carrito = await cartManager.getCarritoById(cartId);
        res.json(carrito.productos);
    } catch (error) {
        console.error("No se pudo obtener el carrito", error);
        res.status(500).json({ error: "Error" });
    }
});

router.post("/:cid/product/:pid", async (req, res) => {
    const cartId = req.params.cid;
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
router.delete("/:cid", async (req, res) => {
    const cartId = req.params.cid;
    try {
        const carrito = await CartModel.findByIdAndDelete(cartId)
        res.json({
            message: "Carrito vaciado exitosamente"
        });
    } catch (error) {
        console.error("No se pudo eliminar el carrito", error);
        res.status(500).json({
            error: "Error de servidor"
        });
    }
});
router.delete("/:cid/product/:pid", async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    try {
        const carrito = await CartModel.findByIdAndDelete(cartId, productId)
        res.json({
            message: "Producto eliminado exitosamente"
        });
    } catch (error) {
        console.error("No se pudo eliminar producto", error);
        res.status(500).json({
            error: "Error de servidor"
        });
    }
});

router.put("/:cid", async (req, res) => {
    try {
        const carrito = await CartModel.findByIdAndUpdate(cartId);
        if (!carrito) {
            return res.status(404).send("No se pudo modificar el carrito")
        } else {
            res.status(200).send("Carrito modificado con exito")
        }
    } catch (error) {
        res.status(500).send("Error del servidor")
    }

});

router.put("/:cid/product/:pid", async (req, res) => {
    const quantityId = req.params.quantity
    try {
        const carrito = await CartModel.findByIdAndUpdate(quantityId);
        if (!carrito) {
            return res.status(404).send("Solo se puede modificar la cantidad")
        } else {
            res.status(200).send("Cantidad modificada correctamente")
        }
    } catch (error) {
        res.status(500).send("Error del servidor")
    }

});

export default router;