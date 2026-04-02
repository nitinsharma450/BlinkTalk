import { ConversationSchema } from "../model/Converation.js";
import { UserSchema } from "../model/User.js";

export class userController {
  static async updateProfile(req, res) {
    let { userName, about, profilePicture } = req.body;
    try {
      let userId = req.user.userId;
      let response = await UserSchema.findByIdAndUpdate(userId, {
        $set: { userName: userName, about: about },
      });
      res
        .status(200)
        .json({ message: "Profile updated successfully", response: response });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async getAllUser(req, res) {
    try {
      const loggedInUser = req.user.userId;
      const users = await UserSchema.find({ en: { loggedInUser } }).select(
        "userName about profilePicture isOnline phoneNo PhoneSuffix lastSeen",
      );

      const usersWithConversation = Promise.all(
        users.map((user) => {
          const conversation = ConversationSchema.findOne({
            participants: { $all: [loggedInUser, user._id] },
          })
            .populate({
              path: "lastMessage",
              select: "content sender receiver",
            })
            .lean();

          return { ...user, conversation: conversation };
        }),
      );
      res
        .status(200)
        .json({
          message: "Users found successfully",
          response: usersWithConversation,
        });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }
}