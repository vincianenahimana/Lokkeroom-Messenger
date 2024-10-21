import connection from "../Config/dbConfig.mjs";

const createLobbyInDB = async (name, adminId) => {
  const queryCreateLobby = "INSERT INTO lobby(name, admin_id) VALUES(?, ?)";
  const values = [name, adminId];
  try {
    const [result] = await connection.query(queryCreateLobby, values);
    console.log(result.insertId);
  } catch (error) {
    throw new Error("Error creating lobby: " + error.message);
  }
};

const getAllLobbiesIdInDB = async () => {
  const querygetLobbyId = `SELECT lobby_id FROM lobby`;
  try {
    const [result] = await connection.query(querygetLobbyId);
    return result;
  } catch (error) {
    throw new Error("Error getting lobbies" + error.message);
  }
};

export { createLobbyInDB, getAllLobbiesIdInDB };
