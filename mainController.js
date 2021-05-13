const path = require('path');
const fs = require('fs');
const imageToBase64 = require('image-to-base64');
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
  const wireguardPath = `./../algo/configs/${config.ip_address}/wireguard`;
  const directoryPath = path.join(__dirname, wireguardPath);
  Images.destroy({
    where: {},
    truncate: true
  });
  try {
    fs.readdir(directoryPath, async (err, files) => {
      if (err) {
        return res.status(400).send({ message: 'Error', path: wireguardPath, error: 'Unable to scan directory: ' + err });
      }
      for (const file of files) {
        const fullPath = `${directoryPath}/${file}`;
        const result = await cloudinary.uploader.upload(fullPath);
        await Images.create({ image_url: result.secure_url });
      }
      return res.status(200).send({ message: 'Success'});
    });
  } catch (error) {
    return res.status(400).send({ message: 'Error', error });
  }
};