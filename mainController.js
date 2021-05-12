const path = require('path');
const fs = require('fs');
var cloudinary = require('cloudinary').v2;
const config = require('./config');
const models = require('./models/index');

const Image = models.images;

cloudinary.config({
  cloud_name: "dunksyqjj",
  api_key: "173989938887513",
  api_secret: "ZPLqvCzRu55MaM1rt-wxJCmkxqU"
});

exports.readFiles = async (req, res) => {
  const wireguardPath = `./../algo/configs/${config.ip_address}/wireguard`;
  const directoryPath = path.join(__dirname, wireguardPath);
  const fileArray = [];
  try {
    fs.readdir(directoryPath, (err, files) => {
      if (err) {
        return res.status(400).send({ message: 'Error', path: wireguardPath, error: 'Unable to scan directory: ' + err });
      }

      files.forEach( async (file) => {
        cloudinary.uploader.upload(file).then(async (result) => {
          await Image.create(image_url = result.secure_url);
        }).catch((err) => {
          console.log(err);
        })
        fileArray.push(file);
        console.log(file);
      });
      return res.status(200).send({ message: 'Succsess', 'data': fileArray });
    });
  } catch (error) {
    return res.status(400).send({ message: 'Error', error });
  }
};