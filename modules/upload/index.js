const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const handlers = {
  async uploadCKFinder(req, res, next) {
    try {
      const file = req.files.upload;

      const filename = file.name.replace(/\..+$/, "");
      const newFilename = `huetravel-${filename}-${Date.now()}.jpeg`;
      const targetPathUrl = `${__dirname}../../../client/public/uploads/${newFilename}`
      await sharp(file.data).resize(640, null).toFormat("jpeg").jpeg({ quality: 90 })
      .toFile(
        targetPathUrl,
        function (err) {
          if (err) {
            next(err)
          }
          res.json({
            uploaded: true,
            url: `../../../public/uploads/${newFilename}`,
          });
        }
      );
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
      const filename = file.name.replace(/\..+$/, "");
      const newFilename = `huetravel-${filename}-${Date.now()}.jpeg`;
      const targetPathUrl = `${__dirname}../../../client/public/uploads/${newFilename}`
      await sharp(file.data).resize(640, null).toFormat("jpeg").jpeg({ quality: 90 })
      .toFile(
        targetPathUrl,
        function (err) {
          if (err) {
            next(err)
          }
          res.json({
            filePath: `../../../public/uploads/${newFilename}`,
          });
        }
      );
     
    } catch (error) {
      next(error);
    }
  },
};

module.exports = handlers;
