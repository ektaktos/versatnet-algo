const path = require('path');
const fs = require('fs');
const imageToBase64 = require('image-to-base64');
var cloudinary = require('cloudinary').v2;
const config = require('./config');
const models = require('./models/index');

const Image = models.images;

cloudinary.config({
  cloud_name: config.cloudName,
  api_key: config.apiKey,
  api_secret: config.apiSecret
});

exports.readFiles = async (req, res) => {
  const wireguardPath = `./../algo/configs/${config.ip_address}/wireguard`;
  const directoryPath = path.join(__dirname, wireguardPath);
  const fileArray = [];
  const errors = [];
  try {
    fs.readdir(directoryPath, async (err, files) => {
      if (err) {
        return res.status(400).send({ message: 'Error', path: wireguardPath, error: 'Unable to scan directory: ' + err });
      }
      // for (const file of files) {
      //   const upload = await cloudinary.uploader.upload(file.path);
      //   await Image.create({ image_url: result.secure_url });
      //   console.log(upload);
      //   fileArray.push(upload);
      // }
      return res.status(200).send({ message: 'Success', files });
    });
  } catch (error) {
    return res.status(400).send({ message: 'Error', error });
  }
};