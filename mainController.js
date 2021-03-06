const path = require('path');
const fs = require('fs');
const { exec } = require("child_process");
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

exports.createUser = async (req, res) => {
  const { name } = req.body;
  const filePath = `./../algo/config.cfg`;
  // const filePath = './../../movielist/images/config.cfg';
  const fileFullPath = path.join(__dirname, filePath);
  // Get length of current users
  const images = await Images.findAll();
  const imagesCount = images.length;
  try {
    const position = 8 + parseInt(imagesCount);
    const newText = `  - ${name}`;
    fs.readFile(fileFullPath, function read(err, data) {
      if (err) throw err;

      const array = data.toString().split("\n");
      array.splice(position, 0, newText);
      const file = fs.createWriteStream(fileFullPath);
      file.on('error', function(err) { /* error handling */ });
      array.forEach(function(v) { file.write(v + '\n'); });
      file.end();

      return res.status(200).json({ message: 'Success', array });
    })

    exec("./../algo update-users", (error, stdout, stderr) => {
      if (error) {
          console.log(`error: ${error.message}`);
          return;
      }
      if (stderr) {
          console.log(`stderr: ${stderr}`);
          return;
      }
      console.log(`stdout: ${stdout}`);
    });
  } catch (error) {
    return res.status(400).json({ message: 'Error', error });
  }
  
  // return res.status(200).json({ message: 'Success'});
};

exports.readFiles = async (req, res) => {
  Images.destroy({
    where: {},
    truncate: true,
    force: true
  });
  const fileArray = [];
  const filePaths = [];
  const newPaths = [];
  const wireguardPath = `./../algo/configs/${config.ip_address}/wireguard`;
  // const wireguardPath = './../../movielist/images';
  const directoryPath = path.join(__dirname, wireguardPath);
  try {
    fs.readdir(directoryPath, async (err, files) => {
      if (err) {
        return res.status(400).json({ message: 'Error', path: wireguardPath, error: 'Unable to scan directory: ' + err });
      }
      for (const file of files) {
        if (path.extname(file) === '.png') {
          const basename = path.basename(file);
          const filepath = `${directoryPath}/${basename}`;
          const newPath = path.join(__dirname, "/public/images", basename);
          filePaths.push(filepath);
          newPaths.push(newPath);
          fs.copyFile(filepath, newPath, async (err) => {
            if(err) {
              return res.status(400).json({ message: 'Error', err });
            } else {
              const imageUrl = `http://vpn.devdigit.com/images/${basename}`;
              const userName = basename.split('.').slice(0, -1).join('.');
              await Images.create({ image_url: imageUrl, name: userName }); 
            }
          });
          // const result = await cloudinary.uploader.upload(fullPath);
        }
      }
      return res.status(200).json({ message: 'Success', files, newPaths, fileArray, filePaths });
    });
  } catch (error) {
    return res.status(400).json({ message: 'Error', error });
  }
};