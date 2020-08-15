const crypto = require('crypto')
const dotenv = require('dotenv')
const jwt = require('jsonwebtoken')
const generator = require('generate-password')

const User = require('./auth/User')
const Post = require('./post/Post')
const Notification = require('./notification/Notification')
dotenv.config()

function hashMd5(str) {
    return crypto.createHash('md5').update(str).digest('hex')
}

function signToken(payload) {
    return jwt.sign(payload, 
      process.env.JWT_SECRET, 
      { expiresIn: 86400 })
  }

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function getRandomPassword() {
  let randomPassword= generator.generate({
      length: 10,
      numbers: true
  })
  return randomPassword
}

async function setReactTotalAtPost(postId) {
  let post =  await Post.findById(postId)
  let postData = post.toObject()
  postData.flowersTotal = postData.flowers.length
  postData.rocksTotal = postData.rocks.length
  await Post.findByIdAndUpdate(
      postId,
      postData,
      {new: true}
  )

}

async function setReactTotalAtUser(userId) {
  let user = await User.findById(userId)
  .populate({ path: 'reviews', 
  model: 'Post', 
  select: 'flowersTotal rocksTotal'})

  let userData = user.toObject()

  let flowersTotal = 0, rocksTotal = 0

  userData.reviews.forEach(item => {
    flowersTotal += item.flowersTotal,
    rocksTotal += item.rocksTotal
  })

  userData.flowersTotal = flowersTotal
  userData.rocksTotal = rocksTotal

  await User.findByIdAndUpdate(
    userId,
    userData,
    {new: true}
  )
}

async function decreaseReactTotal(userId, flowers, rocks) {
  try {
    await User.updateOne({ _id: userId },
      {
        "$inc": {
          "flowersTotal": -Math.abs(flowers),
          "rocksTotal": -Math.abs(rocks)
      }
      }) 
  } catch (error) {
    next(error)
  }
}

async function removeNoti(commentList) {
  await Notification.find({ comment: {$in: commentList} })
  .exec(async function(err, notis) {
      if(err) {
          next(err)
      } else {
          if(notis) {
              notis.forEach(async noti => {
                  await User.updateMany({ notifications: {$in: noti._id}},
                  {$pull: {
                      notifications: noti._id
                  }})

                  await Notification.findByIdAndDelete(noti._id)
              })
          } 
      }
  })
}

module.exports = {
    hashMd5,
    signToken,
    uuidv4,
    getRandomPassword,
    setReactTotalAtPost,
    setReactTotalAtUser,
    decreaseReactTotal,
    removeNoti
}