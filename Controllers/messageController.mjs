import {
  createMessageInDb,
  updateMessageInDB,
  deleteMessageInDB,
} from "../Models/messageModel.js";

const createMessage = async (req, res) => {
  const { body, lobby_id } = req.body ;

  const user_id = req.user.id;

  console.log("req.body = ", req.body);
  console.log("user_id = ", req.user.id);

  if (!body || !lobby_id) {
    return res.status(400).json({ error: "Missing required field" });
  }
  try {
    const messageId = await createMessageInDb(body, user_id, lobby_id);
    console.log("Message id :", messageId);
    return res
      .status(200)
      .json({ message: "Message posted", messageId, userId: user_id });
  } catch (error) {
    return res.status(400).json({ error: "Can't post message" });
  }
};

const editMessage = async (req, res) => {
  const { body } = req.body;

  const message_id = req.params.message_id;

  try {
    const messageEdit = await updateMessageInDB(body, message_id);

    return res.status(200).json({
      messageEdit: messageEdit,
      message_id: message_id,
    });
  } catch (error) {
    return res.status(400).json({ error: "Can't edit message" });
  }
};

const deleteMessage = async (req, res) => {
  const message_id = req.params.message_id;
  console.log("message a supprimer", message_id);
  
  try {
    const messageDelete = await deleteMessageInDB(message_id);

    return res.status(200).json({
      messageDelete: messageDelete,
      message_id: message_id,
    });
  } catch (error) {
    return res.status(400).json({ error: "Can't Delete message" });
  }
};
export { createMessage, editMessage, deleteMessage };
