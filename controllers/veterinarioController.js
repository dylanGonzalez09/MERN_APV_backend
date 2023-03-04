import Veterinario from "../models/Veterinario.js";
import generarJWT from "../helpers/generarJWT.js";
import generarId from "../helpers/generarId.js";
import emailRegistro from "../helpers/emailRegistro.js";
import emailOlvidePassword from "../helpers/emailOlvidePassword.js";

const registrar = async (req, res)=> {
    const {email, nombre} = req.body;

    // Prevenir usuarios duplicados
    const existeUsuario = await Veterinario.findOne({
        // Filtro de lo que vamos a buscar
        email
    });

    if(existeUsuario){
        const error = new Error("Usuario ya registrado");
        return res.status(400).json({
            msg: error.message
        }); //Cambia el codigo de error
    }

    try {
        // Guardar un nuevo veterinario en base a el modelo
        const veterinario = new Veterinario(req.body);
        const veterinarioGuardado = await veterinario.save(); //Guaradr objeto en la base de datos

        //Enviar email
        emailRegistro({
            email,
            nombre,
            token: veterinarioGuardado.token
        });

        res.json(veterinarioGuardado);
    } catch (error) {
        console.log(error);
    }

}

const perfil = (req, res)=> {
    const { veterinario } = req;

    res.json({perfil: veterinario});
}

const confirmar = async (req, res) => {
    //Leer parametro dinamico del token
    const { token } = req.params;

    //Buscar usuario con el token
    const usuarioConfirmar = await Veterinario.findOne({ token });

    if(!usuarioConfirmar){
        const error = new Error("Token no valido");
        
        return res.status(404).json({msg: error.message});
    }
    
    try {
        
        usuarioConfirmar.token = null;
        usuarioConfirmar.confirmado = true;

        await usuarioConfirmar.save(); //Guardar nuevamente el usuario en la base de datos

        
        res.json({msg: "Usuario Confirmando Correctamente"});
    } catch (error) {
        console.log(error);
    }

}

const autenticar = async (req, res) => {
    const {email, password} = req.body;

    //Comprobar si el usuario existe
    const usuario = await Veterinario.findOne({email});

    if(!usuario){ //NO existe el usuario
        const error = new Error("El usuario no existe");
        return res.status(403).json({msg: error.message}); //No esta autorizado
    }

    //Comprobar si el usuario esta comprobado via email
    if(!usuario.confirmado){
        const error = new Error("Tu cuenta no ha sido confirmada");
        return res.status(403).json({msg: error.message});
    }

    //Autenticar usuario
    //Revisar el password si es correcto
    if(await usuario.comprobarPassword(password)){
        //Autenticar 
        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            token: generarJWT(usuario.id)
        });
    }else{
        const error = new Error("El password es incorrecto");
        return res.status(403).json({msg: error.message});
    }

}

const olvidePassword = async (req, res) => {
    const { email } = req.body;

    const existeVeterinario = await Veterinario.findOne({email});

    if(!existeVeterinario){
        const error = new Error("El usuario no existe");
        return res.status(400).json({msg: error.message});
    }

    try {
        existeVeterinario.token = generarId(); //Generar token 
        //Guardar en la base de datos
        existeVeterinario.save();

        //Enviar email para recuperar el password
        emailOlvidePassword({
            email,
            nombre: existeVeterinario.nombre,
            token: existeVeterinario.token
        });

        res.json({msg: "Hemos enviado un email con las instrucciones"});
    } catch (error) {
        console.log(error);
    }
}

const comprobarToken = async (req, res) => {
    const { token } = req.params;
    const tokenValido = await Veterinario.findOne({token});

    if(tokenValido){
        //El token es valido, el usuario existe
        res.json({msg: "Token valido y el usuario existe"});
    }else{
        const error = new Error("Token no valido");
        return res.status(400).json({msg: error.message});
    }

}

const nuevoPassword = async (req, res) => {
    const {token} = req.params; //URl
    const {password} = req.body; //Formulario

    const veterinario = await Veterinario.findOne({token});

    if(!veterinario){
        const error = new Error("Hubo un error");
        return res.status(400).json({msg: error.message});
    }

    //Resetear la contraseña en la base de datos
    try {
        veterinario.token = null;
        veterinario.password = password;
        await veterinario.save();
        res.json({msg: "Password modificado correctamente"});
    } catch (error) {
        console.log(error);
    }
}

const actualizarPerfil = async (req, res) => {
    const veterinario = await Veterinario.findById(req.params.id);

    if(!veterinario){
        const error = new Error("Hubo un error");
        return res.status(400).json({msg: error.message});
    }

    const {email} = req.body;

    if(veterinario.email !== req.body.email){ //Usuario modifica el email - evitar duplicados
        const existeEmail = await Veterinario.findOne({ email });

        if(existeEmail){
            const error = new Error("El email ya existe");
            return res.status(400).json({msg: error.message});
        }
    }

    try {
        veterinario.nombre = req.body.nombre;
        veterinario.email = req.body.email;
        veterinario.web = req.body.web;
        veterinario.telefono = req.body.telefono;

        const veterinarioActualizado = await veterinario.save();
        res.json(veterinarioActualizado);

    } catch (error) {
        console.log(error);
    }
}

const actualizarPassword = async (req, res) => {
    // leer datos
    const {id} = req.veterinario;
    const {pwd_actual, pwd_nuevo} = req.body;

    // Comprobar que existe el veterinario
    const veterinario = await Veterinario.findById(id);
    if(!veterinario){
        const error = new Error("Hubo un error");
        return res.status(400).json({msg: error.message});
    }

    // Comprobar el password nuevo con el de la base de datos
    if(await veterinario.comprobarPassword(pwd_actual)){
        veterinario.password = pwd_nuevo;
        await veterinario.save();
        res.json({msg: "Password almacenado correctamente"});

    }else{
        const error = new Error("El password actual es incorrecto");
        return res.status(404).json({msg: error.message});
    }

    // Almacenar el password
}

export {
    registrar,
    perfil,
    confirmar,
    autenticar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    actualizarPerfil,
    actualizarPassword
}