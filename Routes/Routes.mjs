import { login, signUp } from "../Controllers/authController.mjs";
import {
  createMessage,
  editMessage,
  deleteMessage,
  getMessageInLobby,
} from "../Controllers/messageController.mjs";
import express from "express";
import { createLobby, joinLobby } from "../Controllers/lobbyController.mjs";
import {
  verifyToken,
  verifyEmail,
  verifyLobbyExist,
  verifyUserAdminMessage,
  verifyIfUserIsInLobby,
} from "../Middleware/middleware.js";
import {
  showMessagesInLobby,
  showUsersInLoby,
} from "../Controllers/lobbyController.mjs";

const router = express.Router();

router.post("/login", login);

router.post("/signup", verifyEmail, signUp);

router.post("/createLobby", verifyToken, async (req, res) => {
  req.body.user_id = req.user.id;
  await createLobby(req, res);
});

router.post(
  "/lobby",
  verifyToken,
  verifyLobbyExist,
  verifyIfUserIsInLobby,
  async (req, res) => {
    req.body.user_id = req.user.id;
    await createMessage(req, res);
  }
);

router.get(
  "/lobby/:lobby_id/",
  verifyToken,
  verifyLobbyExist,
  verifyIfUserIsInLobby,
  async (req, res) => {
    req.body.user_id = req.user.id;
    await showMessagesInLobby(req, res);
  }
);

router.patch(
  "/lobby/:message_id",
  verifyToken,
  verifyUserAdminMessage,
  async (req, res) => {
    req.body.user_id = req.user.id;
    await editMessage(req, res);
  }
);

router.delete(
  "/messages/:message_id",
  verifyToken,
  verifyUserAdminMessage,
  async (req, res) => {
    req.body.user_id = req.params.user_id;
    await deleteMessage(req, res);
  }
);

router.post(
  "/join/:lobby_id",
  verifyToken,
  verifyLobbyExist,
  async (req, res) => {
    await joinLobby(req, res);
  }
);

router.get(
  "/:lobby_id/:message_id",
  verifyToken,
  verifyLobbyExist,
  verifyIfUserIsInLobby,
  async (req, res) => {
    await getMessageInLobby(req, res);
  }
);

router.get("/users", verifyToken, async (req, res) => {
  await showUsersInLoby(req, res);
});
export default router;
