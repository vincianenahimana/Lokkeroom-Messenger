import jwt from "jsonwebtoken";
import { getAllEmails } from "../Models/usersModel.js";
import { getUsersAndAdminsMessagesInDB } from "../Models/messageModel.js";
import { getAllLobbiesIdInDB } from "../Models/lobbyModel.js";

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    return res.status(401).send({ message: "Token is missing" });
  }

  jwt.verify(token, process.env.JWT_TOKEN, (err, user) => {
    if (err) return res.status(401).send({ message: "Invalid Token" });

    req.user = user;
    console.log("User from token: ", req.user);
    next();
  });
};

const verifyEmail = async (req, res, next) => {
  const { email } = req.body;
  try {
    const allEmails = await getAllEmails();
    const found = allEmails.some((row) => row.email === email);
    if (found) {
      return res.status(401).send({ message: "This mail already exist" });
    }

    next();
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Internal Server Error: " + error.message });
  }
};

const verifyLobbyExist = async (req, res, next) => {
  const { lobby_id } = req.body;

  const lobbies = await getAllLobbiesIdInDB();
  
  const found = lobbies.some((lobby) => {
    
   return lobby.lobby_id === lobby_id;

  });

  if (found) {
    return next();
  }

  res.status(401).send({ message: "The lobby does not exit, create one" });
};

const verifyUserAdminMessage = async (req, res, next) => {
  const user_id = req.user.id;
  const message_id = req.params.message_id;
  try {
    const [rows] = await getUsersAndAdminsMessagesInDB(message_id);
    if (!rows || rows.length === 0) {
      return res.status(401).send({ message: "This message is not exist" });
    }

    const foundUser = rows.some((row) => row.user_id === user_id);
    const foundAdmin = rows.some((row) => row.admin_id === user_id);

    if (foundUser || foundAdmin) {
      return next();
    }

    return res.status(401).send({
      message: "Only the user or admin can edit or delete the message",
    });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Internal Server Error: " + error.message });
  }
};

//     const authHeader = req.header('authorization');
//
//     if(!authHeader || !authHeader.startsWith('Bearer ')) {
//         return res
//             .status(401)
//             .json({ error: 'Incorrect Token' });
//     }
//     const token = authHeader.replace('Bearer ', '');
//
//     if(!token) {
//         return res
//             .status(401)
//             .json({ error: 'No Token Provided' });
//     }
//
//     try {
//         jwt.verify(token, process.env.JWT_TOKEN, (err, user) => {
//             if (err) return res.status(401).send({message: 'Invalid Token'});
//             req.user = user;
//             next();
//         })
//
//     } catch (error) {
//         console.log(error);
//         return res.status(401).json({ error : "Incorrect Token" });
//     }
//
// }

export { verifyToken, verifyEmail, verifyLobbyExist, verifyUserAdminMessage };
