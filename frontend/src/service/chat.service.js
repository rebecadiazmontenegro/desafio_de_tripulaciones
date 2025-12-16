const API_BASE_URL = import.meta.env.VITE_API_URL;

// Función para Coger el Token
const getToken = () => {
    const token = localStorage.getItem('token');
    return token ? `Bearer ${token}` : '';
};

// Función para Cargar Histoial
export const getMessages = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/history-chat`, {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                'Content-Type': 'application/json'
            }
        });

        if(!response.ok) {
            throw new Error('Error cargando historial');
        }
        // Devuelve el array de mensajes
        return await response.json();

    }catch (error) {
    console.error(error);
    return [];
  }
}

// Función Enviar Mensaje
export const sendChatQuery = async (prompt) => {
    try{
        const response = await fetch(`${API_BASE_URL}/chat`, {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: prompt })
        });
    
        if (!response.ok) {
            throw new Error('Error al enviar mensaje al servidor');
        }
    
        // Devuelve el mensaje del Bot desencriptado
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
  }
};
