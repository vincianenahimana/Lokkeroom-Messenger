import {
  addLobbyInDB,
  joinLobbyInDB,
  getUsersInSameLobbyInDB,
} from "../Models/lobbyModel.js";
import { extractMessagesFromDb } from "../Models/messageModel.js";

const createLobby = async (req, res) => {
  const { name } = req.body;

  const user_id = req.user.id;

  if (!name || !user_id) {
    return res.status(400).json({ error: "Missing required field" });
  }
  try {
    const lobby = await addLobbyInDB(name, user_id);
    return res
      .status(200)
      .json({ message: "Lobby created", lobby, admin_id: user_id });
  } catch (error) {
    return res.status(400).json({ error: "Can't create lobby" });
  }
};

const showMessagesInLobby = async (req, res) => {
  const { lobby_id } = req.params;

  if (!lobby_id) {
    return res.status(400).json({ error: "Missing required field" });
  }
  try {
    const messages = await extractMessagesFromDb(lobby_id);

    if (messages.length === 0) {
      return res.status(400).json({ error: "No message in lobby" });
    }

    return res.status(200).json({ message: messages });
  } catch (error) {
    return res.status(400).json({ error: "Can't show lobby messages" });
  }
};

const joinLobby = async (req, res) => {
  const lobby_id = parseInt(req.params.lobby_id);
  const user_id = req.user.id;
  if (!lobby_id) return res.status(401).json({ error: "lobby id is required" });
  try {
    const lobby = await joinLobbyInDB(user_id, lobby_id);
    return res.status(200).json({ message: `You join lobby ${lobby_id}` });
  } catch (error) {
    return res.status(400).json({ error: "Can't join the lobby" });
  }
};

const showUsersInLoby = async (req, res) => {
  const user_id = parseInt(req.user.id);

  try {
    const users = await getUsersInSameLobbyInDB(user_id);

    return res.status(200).json({ users });
  } catch (error) {
    return res.status(400).json({ message: "Can't show lobby's users" });
  }
};
export { createLobby, showMessagesInLobby, joinLobby, showUsersInLoby };
