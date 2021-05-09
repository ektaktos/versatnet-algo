const path = require('path');
const fs = require('fs');
const config = require('./config');

exports.readFiles = async (req, res) => {
  const wireguardPath = `algo/configs/${config.ip_address}/wireguard`;
  const directoryPath = path.join(__dirname, wireguardPath);
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      return console.log('Unable to scan directory: ' + err);
    }

    files.forEach( (file) => {
      console.log(file);
    });
  });
};