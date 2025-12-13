const queries = {
  getUser: `
    SELECT * FROM 
        users
    WHERE 
        email = $1;
    `,

  getAllManagers: `
  SELECT nombre, apellidos, departamento
  FROM users
  WHERE rol = 'manager';
`,

  getAllWorkers: `
  SELECT nombre, apellidos
  FROM users
  WHERE rol = 'worker';
`,

  createUser: `
   INSERT INTO users (nombre, apellidos, email, password, departamento, rol)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
`,
  deleteUserByEmail: `
    DELETE FROM users
    WHERE email = $1
    RETURNING *;
`,
};

module.exports = queries;
