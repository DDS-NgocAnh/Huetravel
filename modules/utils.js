const crypto = require("crypto");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const generator = require("generate-password");

const User = require("./auth/User");
const Post = require("./post/Post");
const Notification = require("./notification/Notification");
dotenv.config();

function hashMd5(str) {
  return crypto.createHash("md5").update(str).digest("hex");
}

function signToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 86400 });
}

function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function getRandomPassword() {
  let randomPassword = generator.generate({
    length: 10,
    numbers: true,
  });
  return randomPassword;
}

async function setReactTotalAtPost(postId) {
  let post = await Post.findById(postId);
  let postData = post.toObject();
  postData.flowersTotal = postData.flowers.length;
  postData.rocksTotal = postData.rocks.length;

  await Post.findByIdAndUpdate(postId, postData, { new: true });
}

async function setReactTotalAtUser(userId) {
  let user = await User.findById(userId).populate({
    path: "reviews",
    model: "Post",
    select: "flowersTotal rocksTotal",
  });

  let userData = user.toObject();

  let flowersTotal = 0,
    rocksTotal = 0;

  userData.reviews.forEach((item) => {
    (flowersTotal += item.flowersTotal), (rocksTotal += item.rocksTotal);
  });

  userData.flowersTotal = flowersTotal;
  userData.rocksTotal = rocksTotal;

  await User.findByIdAndUpdate(userId, userData, { new: true });
}

async function decreaseReactTotal(userId, flowers, rocks) {
  try {
    await User.updateOne(
      { _id: userId },
      {
        $inc: {
          flowersTotal: -Math.abs(flowers),
          rocksTotal: -Math.abs(rocks),
        },
      }
    );
  } catch (error) {
    next(error);
  }
}

async function removeNoti(commentList) {
  await Notification.find({ comment: { $in: commentList } }).exec(
    async function (err, notis) {
      if (err) {
        next(err);
      } else {
        if (notis) {
          notis.forEach(async (noti) => {
            await Notification.findByIdAndDelete(noti._id);
          });
        }
      }
    }
  );
}

function removeFromArrayByValue(array, value) {
  let index = array.indexOf(value);
  array.splice(index, 1);
  return array;
}

function cleanArray(array, cleanField) {
  let newArray = [];
  if(array && array.length) {
    array.forEach(item => {
      if (!newArray.includes(item[cleanField])) {
        newArray.push(item[cleanField]);
      }
    });
  }

  return newArray
}

function changeAlias(alias) {
  let str = alias;
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a"); 
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e"); 
  str = str.replace(/ì|í|ị|ỉ|ĩ/g,"i"); 
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o"); 
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u"); 
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y"); 
  str = str.replace(/đ/g,"d");
  str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g," ");
  str = str.replace(/ + /g," ");
  str = str.trim(); 
  return str;
}

module.exports = {
  hashMd5,
  signToken,
  uuidv4,
  getRandomPassword,
  setReactTotalAtPost,
  setReactTotalAtUser,
  decreaseReactTotal,
  removeNoti,
  removeFromArrayByValue,
  cleanArray,
  changeAlias
};
