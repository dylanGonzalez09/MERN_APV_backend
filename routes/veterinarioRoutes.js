import express from "express";
import {
    registrar, perfil, confirmar, autenticar, olvidePassword, comprobarToken, nuevoPassword, actualizarPerfil, actualizarPassword
} from "../controllers/veterinarioController.js";
import checkAuth from "../middleware/authMiddleware.js";

const router = express.Router(); //Iniciar el router de express

//Rutas que no requieren cuenta - AREA PUBLICA
router.post("/", registrar); //Registrar las cuentas
router.get("/confirmar/:token", confirmar); //Routing dinamico, pasando parametro por la url
router.post("/login", autenticar);
router.post("/olvide-password", olvidePassword);
router.route("/olvide-password/:token").get(comprobarToken).post(nuevoPassword);

//Rutas que requieren cuenta - AREA PRIVADA
router.get("/perfil", checkAuth, perfil); //Una vez que se visita el perfil se ejecuta la funcion del middleware
router.put("/perfil/:id", checkAuth, actualizarPerfil);
router.put("/actualizar-password", checkAuth, actualizarPassword);

export default router;