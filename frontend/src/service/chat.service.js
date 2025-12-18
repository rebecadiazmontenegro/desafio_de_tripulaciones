const API_BASE_URL = 'https://kairo-ejt6.onrender.com';

export const sendChatQuery = async (prompt) => {
    const response = await fetch(`${API_BASE_URL}/consulta`, {
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
