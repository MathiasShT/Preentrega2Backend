import express from "express";
const router = express.Router();

import ProductManager from "../controllers/product-manager.js";
const productManager = new ProductManager("./src/models/products.json");
 
router.get("/", async (req, res) => {
    try {
        const productos = await productManager.getProducts();
         res.json(productos);
        }
    catch (error) {
        console.error("No se pudieron obtener los productos", error);
        res.status(500).json({
            error: "Error del servidor"
        });
    }
});

router.get("/:pid", async (req, res) => {
    const id = req.params.pid;
    try {
        const producto = await productManager.getProductById(parseInt(id));
        if (!producto) {
            return res.json({
                error: "Producto no encontrado"
            });
        }
        res.json(producto);
    } catch (error) {
        console.error("Error al obtener producto", error);
        res.status(500).json({
            error: "Error de servidor"
        });
    }
});

router.post("/", async (req, res) => {
    const nuevoProducto = req.body;
    try {
        await productManager.addProduct(nuevoProducto);
        res.status(201).json({
            message: "Producto agregado exitosamente"
        });
    } catch (error) {
        console.error("No se pudo agregar el producto", error);
        res.status(500).json({
            error: "Error de servidor"
        });
    }
});

router.put("/:pid", async (req, res) => {
    const id = req.params.pid;
    const productoActualizado = req.body;
    try {
        await productManager.updateProduct(parseInt(id), productoActualizado);
        res.json({
            message: "Producto actualizado exitosamente"
        });
    } catch (error) {
        console.error("No se pudo actualizar el producto", error);
        res.status(500).json({
            error: "Error de servidor"
        });
    }
});

router.delete("/:pid", async (req, res) => {
    const id = req.params.pid;
    try {
        await productManager.deleteProduct(parseInt(id));
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

export default router;