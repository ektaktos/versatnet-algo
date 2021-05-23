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

exports.getImages = async (req, res) => {
  const images = await Images.findAll();
  return res.status(200).json({ message: 'Success', images });
};

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
        const filepath = path.resolve(file);
        filePaths.push(filepath);
        if (path.extname(file) === '.png') {
          const basename = path.basename(file);
          const newPath = path.join(__dirname, "public/images", basename);
          // fs.copyFile(filepath, newPath, (err) => {
          //   if(err) {
          //     return res.status(400).json({ message: 'Error', err });
          //   } else {
          //     const imageUrl = `http://vpn.devdigit.com/images/${basename}`;
          //     await Images.create({ image_url: imageUrl }); 
          //   }
          // });
          // const result = await cloudinary.uploader.upload(fullPath);
        }
      }
      return res.status(200).json({ message: 'Success', files, fileArray, filePaths });
    });
  } catch (error) {
    return res.status(400).json({ message: 'Error', error });
  }
};