const API_BASE_URL = 'https://proyecto-chat-bot-grupo-2.onrender.com';

export const sendChatQuery = async (prompt) => {
    const response = await fetch(`${API_BASE_URL}/query`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt })
    });

    if (!response.ok) {
        throw new Error('Error al conectar con el chatbot');
    }

    return await response.json();
};
