import { getReciverSocketId, io } from "../lib/socket.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import cloudinary from "cloudinary";
export const getUserForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");
    res.status(200).json(filteredUsers);
  } catch (err) {
    console.log("Error in getUserForSidebar", err.message);
    res.status(500).json({ err: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const message = await Message.find({
      $or: [
        { senderId: myId, reciverId: userToChatId },
        { senderId: userToChatId, reciverId: myId },
      ],
    });
    res.status(200).json(message);
  } catch (err) {
    console.log("error on getMessages controller");
    res.status(500).json({ message: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: reciverId } = req.params;
    const senderId = req.user._id;

    let imgeUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imgeUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      reciverId,
      text,
      image: imgeUrl,
    });

    await newMessage.save();
    const receiverSocketId = getReciverSocketId(reciverId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }
    res.status(201).json(newMessage);
  } catch (err) {
    console.log("Error in sendMessage controller", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
