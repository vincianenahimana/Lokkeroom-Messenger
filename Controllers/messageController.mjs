import {createMessageInDb} from "../Models/messageModel.js";

const createMessage = async (req, res) =>  {
    const {body, lobby_id} = req.body

    const user_id = req.user.id;

    console.log("req.body = ", req.body)
    console.log("user_id = ", req.user.id)

    if (!body || !lobby_id) {
        return res.status(400).json({ error: "Missing required field" });
    }
    try {
        const messageId = await createMessageInDb(body, user_id, lobby_id);
        console.log("Message id :", messageId);
        return res.status(200).json({message : "Message posted", messageId, userId : user_id});

    }
    catch (error) {
        return res.status(400).json({ error: "Can't post message" });
    }
}



export {createMessage};