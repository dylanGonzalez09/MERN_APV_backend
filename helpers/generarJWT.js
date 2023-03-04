import jwt from "jsonwebtoken";

const generarJWT = (id) => {
    //Crea un nuevo jeson web token
    return jwt.sign({id}, process.env.JWT_SECRET, { //Palabra secreta para crear el token
        // Opciones
        expiresIn: "30d"
    }); 
}

export default generarJWT;