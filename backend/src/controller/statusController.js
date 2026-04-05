import { StatusSchema } from "../model/Status.js";

export class statusController {
  static async createStatus(req, res) {
    let { content } = req.body;
    let file = req.file;
    let userId = req.user.userId;

    try {
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

      const status = new StatusSchema({
        user: userId,
        content: content || imageorVideoUrl,
        expireAt: Date.now() + 24 * 60 * 60 * 1000,
        contentType: contexttype,
      });
      await status.save();

      return res
        .status(200)
        .send({ message: "status sent successfully", data: status });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: "Internal server error" });
    }
  }

  static async getStatus(req, res) {
    try {
      let status = StatusSchema.find({ expireAt: { $gt: Date.now() } })
        .populate("user", "userName profilePicture")
        .populate("viewer", "userName profilePicture");
      return res
        .status(200)
        .send({ message: "status fetch successfully", response: status });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: "Internal server error" });
    }
  }

  static async viewStatus(req, res) {
    try {
      let { statusId } = req.param;
      let userId = req.user.userId;

      let status = StatusSchema.find({ _id: statusId });
      if (!status) {
        return res.status(400).send({ message: "status not found" });
      }

      if (!status.viewer.includes(userId)) {
        status.viewer.push(userId);

        await status.save();

        StatusSchema.findById({ _id: statusId })
          .populate("user", "userName profilePicture")
          .populate("viewer", "userName profilePicture");
      } else {
        console.log("status already viewed by the user");
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: "Internal server error" });
    }
  }

  static async deleteStatus(req,res){
    const {statusId}=req.param;

    try {
        let status=StatusSchema.find({_id:statusId})
        if(!status){
            return res.status(400).send({message:'status not found'})
        }
        await status.deleteOne()

        return res.status(200).send({message:'status deleted successfully'})
    } catch (error) {
        console.log(error);
      return res.status(500).send({ message: "Internal server error" });
    }
  }
}
