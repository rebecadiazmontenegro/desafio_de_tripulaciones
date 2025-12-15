const chatModels = require("../models/chat.model");

const saveMessages = async (req, res) => {
    try {
        const { message } = req.body;
        const user_id = req.user.id;
        if(!message) {
            return res.status(400).json({ message: "El mensaje no puede estar vacío." });
        }
        await chatModels.saveMessagesModel(user_id, message, 'user');

        // PASO 2: LLAMAR AL BOT USANDO FETCH

        // Aquí va la llamada a la API
        const responseBot = "Esto es una respuesta automática del Bot";
        const messageSaveBot = await chatModels.saveMessagesModel(user_id, responseBot, 'bot');

        // Devolvemos el mensaje de bot
        res.status(201).json(messageSaveBot);
    } catch (error) {
            console.error("Error al procesar el chat:", error);
            res.status(500).json({
            message: "Error en en el chatBot",
            error: error.message,
            });
    }
}

const getMessages = async (req, res) => {
    try {
        const user_id = req.user.id;
        const messages = await chatModels.getMessagesModel(user_id);
        res.status(200).json(messages);
    } catch (error) {
            console.error("Error al obtener historial del chat:", error);
            res.status(500).json({
            message: "Error en historial del chat",
            error: error.message,
            });
    }
}

module.exports = {
    saveMessages,
    getMessages
}