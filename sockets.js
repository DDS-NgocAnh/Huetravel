const socketIo = require("socket.io")
const authHandler = require('./modules/auth')
const postHandler = require('./modules/post')
const commentHandler = require('./modules/comment')
const notificationHandler = require('./modules/notification')

const { setReactTotalAtPost, setReactTotalAtUser, cleanArray } = require('./modules/utils')

module.exports.listen = function(server){
    const io = socketIo.listen(server)

    io.on('connection', (socket) => {
        socket.on('getCurrentAvatar', async (userId) => {
          let { avatar, error } = await authHandler.getAvatar(userId)
          socket.emit('returnCurrentAvatar', { avatar, error })
        })

        socket.on('getUserProfile', async (userId) => {
          let userData = await authHandler.getProfile(userId)
          socket.emit(`returnUserProfileOf${userId}`, userData)
        })

        socket.on('getPost', async (postId) => {
          let postData = await postHandler.getPost(postId)
          socket.emit(`returnPostOf${postId}`, postData)
        })

        socket.on('getComments', async (data) => {
          let comments = await commentHandler.getComments(data.postId, data.sortBy, data.pageSize, data.hasChange)
          socket.emit(`returnCommentsOf${data.postId}`, comments)
        })

        socket.on('commentPost', async (data) => {
          let comment = await commentHandler.commentPost(data.postId, data.userId, data.text)
          let postWriter = await postHandler.getPostWriter(data.postId)

          if(postWriter) {
            let notifications = await notificationHandler.getNotification(postWriter)
            socket.broadcast.emit(`returnUnSeenNotisOf${postWriter}`, notifications)
            socket.broadcast.emit(`returnNotificationsOf${postWriter}`, notifications)
          }

          socket.emit(`returnCommentsOf${data.postId}`, comment)
          socket.broadcast.emit(`returnCommentsOf${data.postId}`, comment)
        })

        socket.on('replyComment', async (data) => {
          await commentHandler.replyComment(data.postId, data.userId, data.commentId, data.text)
          let postWriter = await postHandler.getPostWriter(data.postId)
          let commentOwner = await commentHandler.getCommentOwner(data.commentId)

          if(postWriter) {
            let notifications = await notificationHandler.getNotification(postWriter)
            socket.broadcast.emit(`returnUnSeenNotisOf${postWriter}`, notifications)
            socket.broadcast.emit(`returnNotificationsOf${postWriter}`, notifications)
          }

          if(commentOwner.user != data.userId) {
            let notifications = await notificationHandler.getNotification(commentOwner.user)
            socket.broadcast.emit(`returnUnSeenNotisOf${commentOwner.user}`, notifications)
            socket.broadcast.emit(`returnNotificationsOf${commentOwner.user}`, notifications)
          }

          socket.emit(`hasChange${data.postId}`)
          socket.broadcast.emit(`hasChange${data.postId}`)
        })

        socket.on('getNotifications', async data => {
          let notifications = await notificationHandler.getNotification(data.userId, data.pageSize, data.hasChange)
          socket.emit(`returnNotificationsOf${data.userId}`, notifications)
        })

        socket.on('getUnSeenNotis', async userId => {
          let notifications = await notificationHandler.getNotification(userId)
          socket.emit(`returnUnSeenNotisOf${userId}`, notifications)

        })

        socket.on('seenAllNotis', async userId => {
          await notificationHandler.seenAllNotifications(userId)
          let notifications = await notificationHandler.getNotification(userId)
          socket.emit(`returnUnSeenNotisOf${userId}`, notifications)
        })

        socket.on('readNoti', async data => {
          await notificationHandler.readNotification(data.notiId)
          let notifications = await notificationHandler.getNotification(data.userId)
          socket.emit(`returnNotificationsOf${data.userId}`, notifications)
        })
        
        socket.on('changeName', async (userId) => {
          let userData = await authHandler.getProfile(userId)
          socket.broadcast.emit(`returnUserProfileOf${userId}`, userData)
          socket.emit(`returnUserProfileOf${userId}`, userData)
          let posts = await postHandler.findUserInComments(userId)
          let notiOwners = await notificationHandler.findNotiOwnersByUserId(userId)
          owners = cleanArray(notiOwners, 'user')

          if(owners && owners.length) {
            owners.forEach(async owner => {
              socket.broadcast.emit(`hasChange${owner}`)
            })
          }

          if(posts || posts.length) {
            posts.forEach(async post => {
              socket.broadcast.emit(`hasChange${post.post}`)
            })
          }
        })

        socket.on('reactPost', async data => {
          let postMessage = await postHandler.reactPost(data.userId, data.postId, data.reactIcon)
          await setReactTotalAtPost(data.postId);

          let postData = await postHandler.getPost(data.postId)
          postData = postData.toObject()
          postData.successMessage = postMessage.successMessage

          socket.broadcast.emit(`returnPostOf${data.postId}`, postData)
          socket.emit(`returnPostOf${data.postId}`, postData)
          
          if(postData.writer) {
            let writerId = postData.writer._id
            await setReactTotalAtUser(writerId);
            let userData = await authHandler.getProfile(writerId)
            let notifications = await notificationHandler.getNotification(writerId)
            socket.broadcast.emit(`returnUserProfileOf${writerId}`, userData)
            socket.emit(`returnUserProfileOf${writerId}`, userData)
            socket.broadcast.emit(`returnUnSeenNotisOf${writerId}`, notifications)
            socket.broadcast.emit(`returnNotificationsOf${writerId}`, notifications)
          }
        })

        socket.on('changeAvatar', async (userId) => {
          let userData = await authHandler.getProfile(userId)
          socket.broadcast.emit(`returnUserProfileOf${userId}`, userData)
          if(userId == userData._id) {
            socket.emit('returnCurrentAvatar', { avatar: userData.avatar, error: userData.error })
          }
          let posts = await postHandler.findUserInComments(userId)
          let notiOwners = await notificationHandler.findNotiOwnersByUserId(userId)
          owners = cleanArray(notiOwners, 'user')

          if(owners && owners.length) {
            owners.forEach(async owner => {
              socket.broadcast.emit(`hasChange${owner}`)
            })
          }

          if(posts || posts.length) {
            posts.forEach(async post => {
              socket.broadcast.emit(`hasChange${post.post}`)
            })
          }
        })

        socket.on('createReview', async (userId) => {
          let userData = await authHandler.getProfile(userId)
          socket.broadcast.emit(`returnUserProfileOf${userId}`, userData)
          socket.broadcast.emit('hasChangePosts')
        })

        socket.on('notePost', async data => {
          let userData = await authHandler.getProfile(data.userId)
          socket.broadcast.emit(`returnUserProfileOf${data.userId}`, userData)
          if(data.isUserProfile) {
            socket.emit(`returnUserProfileOf${data.userId}`, userData)
          }
        })

        socket.on('deletePost', async data => {
          socket.broadcast.emit(`returnPostOf${data.postId}`, '')
          
          let writerData = await authHandler.getProfile(data.userId)
          let notifications = await notificationHandler.getNotification(data.userId)
          socket.broadcast.emit(`returnUserProfileOf${data.userId}`, writerData)
          socket.emit(`returnUnSeenNotisOf${data.userId}`, notifications)
          socket.emit(`returnNotificationsOf${data.userId}`, notifications)
          socket.broadcast.emit('hasChangePosts')
        })

        socket.on('updatePost', async postId => {
          let postData = await postHandler.getPost(postId)
          socket.broadcast.emit(`returnPostOf${postId}`, postData)
          let notiOwners = await notificationHandler.findNotiOwnersByPostId(postId)
          owners = cleanArray(notiOwners, 'user')

          if(owners && owners.length) {
            owners.forEach(async owner => {
              socket.broadcast.emit(`hasChange${owner}`)
            })
          }
        })
      });

    return io
}