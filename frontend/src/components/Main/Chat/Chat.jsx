import React, { useState, useEffect, useRef } from 'react';

// URL del Backend (Ajustar a la configuración de Persona A)
const API_URL = 'http://localhost:4000/api/chat';

const Chat = () => {
    // 1. ESTADOS
    const [messages, setMessages] = useState([]); // Array que guarda toda la conversación
    const [input, setInput] = useState('');      // Lo que escribe el usuario
    const [loading, setLoading] = useState(false); // Para deshabilitar el input mientras espera
    const [userContext, setUserContext] = useState({}); // Rol y departamento
    
    // Ref para que la ventana haga scroll automático al final
    const messagesEndRef = useRef(null); 

    // 2. RECUPERAR CONTEXTO DEL USUARIO
    useEffect(() => {
        // Lee los datos guardados por el componente Login
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUserContext(JSON.parse(storedUser));
        }
        
        // Cargar un mensaje de bienvenida al inicio
        setMessages([{ 
            sender: 'bot', 
            text: `Hola, ${JSON.parse(storedUser)?.nombre}. Soy el Chatbot interno. ¿En qué puedo ayudarte con los datos de ${JSON.parse(storedUser)?.departamento.toUpperCase()}?` 
        }]);
    }, []);

    // 3. EFECTO DE SCROLL
    // Se ejecuta cada vez que 'messages' cambia
    useEffect(() => {
        // Mueve el scroll al último mensaje
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    
    // 4. FUNCIÓN PARA ENVIAR EL MENSAJE Y HACER LA LLAMADA API
    const handleSend = async (e) => {
        e.preventDefault();
        if (input.trim() === '' || loading) return;

        const userMessage = input.trim();
        setInput('');
        setLoading(true);

        // A. Agregar el mensaje del usuario al historial
        const newMessage = { sender: 'user', text: userMessage };
        setMessages(prev => [...prev, newMessage]);

        // Estructura de la petición al Backend (La clave)
        const token = localStorage.getItem('token');
        const context = userContext.departamento; // Enviamos el departamento como filtro

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Envía el token de seguridad
                    'X-User-Context': context // Envía el departamento como cabecera (HEADER)
                },
                body: JSON.stringify({ 
                    query: userMessage,
                    user_id: userContext.id,
                    department: context
                }),
            });

            if (!response.ok) {
                throw new Error('El servidor devolvió un error.');
            }

            const data = await response.json();
            
            // C. Agregar la respuesta del bot al historial (si vamos bien de tiempo)
            const botResponse = { sender: 'bot', text: data.response || 'No tengo respuesta para eso.' };
            setMessages(prev => [...prev, botResponse]);

        } catch (error) {
            console.error("Error al obtener respuesta del bot:", error);
            setMessages(prev => [...prev, { sender: 'bot', text: 'Lo siento, ha ocurrido un error de conexión.' }]);
        } finally {
            setLoading(false);
        }
    };


    // RENDERIZADO DEL CHAT
    return (
        <div className="chat-area">
            
            {/* VENTANA DE MENSAJES (El historial) */}
            <div className="messages-window">
                {messages.map((msg, index) => (
                    // Usamos una lista simple P/R como pediste
                    <div key={index} className={`message-item ${msg.sender}`}>
                        <strong>{msg.sender === 'user' ? 'Tú:' : 'Bot:'}</strong>
                        <span> {msg.text}</span>
                    </div>
                ))}
                <div ref={messagesEndRef} /> {/* El ancla para el scroll */}
            </div>

            {/*  FORMULARIO DE INPUT */}
            <form className="input-area" onSubmit={handleSend}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={loading ? "Esperando respuesta..." : "Escribe tu pregunta..."}
                    disabled={loading}
                />
                <button type="submit" disabled={loading}>
                    {loading ? '...' : 'Enviar'}
                </button>
            </form>
        </div>
    );
};

export default Chat;