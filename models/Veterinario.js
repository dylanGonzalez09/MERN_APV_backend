import mongoose from "mongoose";
import bcrypt from "bcrypt";
import generarId from "../helpers/generarId.js";

const veterinarioSchema = mongoose.Schema({
    //Estructura de los datos del modelo de veterinarios
    //ID se aasigna automaticamente
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    telefono: {
        type: String,
        default: null,
        trim: true
    },
    web: {
        type: String,
        default: null,
        trim: true
    },
    token: {
        type: String,
        default: generarId

    },
    confirmado: {
        type: Boolean,
        default: false
    }

});

//Hashear password en el modelo
//Dependencia necesaria --> bcrypt
veterinarioSchema.pre("save", async function(next){  //Antes de almacenar en la bdd

    //Evitar que un password hashado no se hashe de nuevo - originario de moongose
    if(!this.isModified("password")){
        next(); // Salta la siguiente linea del middelware en index.js
    }

    const salt = await bcrypt.genSalt(10); //genera las rondas de hasheo (10) es default
    this.password = await bcrypt.hash(this.password, salt);
});

//Registrar funciones que se ejecuten unicamente en el modelo
veterinarioSchema.methods.comprobarPassword = async function(passwordFormulario){
    return await bcrypt.compare(passwordFormulario, this.password); //Permite comparar password hashados con el sin hash
}


const Veterinario = mongoose.model("Veterinario", veterinarioSchema);
export default Veterinario;