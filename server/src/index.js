require('./connect-mongo')

const express = require('express')
const bodyParser = require('body-parser')

const passport = require('passport')

const multipart = require('connect-multiparty')
const MultipartMiddleware = multipart({ uploadDir: '../images' })
const morgan = require('morgan')

const cors = require('./cors')

//Import Routes
const userRoutes = require('./routes/auth')
const postRoutes = require('./routes/post')
const commentRoutes = require('./routes/comment')
const notificationRoutes = require('./routes/notification')


const PORT = process.env.PORT || 9000;

const app = express();

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

//Passport Middleware
app.use(passport.initialize())

//Passport Config
require('./config-passport')(passport)

//Import cors
app.use(cors)

//Routes Middleware
app.use('/api/user', userRoutes)
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
  
app.post('/uploads', MultipartMiddleware, (req, res) => {
    console.log(req.files.upload);
    // console.log(res);
})
    
app.listen(PORT, (err) => {
    console.log(err || `Server opend at port '${PORT}'`)
})
