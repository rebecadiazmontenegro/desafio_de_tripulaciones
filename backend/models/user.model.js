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
  const { nombre, apellidos, email, password, departamento, rol } = user;
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

const updatePasswordModel = async (userId, hashedPassword) => {
  const client = await pool.connect();
  try {
    const query = "UPDATE users SET password = $1 WHERE id = $2";
    await client.query(query, [hashedPassword, userId]);
  } catch (error) {
    console.error("Error en updatePasswordModel:", error);
    throw error;
  } finally {
    client.release();
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
};
