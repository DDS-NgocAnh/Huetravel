const socketIo = require("socket.io")
const authHandler = require('./modules/auth')
const postHandler = require('./modules/post')
const commentHandler = require('./modules/comment')
const notificationHandler = require('./modules/notification')

module.exports.listen = function(server){
    const io = socketIo.listen(server)

    io.on('connection', (socket) => {
        socket.on('getCurrentAvatar', async (userId) => {
          let { avatar, error } = await authHandler.getAvatar(userId)
          socket.emit('returnCurrentAvatar', { avatar, error })
        })
        
        socket.on('changeName', async (userId) => {
          let { name, error } = await authHandler.getName(userId)
          socket.broadcast.emit('getName', { name, error })
        })

        socket.on('changeAvatar', async (userId) => {
          let { avatar, error } = await authHandler.getAvatar(userId)
          socket.emit('returnCurrentAvatar', { avatar, error })
          socket.broadcast.emit('getAvatar', { avatar, error })
        })

        socket.on('createReview', async (userId) => {
          let { reviews, error } = await authHandler.getReviews(userId)
          socket.broadcast.emit('getReviews', { reviews, error })
        })

        socket.on('notePost', async data => {
          let { notes, error } = await authHandler.getNotes(data.userId)
          socket.broadcast.emit('getNotes', { notes, error })
          if(data.isUserProfile) {
            socket.emit('getNotes', { notes, error })
          }
        })

        socket.on('deletePost', async (userId) => {
          let { reviews, error } = await authHandler.getReviews(userId)
          socket.broadcast.emit('getReviews', { reviews, error })
        })
      
        socket.on('disconnect', () => {
          console.log('User has left!');
        })
      });

    return io
}