import {createMessageInDb} from "../Models/messageModel.js";

const createMessage = async (req, res) =>  {
    const {body, lobby_id} = req.body

    const user_id = req.user.id;


    if (!body || !lobby_id) {
        return res.status(400).json({ error: "Missing required field" });
    }
    try {
        const text = await createMessageInDb(body, user_id, lobby_id);

        return res.status(200).json({message : "Message posted", text, userId : user_id});

    }
    catch (error) {
        return res.status(400).json({ error: "Can't post message" });
    }
}

export {createMessage};