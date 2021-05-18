const path = require('path');
const fs = require('fs');
var cloudinary = require('cloudinary').v2;
const config = require('./config');
const models = require('./models/index');

const Images = models.images;

cloudinary.config({
  cloud_name: config.cloudName,
  api_key: config.apiKey,
  api_secret: config.apiSecret
});

exports.readFiles = async (req, res) => {
  Images.destroy({
    where: {},
    truncate: true
  });
  const fileArray = [];
  const filePaths = [];
  const wireguardPath = `./../algo/configs/${config.ip_address}/wireguard`;
  const directoryPath = path.join(__dirname, wireguardPath);
  try {
    fs.readdir(directoryPath, async (err, files) => {
      if (err) {
        return res.status(400).json({ message: 'Error', path: wireguardPath, error: 'Unable to scan directory: ' + err });
      }
      for (const file of files) {
        filePaths.push(path.extname(file));
        if (path.extname(file) === 'png') {
          const fullPath = `${directoryPath}/${file}`;
          fileArray.push(fullPath);
          const result = await cloudinary.uploader.upload(fullPath);
          await Images.create({ image_url: result.secure_url }); 
        }
      }
      return res.status(200).json({ message: 'Success', files, fileArray });
    });
  } catch (error) {
    return res.status(400).json({ message: 'Error', error });
  }
};