const chatModels = require("../models/chat.model");

const saveMessages = async (req, res) => {
    const API_BASE_URL = 'https://proyecto-chat-bot-grupo-2.onrender.com';
    try {
        const { message } = req.body;
        const user_id = req.user.id;
        if(!message) {
            return res.status(400).json({ message: "El mensaje no puede estar vacío." });
        }
        await chatModels.saveMessagesModel(user_id, message, 'user');

            const responseBot = await fetch(`${API_BASE_URL}/query`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    prompt: message })
            });
            if(!responseBot.ok){
                throw new Error("Error de API para conectar el bot")
            } 
            const data = await responseBot.json();
            console.log("Respuesta del Bot: ", data);

            const botText = JSON.stringify(data);
            const messageSaveBot = await chatModels.saveMessagesModel(user_id, botText, 'bot');

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