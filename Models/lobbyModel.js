import connection from "../Config/dbConfig.mjs";

const addLobbyInDB = async (name, adminId) => {
  const queryInsertLobby = "INSERT INTO lobby(name, admin_id) VALUES(?, ?)";
  const queryInsertUserIntoLobby =
    " INSERT INTO user_lobby( user_id, lobby_id) VALUES (?,?)";
  const values = [name, adminId];
  try {
    const [result] = await connection.query(queryInsertLobby, values);

    const [insertUser] = await connection.query(queryInsertUserIntoLobby, [
      adminId,
      result.insertId,
    ]);
  } catch (error) {
    throw new Error(
      "Could not save lobby details to the database. Please ensure all required fields are valid." +
        error.message
    );
  }
};

const getLobbyInDB = async (lobby_id) => {
  const queryCheckLobbyExists = `SELECT lobby_id FROM lobby WHERE lobby_id=?`;
  try {
    const [result] = await connection.query(queryCheckLobbyExists, lobby_id);
    return result;
  } catch (error) {
    throw new Error(
      "Failed to retrieve lobby information. Please check if the lobby exists." +
        error.message
    );
  }
};

const joinLobbyInDB = async (user_id, lobby_id) => {
  const queryCheckLobbyExists = `SELECT lobby_id FROM lobby WHERE lobby_id=?`;
  const queryInsertUserToLobby =
    " INSERT INTO user_lobby( user_id, lobby_id) VALUES (?,?)";
  try {
    const [result] = await connection.query(queryCheckLobbyExists, lobby_id);
    await connection.query(queryInsertUserToLobby, [user_id, lobby_id]);
    return result;
  } catch (error) {
    throw new Error(
      "Lobby not found. Please check the lobby ID and try again." +
        error.message
    );
  }
};

const getUsersInLobby = async (lobby_id) => {
  const queryFetchUsersInLobby = `SELECT user_id FROM user_lobby WHERE lobby_id=?`;
  try {
    const [result] = await connection.query(queryFetchUsersInLobby, lobby_id);
    return result;
  } catch (error) {
    throw new Error("Unable to retrieve users in this lobby.");
  }
};

const getUsersInSameLobbyInDB = async (user_id) => {
  const queryFetchUsersInSameLobby = `SELECT user_lobby.lobby_id AS lobby_id, lobby.name AS lobby_name, user.user_id AS user_id, user.name AS username, user.email AS email  
    FROM user_lobby 
    JOIN user
    ON user_lobby.user_id = user.user_id 
    join lobby
    ON user_lobby.lobby_id = lobby.lobby_id
    WHERE user_lobby.lobby_id IN (
      SELECT user_lobby.lobby_id 
      FROM user_lobby 
      WHERE user_lobby.user_id = ?)
      `;
  try {
    const [result] = await connection.query(
      queryFetchUsersInSameLobby,
      user_id
    );
    return result;
  } catch (error) {
    throw new Error("Unable to retrieve users in the same lobby.");
  }
};

export {
  addLobbyInDB,
  getLobbyInDB,
  joinLobbyInDB,
  getUsersInLobby,
  getUsersInSameLobbyInDB,
};
