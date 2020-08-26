const mongoose = require('mongoose')
const dotenv = require("dotenv");
dotenv.config();

const connectionString = process.env.MONGO_URL

mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('Connect success to MongoDB')
  })
  .catch(err => {
    console.error('Connect failed to MongoDB')
    console.error(err)
  })
