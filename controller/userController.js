import logger from "../logger.js";
import bcrypt from "bcrypt";
import User from "../model/userModel.js";
import Chat from "../model/chatModel.js";
import CONST from "../constant.js";
import commonHelper from "../commonHelper.js";

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExist = await User.findOne({ email });

    if (userExist) {
      return res.status(200).json({
        success: false,
        msg: "You already exist",
        data: {},
      });
    }

    const imagePath = req.file ? "upload/images/" + req.file.filename : null;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name: name,
      email: email,
      password: hashedPassword,
      image: imagePath,
    });

    const result = await user.save();

    return res.status(200).json({
      success: true,
      msg: "Successfully register",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    // console.log(req.body);

    const { email, password } = req.body;
    const userExist = await User.findOne({ email });

    if (!userExist) {
      return res.status(200).json({
        success: false,
        msg: "User not found",
      });
    } else {
      const isMatch = await bcrypt.compare(password, userExist.password);
      if (isMatch) {
        return res.status(200).json({
          success: true,
          msg: "Login successfully.",
          data: userExist,
        });
      } else {
        return res.status(200).json({
          success: false,
          msg: "Incorrect credentials.",
        });
      }
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: error.message,
    });
  }
};

export const userList = async (req, res) => {
  try {
    const { sender_id } = req.body;
    const users = await User.find({ _id: { $nin: sender_id } });

    return res.status(200).json({
      success: true,
      msg: "data get successfully.",
      data: users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: error.message,
    });
  }
};

export const saveChat = async (payload, socket) => {
  // console.log("chatPayload:", payload);
  const userChat = new Chat({
    sender_id: payload.senderId,
    receiver_id: payload.receiverId,
    message: payload.message,
  });
  const result = await userChat.save();
  commonHelper.sendEvent(
    socket,
    "chatResponse",
    "true",
    "message sent successfully",
    result
  );
};
