import { uploadFileToCloudinary } from "../utils/cloudinaryConfig.js";
import { ConversationSchema } from "../model/Converation.js";
import { MessageSchema } from "../model/Message.js";

export class chatController {
  static async sendMessage(req, res) {
    let { content, senderId, receiverId, contentStatus } = req.body;
    let file = req.file;
    const participate = [senderId, receiverId];

    try {
      let conversation = await ConversationSchema.findOne({
        participant: { $all: participate },
      });

      if (!conversation) {
        conversation = new ConversationSchema({ participant: participate });
        await conversation.save();
      }

      let imageorVideoUrl = null;
      let contexttype = null;

      if (file) {
        const uploadFile = await uploadFileToCloudinary(file);

        if (!uploadFile.secure_url) {
          return res.status(500).send({ message: "File Upload Failed" });
        }
        imageorVideoUrl = uploadFile.secure_url;

        if (file.mimetype.startsWith("image")) {
          contexttype = "image";
        } else if (file.mimetype.startsWith("video")) {
          contexttype = "video";
        } else {
          return res.status(400).send({ message: "Invalid file type" });
        }
      } else if (content.trim()) {
        contexttype = "text";
      } else {
        return res.status(400).send({ message: "Content or file required" });
      }

      const message = new MessageSchema({
        conversation: conversation._id,
        reciever: receiverId,
        sender: senderId,
        content: content,
        imageorVideoUrl: imageorVideoUrl,
        contexttype: contexttype,
        messageStatus: contentStatus,
      });
      await message.save();

      conversation.lastMessage = message._id;
      conversation.unreadMessageCount += 1;
      await conversation.save();

      const populateMessage = await MessageSchema.findOne(message?._id)
        .populate("sender", "userName profilePicture")
        .populate("reciever", "userName profilePicture");

      if (req.io && req.socketUserMap) {
        const recieverSocketId = req.socketUserMap.get(receiverId);
        if (recieverSocketId) {
          req.io.to(recieverSocketId).emit("recieve_message", populateMessage);
          message.messageStatus = "delivered";
          await message.save();
        }
      }

      return res
        .status(200)
        .send({ message: "Message sent successfully", data: message });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: "Internal server error" });
    }
  }

  static async getMessage(req, res) {
    const conversationId = req.param;
    const userId = req.user.userId;

    try {
      let conversation = await ConversationSchema.findById(conversationId);

      if (!conversation) {
        return res.status(404).send({ message: "Conversation not found" });
      }
      if (!conversation.participant.includes(userId)) {
        return res.status(403).send({ message: "Access denied" });
      }

      const messages = await MessageSchema.find({
        conversation: conversationId,
      })
        .populate("sender", "username profilePicture")
        .populate("receiver", "username profilePicture")
        .sort("createdAt");

      await MessageSchema.updateMany(
        {
          conversation: conversationId,
          receiver: userId,
          messageStatus: { $in: ["send", "delivered"] },
        },
        { $set: { messageStatus: "read" } },
      );

      conversation.unreadCount = 0;
      await conversation.save();

      return res
        .status(200)
        .send({ message: "Messages retrieved successfully", data: messages });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: "Internal server error" });
    }
  }

  static async markAsRead(req, res) {
    const messageId = eq.body;
    const userId = req.user.userId;

    try {
      let messages = await MessageSchema.findOne({
        _id: { in: messageId },
        receiver: userId,
      });

      messages.updateMany(
        { _id: { in: messageId }, receiver: userId },
        { $set: { messageStatus: "read" } },
      );

      if (req.io && req.socketUserMap) {
        for (const message of messages) {
          const senderSocketId = req.socketUserMap.get(
            message.sender._id.toString(),
          );
          if (senderSocketId) {
            const updatedMessage = {
              messageId: message._id,
              messageStatus: "read",
            };
            res.io.to(senderSocketId).emit("message_read", updatedMessage);
            await message.save();
          }
        }
      }

      return res.status(200).send({
        message: "Message Mark as Read Successfully",
        response: messages,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: "Internal server error" });
    }
  }

  static async deleteMessage(req, res) {
    const { messageId } = req.param;
    const userId = req.user.userId;

    try {
      let message = MessageSchema.findById({ _id: messageId });

      if (!message) {
        return res.status(404).send({ message: "Message Not Found" });
      }

      if (message.sender.toString() !== userId) {
        return res
          .status(403)
          .send({ message: "Not Authorized to Delete this Message" });
      }
      await message.deleteOne();

      if (req.io && req.socketUserMap) {
        const recieverSocketId = req.socketUserMap.get(
          message.reciever._id.toString(),
        );
        if (recieverSocketId) {
          res.io.to(recieverSocketId).emit("message_delete", messageId);
        }
      }

      return res.status(200).send({ message: "Message Deleted Successfully" });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: "Internal server error" });
    }
  }
}
