import mongoose from "mongoose";
import { paginate } from "mongoose-paginate-v2";

const cartSchema = new mongoose.Schema ({
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }
    ]    
});

cartSchema.pre("findOne", function(next){
    this.populate("Product");
    next();
})

const CartModel = mongoose.model("carts", cartSchema);

export default CartModel;