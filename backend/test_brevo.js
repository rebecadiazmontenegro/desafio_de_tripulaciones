// const Brevo = require('@getbrevo/brevo');

// // 1. Configuración de la autenticación
// let apiInstance = new Brevo.TransactionalEmailsApi();
// // let apiKey = apiInstance.authentications['apiKey'];

// // ⚠️ PELIGRO: Para esta prueba pega la clave aquí, 
// // pero NUNCA subas este archivo a GitHub con la clave puesta.
// // En el proyecto real usarás process.env.BREVO_API_KEY

// // 2. Preparar el email
// let sendSmtpEmail = new Brevo.SendSmtpEmail();

// sendSmtpEmail.subject = "Prueba de conexión - Proyecto Chatbot";
// sendSmtpEmail.htmlContent = "<html><body><h1>¡Éxito!</h1><p>El sistema de correos funciona correctamente.</p></body></html>";

// // ⚠️ IMPORTANTE: Este email debe ser EXACTAMENTE el que verificaste en Brevo
// sendSmtpEmail.sender = { "name": "Admin Chatbot", "email": "moratinos.carlos5@gmail.com" };

// // A quién se lo envías (pon tu correo personal para ver si llega)
// sendSmtpEmail.to = [
//   { "email": "moratinos.carlos5@gmail.com", "name": "Alumno" }
// ];

// // 3. Enviar
// console.log("Intentando enviar correo...");

// apiInstance.sendTransacEmail(sendSmtpEmail).then(
//   function(data) {
//     console.log('✅ ¡CORREO ENVIADO CON ÉXITO!');
//     console.log('Respuesta de la API:', JSON.stringify(data));
//     console.log('👉 Revisa tu bandeja de entrada (y la carpeta de SPAM/Promociones)');
//   },
//   function(error) {
//     console.error('❌ ERROR FATAL:');
//     console.error(error);
//   }
// );