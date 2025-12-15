const queries = {
  getUser: `
    SELECT * FROM 
        users
    WHERE 
        email = $1;
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
   INSERT INTO users (nombre, apellidos, email, password, departamento, rol, reset_password, reset_password_expires)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *;
`,
  deleteUserByEmail: `
    DELETE FROM users
    WHERE email = $1
    RETURNING *;
`,

  updatePassword: 
  ` UPDATE users
      SET password = $1,
          reset_password = FALSE,
          reset_password_expires = NULL
      WHERE email = $2;`,
};

module.exports = queries;
