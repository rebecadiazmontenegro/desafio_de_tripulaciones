const queries = {
  getUser: `
    SELECT * FROM 
        users
    WHERE 
        email = $1;
    `,
  createUser: `
   INSERT INTO users (nombre, apellidos, email, password, departamento, rol)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;

`,
};
module.exports = queries;
