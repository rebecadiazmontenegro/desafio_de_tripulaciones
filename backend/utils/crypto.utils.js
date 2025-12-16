const crypto = require('crypto');
// Algoritmo aes-256-cbc
const algotihm = 'aes-256-cbc';
const key = process.env.ENCRYPTION_KEY;
// Longitud del Vector de Inicialización
const ivLength = 16;


// Función para Encriptar
const encrypt = (text) => {
    if(!text) return text;

    // Generamos IV aleatorio cada vez, evitamos que una palabra se encripte igual dos veces
    const iv = crypto.randomBytes(ivLength);
    // Creamos el cifrador (la máquina)
    const cipher = crypto.createCipheriv(algotihm, Buffer.from(key), iv);

    // Encriptar texto
    let encrypted = cipher.update(text);
    // Terminar de encriptar, por si hay algún bit sin cifrar
        encrypted = Buffer.concat([ encrypted, cipher.final()]);

    return iv.toString('hex') + ':' + encrypted.toString('hex');
};

// Función para Desencriptar
const decrypt = (text) => {
    if(!text) return text;

    try {
        // Si al separar no hay dos partes es que el mensaje no estaba encriptado
        const textParts = text.split(':');
        // Si no tiene formato IV:Hex, significa que es un mensaje viejo sin encriptar, lo devolvemos tal cual para no romper la BBDD antigua.
        if(textParts.length < 2) return text;

        // Recuperamos IV y pasamos de texto a binario
        const iv = Buffer.from(textParts.shift(), 'hex');
        // Recuperamos Mensaje Cifrado y lo pasamos a Binario
        const encryptedText = Buffer.from(textParts.join(':'), 'hex');

        // Creamos el Descifrador (máquina modo reversa) / Le damos la misma llave e IV que acabamos de recuperar
        const decipher = crypto.createDecipheriv(algotihm, Buffer.from(key), iv);

        // Procesamos Desencriptación
        let decrypted = decipher.update(encryptedText);
            decrypted = Buffer.concat([ decrypted, decipher.final()]);

            // Convertimos resultado binacrio otra vez a texto legible
        return decrypted.toString();

    }catch (error) {
        // Si falla devolvemos el texto tal cual para no romper la aplicación
        console.error("Error desencriptando:", error.message);
        return text; 
    }
}

module.exports = {
    encrypt,
    decrypt
}