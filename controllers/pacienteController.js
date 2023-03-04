import Paciente from "../models/Paciente.js";

const agregarpaciente = async (req, res) => {
    console.log(req.body);

    const paciente = new Paciente(req.body); //Nuevo objeto de paciente con la informacion del formulario
    paciente.veterinario = req.veterinario._id;

    try {
        const pacienteGuardado = await paciente.save();

        res.json(pacienteGuardado);
    } catch (error) {
        console.log(error);
    }
}

const obtenerPacientes = async (req, res) => {
    const pacientes = await Paciente.find().where("veterinario").equals(req.veterinario); //Trae todos los resutlados como arreglo y json

    res.json({pacientes});
    
}

// Crud de los pacientes
const obtenerPaciente = async (req, res) => {
    const {id} = req.params;

    const paciente = await Paciente.findById(id);

    if(!paciente){
        return res.status(404).json({msg: "No encontrado"})
    }

    if(paciente.veterinario._id.toString() !== req.veterinario._id.toString()){ //Verificar si es el paciente del veterinario
        //NO es el paciente del veterinario
        return res.json({msg: "Accion no valida"});
    }

    res.json({paciente});
}

const actualizarPaciente = async (req, res) => {
    const {id} = req.params;

    const paciente = await Paciente.findById(id);

    if(!paciente){
        return res.status(404).json({msg: "No encontrado"});
    }

    if(paciente.veterinario._id.toString() !== req.veterinario._id.toString()){ //Verificar si es el paciente del veterinario
        //NO es el paciente del veterinario
        return res.json({msg: "Accion no valida"});
    }

    //Actualizar paciente
    paciente.nombre = req.body.nombre || paciente.nombre;
    paciente.propietario = req.body.propietario || paciente.propietario;
    paciente.email = req.body.email || paciente.email;
    paciente.fecha = req.body.fecha || paciente.fecha;
    paciente.sintomas = req.body.sintomas || paciente.sintomas;

    try {
        const pacienteActualizado = await paciente.save();
        res.json(pacienteActualizado);
    } catch (error) {
        console.log(error);
    }

}

const eliminarPaciente = async (req, res) => {
    const {id} = req.params;

    const paciente = await Paciente.findById(id);

    if(!paciente){
        return res.status(404).json({msg: "No encontrado"});
    }

    if(paciente.veterinario._id.toString() !== req.veterinario._id.toString()){ //Verificar si es el paciente del veterinario
        //NO es el paciente del veterinario
        return res.json({msg: "Accion no valida"});
    }

    try {
        await paciente.deleteOne();
        res.json({msg: "Paciente eliminado"});
    } catch (error) {
        console.log(error);
    }
}

export {
    agregarpaciente,
    obtenerPacientes,
    obtenerPaciente,
    actualizarPaciente,
    eliminarPaciente
}