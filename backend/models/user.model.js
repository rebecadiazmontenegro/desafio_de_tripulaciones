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

const createUser = async (user) => {
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


module.exports = {
  createUser,
  getUserModel,
};
