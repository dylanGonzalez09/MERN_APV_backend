import mongoose from "mongoose";

const conectarDB = async () => {
    try {
        const db = await mongoose.connect(process.env.MONGO_URI, {
            // Objeto de configuracion (Cambia seguido)
            useNewUrlparser: true,
            useUnifiedTopology: true
        });

        const url = `${db.connection.host}:${db.connection.port}`;

        console.log("Mongo Db conectado en ", url);
    } catch (error) {
        console.log(error.message);
        preocess.exit(1);
    }
}

export default conectarDB;