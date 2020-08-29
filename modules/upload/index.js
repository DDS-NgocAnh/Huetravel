const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const imgur = require("imgur");
const dotenv = require("dotenv");

dotenv.config();

imgur.setClientId(process.env.IMGUR_CLIENT_ID);
imgur.setAPIUrl("https://api.imgur.com/3/");

const handlers = {
  async uploadCKFinder(req, res, next) {
    try {
      const file = req.files.upload;
      const targetPathUrl = `${__dirname}/uploads/${file.name}`;

      await sharp(file.data)
        .resize(640, null)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(targetPathUrl)

    //   file.mv(`${__dirname}/uploads/${file.name}`);

      imgur
        .uploadFile(targetPathUrl)
        .then(function (json) {
          res.json({
            uploaded: true,
            url: json.data.link,
          });
        })
        .catch((err) => {
          next(err);
        });

      //   const filename = file.name.replace(/\..+$/, "");
      //   const newFilename = `huetravel-${filename}-${Date.now()}.jpeg`;
      //   const targetPathUrl = `${__dirname}../../../client/public/uploads/${newFilename}`;
      //   await sharp(file.data)
      //     .resize(640, null)
      //     .toFormat("jpeg")
      //     .jpeg({ quality: 90 })
      //     .toFile(targetPathUrl, function (err) {
      //       if (err) {
      //         next(err);
      //       }
      //       res.json({
      //         uploaded: true,
      //         url: `../../../public/uploads/${newFilename}`,
      //       });
      //     });
    } catch (error) {
      next(error);
    }
  },

  async uploadPhoto(req, res, next) {
    try {
      if (req.files === null) {
        res.json({ message: "No file upload" });
      }

      const file = req.files.file;
      const targetPathUrl = `${__dirname}/uploads/${file.name}`;

      await sharp(file.data)
        .resize(640, null)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(targetPathUrl)

      imgur
        .uploadFile(targetPathUrl)
        .then(function (json) {
          res.json({
            filePath: json.data.link,
          });
        })
        .catch((err) => {
          next(err);
        });
      //   const filename = file.name.replace(/\..+$/, "");
      //   const newFilename = `huetravel-${filename}-${Date.now()}.jpeg`;
      //   const targetPathUrl = `${__dirname}../../../client/public/uploads/${newFilename}`;
      //   await sharp(file.data)
      //     .resize(640, null)
      //     .toFormat("jpeg")
      //     .jpeg({ quality: 90 })
      //     .toFile(targetPathUrl, function (err) {
      //       if (err) {
      //         next(err);
      //       }
      //       res.json({
      //         filePath: `../../../public/uploads/${newFilename}`,
      //       });
      //     });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = handlers;
