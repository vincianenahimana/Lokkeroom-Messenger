import createLobbyInDB from "../Models/lobbyModel.js";
import connection from "../Config/dbConfig.mjs";

const createLobby = async (req, res) =>  {
    const {name, admin_id } = req.body
    console.log(req.body);

    if (!name || !admin_id) {
        return res.status(400).json({ error: "Missing required field" });
    }
   try {
        const lobby = await createLobbyInDB(name, admin_id)
        return res.status(200).json(lobby);

   }
    catch (error) {
        return res.status(400).json({ error: "Can't create lobby" });
    }
}

export default createLobby;