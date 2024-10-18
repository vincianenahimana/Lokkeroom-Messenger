import connection from "../Config/dbConfig.mjs";


const createMessageInDb= async (body, userId, lobbyId) => {
    const queryCreateMessage = 'INSERT INTO message(body, user_id, lobby_id, create_at) VALUES(?, ?, ?, NOW())';
    const values = [body, userId, lobbyId];
    try {
        const [result] = await connection.query(queryCreateMessage, values);
        return result.insertId;
    } catch (error) {
        throw new Error('Error creating lobby: ' + error.message);
    }
};

const extractMessagesFromDb = async (lobbyId) => {
    const queryShowMessages = `SELECT  user.name, message.create_at, message.body FROM message JOIN user ON message.user_id = user.user_id where lobby_id = ? ORDER BY create_at`;


    try {
        const [result] = await connection.query(queryShowMessages, [lobbyId]);
        return result;
    }
    catch (error) {
        throw new Error('Error creating lobby: ' + error.message);
    }

}

export {createMessageInDb, extractMessagesFromDb}