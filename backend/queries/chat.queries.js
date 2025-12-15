const queries = {
    saveMessages: 
        ` INSERT INTO chat_history (user_id, message, rol)
            VALUES($1, $2, $3) RETURNING *;  `,
    getMessages:
        ` SELECT * FROM chat_history
            WHERE user_id = $1
            ORDER BY creation_date ASC;`,
}

module.exports = queries;