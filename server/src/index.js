require('./connect-mongo')

const express = require('express')
const bodyParser = require('body-parser')
const http = require("http")
const socketIo = require("socket.io")

const passport = require('passport')

const fileUpload = require('express-fileupload')

const morgan = require('morgan')

const cors = require('./cors')

//Import Routes
const userRoutes = require('./routes/auth')
const uploadRoutes = require('./routes/upload')
const postRoutes = require('./routes/post')
const commentRoutes = require('./routes/comment')
const notificationRoutes = require('./routes/notification')


const PORT = process.env.PORT || 9000;

const app = express();

const server = http.createServer(app);
const io = socketIo(server)

io.on('connection', (socket) => {
  console.log('We have a new connection!!!')

  socket.on('disconnect', () => {
    console.log('User has left!!!');
  })
});

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.use(fileUpload())
//Passport Middleware
app.use(passport.initialize())

//Passport Config
require('./config-passport')(passport)

//Import cors
app.use(cors)

//Routes Middleware
app.use('/api/user', userRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/post', postRoutes)
app.use('/api/comment', commentRoutes)
app.use('/api/notification', notificationRoutes)

app.use((err, req, res, next) => {
    res.status(500)
      .json({
        message: err.message,
        stack: err.stack
      })
})
    
server.listen(PORT, (err) => {
    console.log(err || `Server opend at port '${PORT}'`);
});
