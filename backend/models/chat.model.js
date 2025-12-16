const queries = require("../queries/chat.queries");
const pool = require("../config/db_pgsql");
const { encrypt, decrypt } = require ("../utils/crypto.utils");

const saveMessagesModel = async (user_id, message, rol) => {
    try {
      // Encriptamos mensaje antes de hablar con la BBDD
      const messageEncrypted = encrypt(message);

        const resultMessage = await pool.query(queries.saveMessages, [ user_id, messageEncrypted, rol ]);

        const rowResultMessage = resultMessage.rows[0];
        // Desencriptar para mostrar en Front
        rowResultMessage.message = decrypt(rowResultMessage.message);
        return rowResultMessage;
    } catch (err) {
    console.log("Error al Guardar Mensajes:", err);
    throw err;
  }
}

const getMessagesModel = async (user_id) => {
    try {
        // Pedimos todos los mensajes a la BBDD, vienen encriptados
        const resultGetMessage = await pool.query(queries.getMessages, [ user_id ]);

        // Recorremos el array de resultados uno a uno
        const decryptedRows = resultGetMessage.rows.map(row => {
          return {
            // Copiamos id, fecha, rol...
            ...row, 
              // Sustituimos el mensaje encriptado por el legible
              message: decrypt(row.message)
          }
        })

        // Devolvemos la lista limpia y legible
        return decryptedRows;
    } catch (err) {
    console.log("Error al Leer Mensajes:", err);
    throw err;
  }
}

module.exports = {
    saveMessagesModel,
    getMessagesModel
};