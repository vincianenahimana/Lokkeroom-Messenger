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

const getLobbyInDB = async (lobby_id) => {
  const querygetLobbyId = `SELECT lobby_id FROM lobby WHERE lobby_id=?`;
  try {
    const [result] = await connection.query(querygetLobbyId, lobby_id);
    return result;
  } catch (error) {
    throw new Error("Error getting lobbies" + error.message);
  }
};

const joinLobbyInDB = async (lobby_id) => {
  const querygetLobbyId = `SELECT lobby_id FROM lobby WHERE lobby_id=?`;
  try {
    const [result] = await connection.query(querygetLobbyId, lobby_id);
    return result;
  } catch (error) {
    throw new Error("Error joining lobby" + error.message);
  }
};

const getUsersInLobby = async (lobby_id) => {
  const querygetUsersInLobby = `SELECT user_id FROM lobby WHERE lobby_id=?`;
  try {
    const [result] = await connection.query(querygetUsersInLobby, lobby_id);
    return result;
  } catch (error) {
    throw new Error("Can't show users in Lobby");
  }
};



export { createLobbyInDB, getLobbyInDB, joinLobbyInDB, getUsersInLobby};
