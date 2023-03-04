import express from "express";
import { agregarpaciente, obtenerPacientes, obtenerPaciente, actualizarPaciente, eliminarPaciente } from "../controllers/pacienteController.js";
import checkAuth from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").post(checkAuth, agregarpaciente).get(checkAuth, obtenerPacientes);

router.route("/:id")
    .get(checkAuth, obtenerPaciente)
    .put(checkAuth, actualizarPaciente) //Actualiza un paciente
    .delete(checkAuth, eliminarPaciente);

export default router;