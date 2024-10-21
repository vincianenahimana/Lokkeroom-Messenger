import connection from "../Config/dbConfig.mjs";

const createMessageInDb = async (body, userId, lobbyId) => {
  const queryCreateMessage =
    "INSERT INTO message(body, user_id, lobby_id, create_at) VALUES(?, ?, ?, NOW())";
  const values = [body, userId, lobbyId];
  try {
    const [result] = await connection.query(queryCreateMessage, values);
    return result.insertId;
  } catch (error) {
    throw new Error("Error creating lobby: " + error.message);
  }
};

const extractMessagesFromDb = async (lobbyId) => {
  const queryShowMessages = `SELECT  user.name, message.create_at, message.body FROM message JOIN user ON message.user_id = user.user_id where lobby_id = ? ORDER BY create_at`;

  try {
    const [result] = await connection.query(queryShowMessages, [lobbyId]);
    return result;
  } catch (error) {
    throw new Error("Error creating lobby: " + error.message);
  }
};

const getUsersAndAdminsMessagesInDB = async (messageId) => {
  const querygetUsers = `SELECT message.user_id, lobby.admin_id FROM message JOIN lobby ON message.lobby_id=lobby.lobby_id WHERE message.message_id=?`;
  try {
    const result = await connection.query(querygetUsers, [messageId]);
    return result;
  } catch (error) {
    throw new Error(`Error extract messages's users`);
  }
};

// const extractMessage = async (message_id) => {
//   const queryShowMessage = `SELECT body FROM message WHERE message_id=?`;
//   try {
//     const message = await connection.query(queryShowMessage, [message_id]);
//     return message;
//   } catch (error) {
//     throw new Error(`Error getting messages`);
//   }
// };

const updateMessageInDB = async (body, message_id) => {
  const queryEditMessage = `UPDATE message SET body = ? WHERE message_id=?`;
  try {
    const [messageEdit] = await connection.query(queryEditMessage, [
      body,
      message_id,
    ]);
    return messageEdit;
  } catch (error) {
    throw new Error(`Error Editing message`);
  }
};

const deleteMessageInDB = async (message_id) => {
  const queryDeleteMessage = `DELETE FROM message WHERE message_id=?`;
  try {
    const [messageDelete] = await connection.query(queryDeleteMessage, [
      message_id,
    ]);
    return messageDelete;
  } catch (error) {
    throw new Error(`Error Deleting message`);
  }
};

export {
  createMessageInDb,
  extractMessagesFromDb,
  getUsersAndAdminsMessagesInDB,
  updateMessageInDB,
  deleteMessageInDB,
};
