import { createLobbyInDB } from "../Models/lobbyModel.js";
import { extractMessagesFromDb } from "../Models/messageModel.js";

const createLobby = async (req, res) => {
  const { name } = req.body;
  console.log(req.body);

  const user_id = req.user.id;
  console.log(user_id);

  if (!name || !user_id) {
    return res.status(400).json({ error: "Missing required field" });
  }
  try {
    const lobby = await createLobbyInDB(name, user_id);
    return res
      .status(200)
      .json({ message: "Lobby created", lobby, admin_id: user_id });
  } catch (error) {
    return res.status(400).json({ error: "Can't create lobby" });
  }
};

const showMessagesInLobby = async (req, res) => {
  const { lobby_id } = req.params;
  console.log(lobby_id);
  if (!lobby_id) {
    return res.status(400).json({ error: "Missing required field" });
  }
  try {
    const messages = await extractMessagesFromDb(lobby_id);
    console.log(messages);
    if (messages.length === 0) {
      return res.status(400).json({ error: "No message in lobby" });
    }

    return res.status(200).json({ message: messages });
  } catch (error) {
    return res.status(400).json({ error: "Can't show lobby messages" });
  }
};

export { createLobby, showMessagesInLobby };
