import CartModel from "../models/cart.model.js";

class CartManager {
    async crearCarrito() {
        try {
            const newCart = new CartModel({products:[]});
            await newCart.save();
            return newCart;
        } catch (error) {
            console.error("No se pudieron cargar los carritos", error);
            throw error;
        }
    }
    
    async getCarritoById(cartId) {
        try {
            const carrito = await CartModel.findById(cartId);
            if (!carrito) {
                throw new Error(`No tenemos el carrito ${cartId}`);
            }
            return carrito;
        } catch (error) {
            console.error("Error al obtener el carrito por ID", error);
            throw error;
        }
    }

    async agregarProductoAlCarrito(cartId, productId, quantity = 1) {
   try {
        const carrito = await this.getCarritoById(cartId);
        const productexist = carrito.products.find(item => item.product.toString() === productId);
        if (productexist) {
            productexist.quantity += quantity
        } else {
            carrito.products.push({product: productId, quantity})
        }
        carrito.markModified("products");
        await carrito.save();
        return carrito;
   } catch (error) {
    console.error("Error al agregar el lote al carrito", error);
    throw error;
   }
}};

export default CartManager;