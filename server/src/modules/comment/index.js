const Comment = require("./Comment");
const Post = require("../post/Post");
const Notification = require("../notification/Notification");
const User = require("../auth/User");

const { removeNoti } = require("../utils");

const handlers = {
  async getComments(postId, sortBy = "newest", pageSize = 0, hasChange = false) {
    try {
      sortBy = sortBy == "newest" ? { date: -1 } : { date: 1 };
      let skip = pageSize;
      
      let limit = 10;
      
      if(hasChange) {
        skip = 0
        limit = pageSize
      }

      let comments = await Comment.find({ post: postId, isReply: false })
        .populate([
          { path: "user", model: "User", select: "_id name avatar" },
          {
            path: "replies",
            model: "Comment",
            populate: {
              path: "user",
              model: "User",
              select: "_id name avatar",
            },
          },
        ])
        .skip(skip)
        .limit(limit)
        .sort(sortBy);


      let count = await Comment.countDocuments({ post: postId, isReply: false });

      return {
        comments: comments,
        commentsTotal: count,
      };
    } catch (error) {
      return { error: error };
    }
  },

  async getCommentersOfPost(postId) {
    try {
      let comments = await Comment.find({post: postId}, 'user')
      return comments
    } catch (error) {
      return { error: error }
    }
  },

  async getCommentOwner(commentId) {
    try {
      let user = await Comment.findById(commentId, '-_id user')
      return user
    } catch (error) {
      return {error: error}
    }
  },

  async commentPost(postId, userId, text) {
    try {
      let date = Date.now()

      let data = {
        post: postId,
        user: userId,
        text: text,
        date: date
      };

      await Comment.create(data)
      let comment = await Comment.findOne(data)
      .populate([
        { path: "user", model: "User", select: "_id name avatar" },
        {
          path: "replies",
          model: "Comment",
          populate: {
            path: "user",
            model: "User",
            select: "_id name avatar",
          },
        },
      ]) 

      let post = await Post.findOne({
        _id: postId,
        writer: { $exists: true },
      });

      if (post && String(userId) != String(post.writer)) {
        let notificationData = {
          user: post.writer,
          comment: comment._id,
          commenter: userId,
          post: postId,
          date: comment.date,
        }
        await Notification.create(notificationData);
      }

      return {
        comments: [comment]
      }
    } catch (error) {
      return { error: error };
    }
  },

  async replyComment(postId, userId, commentId, text) {
    try {
      let date = Date.now()

      let data = {
        post: postId,
        user: userId,
        text: text,
        date: date,
        isReply: true
      };

      let comment = await Comment.findById(commentId)

      if(comment) {
        await Comment.create(data);
        let reply = await Comment.findOne(data)

        await Comment.updateOne(
          { _id: commentId },
          {
            $push: {
              replies: reply._id,
            },
          }
        );

        let post = await Post.findOne({
          _id: postId,
          writer: { $exists: true },
        });

        let notificationData = {
          comment: commentId,
          post: postId,
          date: reply.date,
        };

        if (String(comment.user) != String(userId)) {
          notificationData.user = comment.user;
          notificationData.replier = userId;

          await Notification.create(notificationData);
        }

        if (post && String(userId) != String(post.writer)) {
          notificationData.user = post.writer;
          notificationData.commenter = req.user.id;

          await Notification.create(notificationData);
        }

      } else {
        return { error: 'No comment found' }
      }
    } catch (error) {
      return { error: error }
    }
  },

  async deleteComment(req, res, next) {
    try {
      let commentId = req.params.commentId;
      let comment = await Comment.findById(commentId);
      if (comment) {
        if (String(comment.user) == String(req.user.id)) {
          let replies = comment.replies;
          replies.push(commentId);

          await Comment.findByIdAndDelete(commentId);
          await Comment.updateMany(
            { replies: { $in: commentId } },
            {
              $pull: {
                replies: commentId,
              },
            }
          );

          await Post.updateOne(
            { _id: comment.post },
            {
              $pull: {
                comments: commentId,
              },
            }
          );

          removeNoti(replies);

          res.json({ message: "Delete comment successful" });
        } else {
          throw new Error("Unauthorized");
        }
      } else {
        throw new Error("No comment found");
      }
    } catch (error) {
      next(error);
    }
  },

  async deleteAllComments(req, res, next) {
    try {
      let cmts = await Comment.deleteMany();
      res.json(cmts);
    } catch (error) {
      next(error);
    }
  },

  async getAllComments(req, res, next) {
    try {
      let cmts = await Comment.find();
      res.json(cmts);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = handlers;
