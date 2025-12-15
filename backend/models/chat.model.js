const queries = require("../queries/chat.queries");
const pool = require("../config/db_pgsql");

const saveMessagesModel = async (user_id, message, rol) => {
    try {
        const resultMessage = await pool.query(queries.saveMessages, [ user_id, message, rol ]);
        return resultMessage.rows[0];
    } catch (err) {
    console.log("Error al Guardar Mensajes:", err);
    throw err;
  }
}

const getMessagesModel = async (user_id) => {
    try {
        const resultGetMessage = await pool.query(queries.getMessages, [ user_id ]);
        return resultGetMessage.rows;
    } catch (err) {
    console.log("Error al Leer Mensajes:", err);
    throw err;
  }
}

module.exports = {
    saveMessagesModel,
    getMessagesModel
};