const queries = {
  getUser: `
    SELECT *
    FROM users
    WHERE email = $1;
  `,

  getAllManagers: `
    SELECT nombre, apellidos, departamento, email
    FROM users
    WHERE rol = 'manager';
  `,

  getAllWorkers: `
    SELECT nombre, apellidos, email
    FROM users
    WHERE rol = 'worker';
  `,

  createUser: `
    INSERT INTO users 
      (nombre, apellidos, email, password, departamento, rol, reset_password, reset_password_expires)
    VALUES 
      ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *;
  `,

  deleteUserByEmail: `
    DELETE FROM users
    WHERE email = $1
    RETURNING *;
  `,

  updateLoginStats: `
    UPDATE users 
    SET intentos_fallidos = $1, 
        bloqueado_hasta = $2 
    WHERE id = $3;
  `,

  getUserById: `
    SELECT id, nombre, apellidos, email, password, rol, departamento, 
           reset_password, reset_password_expires
    FROM users
    WHERE id = $1;
  `,

  getUserByEmail: `
    SELECT id, nombre, apellidos, email, password, rol, departamento, 
           reset_password, reset_password_expires
    FROM users
    WHERE email = $1;
  `,

  updatePassword: `
    UPDATE users 
    SET password = $1, 
        reset_password = $2, 
        reset_password_expires = $3
    WHERE email = $4
    RETURNING id, email, nombre;
  `,

  updatePasswordNormal: `
    UPDATE users 
    SET password = $1
    WHERE id = $2
    RETURNING id, email, nombre;
  `
};

module.exports = queries;
