import jwt from "jsonwebtoken";
import Veterinario from "../models/Veterinario.js";

const checkAuth = async (req, res, next) => {

    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){ //Comprobar que el usuario envie el token por las cabeceras

        //Comprobar el token
        try {
            token = req.headers.authorization.split(" ")[1]; // split() Separa cuando hay un espacio y retorna un arreglo

            //decoded para tener acceso a los datos en forma de objeto
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            //Buscar el veterinario por su id y crear una sesion con express
            req.veterinario = await Veterinario.findById(decoded.id).select("-password -token -confirmado"); //trae todos los datos del usuario menos lo que se pase

            return next();

        } catch (error) {
            const e = new Error("Token no valido");
            return res.status(403).json({msg: e.message});
        }
    }

    //No hay token
    if(!token){
        const error = new Error("Token no valido o inexistente");
        res.status(403).json({msg: error.message});
    }

    next();
}

export default checkAuth;