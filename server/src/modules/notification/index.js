const Notification = require("./Notification");
const User = require("../auth/User");

const handlers = {
  async getNotification(userId, pageSize, hasChange) {
    try {
      let skip = pageSize;
      let limit = 8;
      
      if(hasChange) {
        skip = 0
        limit = pageSize
      }
      let notifications = await Notification.find({ user: userId })
        .populate([
          { path: "commenter", model: "User", select: "name avatar" },
          { path: "replier", model: "User", select: "name avatar" },
          { path: "rocks", model: "User", select: "name avatar" },
          { path: "flowers", model: "User", select: "name avatar" },
          { path: "post", model: "Post", select: "name _id" },
        ])
        .skip(skip)
        .limit(limit)
        .sort({
          date: -1,
        });


      let notisTotal = await Notification.countDocuments({ user: userId })
      let unSeenNotis = await Notification.countDocuments({user: userId, isSeen: false});
      let unReadNotis = await Notification.countDocuments({user: userId, status: 'unread'})
      return {
        listNotis: notifications,
        unSeenNotis: unSeenNotis,
        unReadNotis: unReadNotis,
        notisTotal: notisTotal
      };
    } catch (error) {
      return { error: error };
    }
  },

  async readNotification(notiId) {
    try {
      let notification = await Notification.findById(notiId);

      let notificationData = notification.toObject();
      notificationData.status = "read";

      await Notification.findByIdAndUpdate(notiId, notificationData, {
        new: true,
      });

    } catch (error) {
      return { error: error };
    }
  },

  async findNotiOwnersByUserId(userId) {
    try {
      let notiOwners = await Notification.find({$or: [
        {commenter: userId},
        {replier: userId},
        {rocks: userId},
        {flowers: userId}
      ]}, 'user')
      return notiOwners
    } catch (error) {
      return {error: error}
    }
  },

  async findNotiOwnersByPostId(postId) {
    try {
      let notiOwners = await Notification.find({post: postId}, 'user')
      return notiOwners
    } catch (error) {
      return {error: error}
    }
  },

  async seenAllNotifications(userId) {
    try {
      await Notification.updateMany(
        { user: userId },
        { $set: { isSeen: true } }
      );

    } catch (error) {
      return { error: error };
    }
  },

  async deleteAllNotis(req, res, next) {
    try {
      let notis = await Notification.deleteMany();

      res.json(notis);
    } catch (error) {
      next(error);
    }
  },

  async getAllNotis(req, res, next) {
    try {
      let notiss = await Notification.find();
      res.json(notiss);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = handlers;
