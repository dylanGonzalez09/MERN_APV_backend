import nodemailer from "nodemailer";

const emailOlvidePassword = async (datos) => {
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
        subject: "Restablece tu Password",
        text: "Restablece tu Password",
        html: `<p>Hola: ${nombre}, Has solicitado restablecer tu password.</p>
            <p>Entra al siguiente enlace para generar un nuevo password: 
                <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Recuperar mi cuenta!</a>
            </p>
            <p>Si tú no solicitaste restablecer tu password, ignora esté mensaje</p>
        
        `
    });

    console.log("Mensaje enviado: %s", info);
}

export default emailOlvidePassword;