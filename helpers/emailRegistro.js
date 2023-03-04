import nodemailer from "nodemailer";

const emailRegistro = async (datos) => {
    var transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
    });

    //Enviar el email
    const {email, nombre, token} = datos;

    const info = await transport.sendMail({
        // Configuracion del email
        from: "APV - Administrador de Pacientes de Veterinaria",
        to: email,
        subject: "Comprueba tu cuenta en APV",
        text: "Comprueba tu cuenta en APV",
        html: `<p>Hola: ${nombre}, comprueba tu cuenta en APV.</p>
            <p>Tu cuenta ya esta lista, solo debes comprobarla en el siguiente enlace: 
                <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar cuenta!</a>
            </p>
            <p>Si tú no creaste esta cuenta, ignora esté mensaje</p>
        
        `
    });
}

export default emailRegistro;