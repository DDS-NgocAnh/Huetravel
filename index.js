require("./connect-mongo");

const express = require("express");
const bodyParser = require("body-parser");
const http = require("http");
const path = require("path");
const passport = require("passport");

const fileUpload = require("express-fileupload");

const morgan = require("morgan");

const cors = require("./cors");

//Import Routes
const userRoutes = require("./routes/auth");
const uploadRoutes = require("./routes/upload");
const postRoutes = require("./routes/post");

const PORT = process.env.PORT || 9000;

const app = express();

const server = http.createServer(app);
const io = require("./sockets").listen(server);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(fileUpload());
//Passport Middleware
app.use(passport.initialize());

//Passport Config
require("./config-passport")(passport);

//Import cors
app.use(cors);

//Routes Middleware
app.use("/api/user", userRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/post", postRoutes);

app.use('/public', express.static('client/public'))
app.use(express.static('client/dist'));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/dist/index.html'));
});

app.use((err, req, res, next) => {
  res.status(500).json({
    message: err.message,
    stack: err.stack,
  });
});

server.listen(PORT, (err) => {
  console.log(err || `Server opend at port '${PORT}'`);
});
