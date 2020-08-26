const Post = require("./Post");
const User = require("../auth/User");
const Comment = require("../comment/Comment");
const Notification = require("../notification/Notification");

const { decreaseReactTotal, removeFromArrayByValue } = require("../utils");

const handlers = {
  async getPost(postId) {
    try {
      let id = postId;
      let populateQuery = [
        { path: "writer", select: "_id name avatar" },
        { path: "notes", select: "user._id" },
        { path: "flowers", select: "user._id" },
        { path: "rocks", select: "user._id" },
      ];

      let post = await Post.findById(id).populate(populateQuery);

      if (!post) {
        return { error: error };
      }

      return post;
    } catch (error) {
      return { error: error };
    }
  },

  async getPostWriter(postId) {
    try {
      let post = await Post.findOne({
        _id: postId,
        writer: { $exists: true },
      });

      return post ? post.writer : null;
    } catch (error) {
      return { error: error };
    }
  },

  async findUserInComments(userId, postId) {
    try {
      let posts = await Comment.find({ user: userId }, "post");
      return posts;
    } catch (error) {
      return { error: error };
    }
  },

  async deletePost(req, res, next) {
    try {
      let postId = req.params.postId;
      let userId = req.user.id;
      let post = await Post.findById(postId).populate({
        path: "comments",
        model: "Comment",
        select: "_id replies",
        populate: { path: "replies", select: "_id" },
      });

      if (post) {
        if (String(post.writer) == String(userId)) {
          await Comment.deleteMany({ post: postId });

          await Post.findByIdAndDelete(postId);

          decreaseReactTotal(userId, post.flowersTotal, post.rocksTotal);

          await Notification.deleteMany({ post: postId });

          await User.updateMany(
            {
              $or: [
                { _id: post.writer },
                { notes: { $elemMatch: { post: postId } } },
                { flowers: { $elemMatch: { post: postId } } },
                { rocks: { $elemMatch: { post: postId } } },
              ],
            },
            {
              $pull: {
                reviews: postId,
                notes: { post: postId },
                flowers: { post: postId },
                rocks: { post: postId },
              },
            }
          );

          res.json({
            message: "Your post has been deleted",
          });
        } else {
          throw new Error("Unauthorized");
        }
      } else {
        throw new Error("No post found");
      }
    } catch (error) {
      next(error);
    }
  },


  async createPost(req, res, next) {
    try {
      let data = req.body;
      let post;
      if (req.user) {
        let userId = req.user.id;
        data.writer = userId;

        post = await Post.create(data);
        await User.updateOne(
          { _id: userId },
          {
            $push: {
              reviews: post._id,
              $sort: { date: -1 },
            },
          },
          { safe: true, multi: true }
        );
      } else {
        post = await Post.create(data);
      }

      res.json({ message: "Posted successfully" });
    } catch (error) {
      next(error);
    }
  },

  async reactPost(userId, postId, reactIcon) {
    try {
      let toggleIcon = reactIcon === "flowers" ? "rocks" : "flowers";
      let post = await Post.findById(postId);

      let isReact = await User.findOne({
        _id: userId,
        [reactIcon]: { $elemMatch: { post: postId } },
      });

      if (isReact) {
        await User.updateOne(
          { _id: userId },
          {
            $pull: {
              [reactIcon]: { post: postId },
            },
          }
        );
        await Post.updateOne(
          { _id: postId },
          {
            $pull: {
              [reactIcon]: { user: userId },
            },
          }
        );

        if (post.toObject().hasOwnProperty("writer")) {
          let notification = await Notification.findOne({
            post: postId,
            [reactIcon]: userId,
          });

          if (notification) {
            let notificationId = notification._id;
            await Notification.findByIdAndDelete(notificationId);
          }
        }
      } else {
        await User.updateOne(
          { _id: userId },
          {
            $push: {
              [reactIcon]: { post: postId },
            },
            $pull: {
              [toggleIcon]: { post: postId },
            },
          }
        );

        await Post.updateOne(
          { _id: postId },
          {
            $push: {
              [reactIcon]: { user: userId },
            },
            $pull: {
              [toggleIcon]: { user: userId },
            },
          }
        );

        if (post.toObject().hasOwnProperty("writer")) {
          if (userId != post.writer) {
            let notificationData = {
              user: post.writer,
              [reactIcon]: userId,
              post: postId,
            };
            await Notification.create(notificationData);
          }
          let removeNotification = await Notification.findOne({
            post: postId,
            [toggleIcon]: userId,
          });

          if (removeNotification) {
            let removeNotificationId = removeNotification._id;

            await Notification.findByIdAndDelete(removeNotificationId);
          }
        }
      }
    } catch (error) {
      return { error: error };
    }
  },

  async notePost(req, res, next) {
    try {
      let postId = req.params.postId;
      let userId = req.user.id;

      let post = await Post.findById(postId);

      let isExist = await User.findOne({
        _id: userId,
        notes: { $elemMatch: { post: postId } },
      });
      if (isExist) {
        await User.updateOne(
          { _id: userId },
          {
            $pull: {
              notes: { post: postId },
            },
          }
        );
        await Post.updateOne(
          { _id: postId },
          {
            $pull: {
              notes: { user: userId },
            },
          }
        );
        res.json({ message: "Unsaved from your notes" });
      } else {
        await User.updateOne(
          { _id: userId },
          {
            $push: {
              notes: { post: postId },
            },
          }
        );
        await Post.updateOne(
          { _id: postId },
          {
            $push: {
              notes: { user: userId },
            },
          }
        );
        res.json({ message: "Saved to your notes" });
      }
    } catch (error) {
      next(error);
    }
  },

  async updatePost(req, res, next) {
    try {
      let postId = req.params.postId;
      let userId = req.user.id;
      let post = await Post.findById(postId);
      if (post) {
        post = await Post.findOne({ _id: postId, writer: userId });
        if (post) {
          const updateFields = {};
          for (const [key, value] of Object.entries(req.body)) {
            updateFields[key] = value;
          }

          await Post.updateOne({ _id: postId }, { $set: updateFields });

          res.json({ message: "Updated successfully" });
        } else {
          throw new Error("Unauthorized");
        }
      } else {
        throw new Error("No post found");
      }
    } catch (error) {
      next(error);
    }
  },

  async getCategoryPosts(req, res, next) {
    try {
      let conditions = {};
      let category = req.params.category;
      if (String(category) != "all") {
        conditions.category = category;
      }

      let { pageIndex = 1, search = "", sortBy = "flowersTotal" } = req.query;

      pageIndex = parseInt(pageIndex);

      let pageSize = 10;
      let skip = (pageIndex - 1) * pageSize;
      let limit = pageSize;

      if (search) {
        conditions.name = new RegExp(search, "i");
      }

      let count = await Post.countDocuments(conditions);

      let posts = await Post.find(
        conditions,
        "-flowers -comments -rocks -date -category -writer -content"
      )
        .populate({ path: "notes", select: "user._id" })
        .skip(skip)
        .limit(limit)
        .sort({
          [sortBy]: -1,
        });

      res.json({
        posts: posts,
        postsTotal: count,
      });
    } catch (error) {
      next(error);
    }
  },

  async getTop3Posts(req, res, next) {
    try {
      let posts = await Post.find({}, "name avatar")
        .sort({
          flowersTotal: -1,
        })
        .limit(3);

      res.json(posts);
    } catch (error) {
      next(error);
    }
  },

  async getUserPosts(req, res, next) {
    try {
      let conditions = {};
      let category = req.params.category;
      let userId = req.params.userId;

      if (String(category) != "all") {
        conditions.category = category;
      }

      let user = await User.findById(userId);
      if (user) {
        let {
          pageIndex = 1,
          search = "",
          sortBy = "flowers",
          title,
        } = req.query;

        pageIndex = parseInt(pageIndex);

        let pageSize = 10;
        let skip = (pageIndex - 1) * pageSize;
        let limit = pageSize;

        if (search) {
          conditions.name = new RegExp(search, "i");
        }

        if (title == "reviews") {
          conditions.writer = userId;
        } else {
          conditions.notes = { $elemMatch: { user: userId } };
        }

        let count = await Post.countDocuments(conditions);

        let posts = await Post.find(
          conditions,
          "-flowers -comments -rocks -date -category -writer -content"
        )
          .populate({ path: "notes", select: "user._id" })
          .skip(skip)
          .limit(limit)
          .sort({
            [sortBy]: -1,
          });

        res.json({
          posts: posts,
          postsTotal: count,
        });
      } else {
        throw new Error("No user found");
      }
    } catch (error) {
      next(error);
    }
  },

  async deleteAllPosts(req, res, next) {
    try {
      let posts = await Post.deleteMany();
      res.json(posts);
    } catch (error) {
      next(error);
    }
  },

  async getAllPosts(req, res, next) {
    try {
      let posts = await Post.find({});
      res.json(posts);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = handlers;
