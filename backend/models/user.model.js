const queries = require("../queries/user.queries");
const pool = require("../config/db_pgsql");

const getUserModel = async (email) => {
  let client;
  try {
    client = await pool.connect();
    const result = await client.query(queries.getUser, [email]);
    return result.rows[0];
  } catch (err) {
    console.log(err);
    throw err;
  } finally {
    client.release();
  }
};

const getAllManagersModel = async () => {
  let client;
  try {
    client = await pool.connect();
    const result = await client.query(queries.getAllManagers);
    return result.rows;
  } catch (err) {
    console.error("Error en getAllManagers:", err);
    throw err;
  } finally {
    if (client) client.release();
  }
};

const getAllWorkersModel = async () => {
  let client;
  try {
    client = await pool.connect();
    const result = await client.query(queries.getAllWorkers);
    return result.rows;
  } catch (err) {
    console.error("Error en getAllWorkers:", err);
    throw err;
  } finally {
    if (client) client.release();
  }
};

const createUserModel = async (user) => {
  const {
    nombre,
    apellidos,
    email,
    password,
    departamento,
    rol,
    reset_password_expires
  } = user;

  let client;
  try {
    client = await pool.connect();
    const result = await client.query(queries.createUser, [
      nombre,
      apellidos,
      email,
      password,
      departamento,
      rol,
      true,
      reset_password_expires
    ]);
    return result.rows[0];
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
    const result = await client.query(queries.deleteUserByEmail, [email]);
    return result.rows[0];
  } catch (err) {
    console.error("Error en deleteUserByEmail:", err);
    throw err;
  } finally {
    if (client) client.release();
  }
};

const updateLoginAttemptsModel = async (userId, attempts, lockUntil) => {
  let client;
  try {
    client = await pool.connect();
    await client.query(queries.updateLoginStats, [
      attempts,
      lockUntil,
      userId
    ]);
  } catch (err) {
    console.error("Error en updateLoginAttemptsModel:", err);
    throw err;
  } finally {
    if (client) client.release();
  }
};

const getUserByIdModel = async (userId) => {
  let client;
  try {
    client = await pool.connect();
    const result = await client.query(queries.getUserById, [userId]);
    return result.rows[0] || null;
  } catch (error) {
    console.error("Error en getUserByIdModel:", error);
    throw error;
  } finally {
    if (client) client.release();
  }
};

const getUserByEmailModel = async (email) => {
  let client;
  try {
    client = await pool.connect();
    const result = await client.query(queries.getUserByEmail, [email]);
    return result.rows[0] || null;
  } catch (error) {
    console.error("Error en getUserByEmailModel:", error);
    throw error;
  } finally {
    if (client) client.release();
  }
};

const updatePasswordModel = async (email, hashedPassword, resetPassword, resetPasswordExpires) => {
  let client;
  try {
    client = await pool.connect();
    const result = await client.query(queries.updatePassword, [
      hashedPassword,
      resetPassword,
      resetPasswordExpires,
      email
    ]);
    return result.rows[0] || null;
  } catch (error) {
    console.error("Error en updatePasswordModel:", error);
    throw error;
  } finally {
    if (client) client.release();
  }
};

const updatePasswordNormalModel = async (userId, hashedPassword) => {
  let client;
  try {
    client = await pool.connect();
    const result = await client.query(
      queries.updatePasswordNormal,
      [hashedPassword, userId]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error("Error en updatePasswordNormalModel:", error);
    throw error;
  } finally {
    if (client) client.release();
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
  updateLoginAttemptsModel,
  getUserByEmailModel,
  updatePasswordNormalModel
};
