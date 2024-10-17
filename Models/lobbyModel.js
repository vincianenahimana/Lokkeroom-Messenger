import connection from "../Config/dbConfig.mjs";


const createLobbyInDB = async (name, adminId) => {
    const queryCreateLobby = 'INSERT INTO lobby(name, admin_id) VALUES(?, ?)';
    const values = [name, adminId];
    try {
        const [result] = await connection.query(queryCreateLobby, values);
        console.log(result.insertId);
    } catch (error) {
        throw new Error('Error creating lobby: ' + error.message);
    }
};


export default createLobbyInDB