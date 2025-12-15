const Brevo = require('@getbrevo/brevo');
require("dotenv").config();


// Configuración de la autenticación
let apiInstance = new Brevo.TransactionalEmailsApi();
let apiKey = apiInstance.authentications['apiKey'];
apiKey.apiKey = process.env.BREVO_API_KEY;

const changePassword = async (email, username, defaultPassword) => {
    const SendSmtpEmail = new Brevo.SendSmtpEmail();

    const urlFrontend = process.env.EMAIL || process.env.FRONTEND_URL;

    // Email
    SendSmtpEmail.subject = "Bienvenid@ a la Empresa!";
    SendSmtpEmail.sender = { "name": "Desafío Tripulaciones", "email": process.env.EMAIL_SENDER };
    SendSmtpEmail.to = [{ "email": email, "name": username }];

    SendSmtpEmail.htmlContent = 
        ` <h1>Hola ${username},</h1>
            <p>Su cuenta ha sido creada exitosamente por tu manager.</p>
            <p>Su contraseña temporal es: <strong>${defaultPassword}</strong></p>
            <p>Está contraseña tiene una duración de <strong>30 minutos</strong>. Por favor, entra y cámbiala inmediatamente.</p>
            <a href=${urlFrontend}>Ir a Iniciar Sesión</a>`;
    
    try {
        // Envío de Email
        await apiInstance.sendTransacEmail(SendSmtpEmail);
        console.log(`Correo enviado a ${email}`);
        return true;
    } catch (error) {
        console.error("Error enviando email:", error);
        return false; // Para que el controlador sepa que falló
    }
}

module.exports = {
    changePassword
}