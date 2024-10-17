import {login, signUp} from "../Controllers/authController.mjs";
import express from "express";
import createLobby from "../Controllers/lobbyController.mjs";


const router = express.Router();

router.post('/login', login);

router.post('/signup', signUp);

router.post('/createLobby', createLobby)


export default router