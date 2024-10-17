import connection from "../Config/dbConfig.mjs";


const createMessage= async (name, userId) => {
    const queryCreateMessage = 'INSERT INTO message(body, user_id) VALUES(?, ?)';
    const values = [name, userId];
    try {
        const [result] = await connection.query(queryCreateMessage, values);
        return result.insertId;
    } catch (error) {
        throw new Error('Error creating lobby: ' + error.message);
    }
};
