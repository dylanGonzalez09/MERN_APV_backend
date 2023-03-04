import express from "express";
import dotenv from "dotenv";
import cors from "cors"; //Forma de proteger una API
import conectarDB from "./config/DB.js";
import veterinarioRouter from "./routes/veterinarioRoutes.js";
import pacienteRoutes from "./routes/pacienteRoutes.js";


// Crear servidor con express
const app = express();
app.use(express.json()); //Permite leer lo que el usuario envia por medio del req.body

dotenv.config();
conectarDB();

//Solucionar error de cors en el frontend
const dominiosPermitidos = [process.env.FRONTEND_URL];
const corsOptions = {
    origin: function(origin, callback){
        if(dominiosPermitidos.indexOf(origin) !== -1){
            //El origen del request esta permitido
            callback(null, true);
        }else{
            callback(new Error("No permitido por CORS"));
        }
    }
}
app.use(cors(corsOptions));


app.use("/api/veterinarios", veterinarioRouter); //Llama el archivo al visitar esa URL
app.use("/api/pacientes", pacienteRoutes); //Llama el archivo al visitar esa URL

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log('Servern on');
}); //Puerto para el backend