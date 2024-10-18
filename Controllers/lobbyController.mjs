import createLobbyInDB from "../Models/lobbyModel.js";


const createLobby = async (req, res) =>  {
    const {name} = req.body
    console.log(req.body);

    const user_id = req.user.id;
    console.log(user_id)

    if (!name || !user_id) {
        return res.status(400).json({ error: "Missing required field" });
    }
   try {
        const lobby = await createLobbyInDB(name, user_id)
        return res.status(200).json({message : "Lobby created", lobby, admin_id: user_id});

   }
    catch (error) {
        return res.status(400).json({ error: "Can't create lobby" });
    }
}

const joinLobby = async (req, res) => {

}



export default createLobby;