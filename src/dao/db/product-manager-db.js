import ProductModel from "../models/product.model.js";

class ProductManager {
    async addProduct({ title, description, price, img, code, stock, category, thumbnails }) {
        try {
            if (!title || !description || !price || !code || !stock || !category) {
                console.log("Hay que completar todos los campos");
                return;
            }
            const ProductExiste = await ProductModel.findOne({ code: code });
            if (ProductExiste) {
                console.log("Ese lote ya existe");
                return;
            }

            const newProduct = new ProductModel({
                title,
                description,
                price,
                code,
                stock,
                category,
                status: true,
                thumbnails: thumbnails || []
            });

            await newProduct.save();

        } catch (error) {
            console.log("No se pudo agregar el producto nuevo", error);
            throw error;
        }
    }
    async getProducts({ limit = 10, page = 1, sort, query } = {}) {
        try {
            const skip = (page - 1) * limit;

            let queryOptions = {};

            if (query) {
                queryOptions = { category: query };
            }

            const sortOptions = {};
            if (sort) {
                if (sort === 'asc' || sort === 'desc') {
                    sortOptions.price = sort === 'asc' ? 1 : -1;
                }
            }

            const lotes = await ProductModel
                .find(queryOptions)
                .sort(sortOptions)
                .skip(skip)
                .limit(limit);

            const totalProducts = await ProductModel.countDocuments(queryOptions);

            const totalPages = Math.ceil(totalProducts / limit);
            const hasPrevPage = page > 1;
            const hasNextPage = page < totalPages;

            return {
                docs: lotes,
                totalPages,
                prevPage: hasPrevPage ? page - 1 : null,
                nextPage: hasNextPage ? page + 1 : null,
                page,
                hasPrevPage,
                hasNextPage,
                prevLink: hasPrevPage ? `/api/products?limit=${limit}&page=${page - 1}&sort=${sort}&query=${query}` : null,
                nextLink: hasNextPage ? `/api/products?limit=${limit}&page=${page + 1}&sort=${sort}&query=${query}` : null,
            };

        } 
        catch (error) {
            console.log("No se pudo leer el archivo", error);
            throw error;
        }
    }
    async getProductById(_id) {
        try {
            const buscado = await ProductModel.findById(_id);
            if (!buscado) {
                console.log("Producto no encontrado");
                return null;
            } else {
                console.log("Producto encontrado");
                return buscado;
            }
        } catch (error) {
            console.log("No se pudo leer el archivo", error);
            throw error;
        }
    }
    async updateProduct(_id, productoActualizado) {
        try {
            const productupdate = await ProductModel.findByIdAndUpdate(_id, productoActualizado);
            if (!productupdate) {
                console.log("No se encontró el producto");
            }
            else {
                console.log("Producto actualizado correctamente");
                return productupdate;
            }
        }
        catch (error) {
            console.log("No se pudo actualizar el producto", error);
            throw error;
        }
    }
    async deleteProduct(_id) {
        try {
            const eliminado = ProductModel.findByIdAndDelete(_id);
            if (!eliminado) {
                console.log("No se encontró el producto");
            }
            else {
                console.log("Producto eliminado con exito");
                return eliminado;
            }
        } catch (error) {
            console.log("Error al eliminar el producto", error);
            throw error;
        }
    }
}

export default ProductManager;