import { login, signUp } from "../Controllers/authController.mjs";
import {
  createMessage,
  editMessage,
  deleteMessage,
} from "../Controllers/messageController.mjs";
import express from "express";
import { createLobby } from "../Controllers/lobbyController.mjs";
import {
  verifyToken,
  verifyEmail,
  verifyLobbyExist,
  verifyUserAdminMessage,
  verifyIfUserIsInLobby,
} from "../Middleware/middleware.js";
import { showMessagesInLobby } from "../Controllers/lobbyController.mjs";

const router = express.Router();

router.post("/login", login);

router.post("/signup", verifyEmail, signUp);

router.post("/createLobby", verifyToken, async (req, res) => {
  req.body.user_id = req.user.id;
  await createLobby(req, res);
});

router.post("/lobby", verifyToken, verifyLobbyExist, async (req, res) => {
  req.body.user_id = req.user.id;
  await createMessage(req, res);
});

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
export default router;
