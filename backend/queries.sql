-- Tabla usuarios
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellidos VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    departamento VARCHAR(100),
    rol VARCHAR(50)
);

-- Tabla historial chat
CREATE TABLE chat_history (
	chat_id SERIAL PRIMARY KEY,
	user_id INT NOT NULL,
	message TEXT NOT NULL,
	rol VARCHAR(10) NOT NULL CHECK(rol IN ('user', 'bot')),
	creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
)