import mongoose from "mongoose";



mongoose.connect("mongodb+srv://mathiassht:PasosdelSurEste@cluster0.yzziets.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => console.log("Se conecto a la Base de Datos"))
    .catch((error) => console.log("Error al conecatrse", error));