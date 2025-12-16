const queries = require("../queries/user.queries");
const pool = require("../config/db_pgsql");

const getUserModel = async (email) => {
  let client, result;

  try {
    client = await pool.connect();
    const data = await client.query(queries.getUser, [email]);
    result = data.rows[0];
  } catch (err) {
    console.log(err);
    throw err;
  } finally {
    client.release();
  }

  return result;
};

const getAllManagersModel = async () => {
  let client, result;
  try {
    client = await pool.connect();
    const data = await client.query(queries.getAllManagers);
    result = data.rows; 
  } catch (err) {
    console.error("Error en getAllManagers:", err);
    throw err;
  } finally {
    if (client) client.release();
  }
  return result;
};

const getAllWorkersModel = async () => {
  let client, result;
  try {
    client = await pool.connect();
    const data = await client.query(queries.getAllWorkers);
    result = data.rows; 
  } catch (err) {
    console.error("Error en getAllWorkers:", err);
    throw err;
  } finally {
    if (client) client.release();
  }
  return result;
};

const createUserModel = async (user) => {
  const { nombre, apellidos, email, password, departamento, rol, reset_password_expires } = user;
  let client;

  try {
    client = await pool.connect();

    const data = await client.query(queries.createUser, [
      nombre,
      apellidos,
      email,
      password,
      departamento,
      rol,
      true,
      reset_password_expires
    ]);

    return data.rows[0];
  } catch (err) {
    console.log("Error en createUser:", err);
    throw err;
  } finally {
    if (client) client.release();
  }
}; 

const deleteUserByEmail = async (email) => {
  let client;
  try {
    client = await pool.connect();
    const result = await client.query(
      queries.deleteUserByEmail,
      [email]
    );
    return result.rows[0]; 
  } catch (err) {
    console.error("Error en deleteUserByEmail:", err);
    throw err;
  } finally {
    if (client) client.release();
  }
};

const getUserByIdModel = async (id) => {
  const client = await pool.connect();
  try {
    const query = "SELECT * FROM users WHERE id = $1";
    const result = await client.query(query, [id]);
    return result.rows[0];
  } catch (error) {
    console.error("Error en getUserByIdModel:", error);
    throw error;
  } finally {
    client.release();
  }
};

// const updatePasswordModel = async (userId, hashedPassword) => {
//   const client = await pool.connect();
//   try {
//     const query = "UPDATE users SET password = $1 WHERE id = $2";
//     await client.query(query, [hashedPassword, userId]);
//   } catch (error) {
//     console.error("Error en updatePasswordModel:", error);
//     throw error;
//   } finally {
//     client.release();
//   }
// };

// const updatePasswordModel = async (email, newPasswordHash) => {
//   try {
//     const client = await pool.query(queries.updatePassword, [ newPasswordHash, email ]);
//     return client.rows[0];
//   } catch (err) {
//     console.log("Error en al Cambiar Contraseña:", err);
//     throw err;
//   }
// }

const updateLoginAttemptsModel = async (userId, attempts, lockUntil) => {
  let client;
  try {
    client = await pool.connect();
    // Aquí usamos la variable queries.updateLoginStats, NO escribimos el string
    await client.query(queries.updateLoginStats, [attempts, lockUntil, userId]);
  } catch (err) {
    console.error("Error en updateLoginAttemptsModel:", err);
    throw err;
  } finally {
    if (client) client.release();
  }
};

const updatePasswordModel = async (email, hashedPassword, resetPassword = false, resetExpires = null) => {
  try {
    const query = `
      UPDATE users
      SET password = $1,
          reset_password = $2,
          reset_password_expires = $3
      WHERE email = $4
      RETURNING id, nombre, apellidos, email;
    `;

    const values = [hashedPassword, resetPassword, resetExpires, email];

    const result = await pool.query(query, values);
    return result.rows[0]; // Devuelve el usuario actualizado
  } catch (error) {
    console.error("Error en updatePasswordModel:", error);
    throw new Error("Error actualizando la contraseña.");
  }
};

module.exports = {
  createUserModel,
  getUserModel,
  getAllManagersModel,
  getAllWorkersModel,
  deleteUserByEmail,
  getUserByIdModel,
  updatePasswordModel,
  updateLoginAttemptsModel
};
