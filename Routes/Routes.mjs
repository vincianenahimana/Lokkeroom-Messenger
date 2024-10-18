import {login, signUp} from "../Controllers/authController.mjs";
import {createMessage} from "../Controllers/messageController.mjs";
import express from "express";
import createLobby from "../Controllers/lobbyController.mjs";
import {verifyToken} from "../Middleware/middleware.js";


const router = express.Router();

router.post('/login', login);

router.post('/signup', signUp);

router.post('/createLobby', verifyToken, async (req, res) => {
    req.body.user_id = req.user.id;
    await createLobby(req, res);
});


router.post('/lobby', verifyToken, async (req, res) => {
    req.body.user_id = req.user.id;
    await createMessage(req, res);
});
export default router