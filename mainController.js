const path = require('path');
const fs = require('fs');
const config = require('./config');

exports.readFiles = async (req, res) => {
  const wireguardPath = `algo/configs/${config.ip_address}/wireguard`;
  const directoryPath = path.join(__dirname, wireguardPath);
  const fileArray = [];
  try {
    fs.readdir(directoryPath, (err, files) => {
      if (err) {
        return res.status(400).send({ message: 'Error', 'error': 'Unable to scan directory: ' + err });
      }
  
      files.forEach( (file) => {
        fileArray.push(file);
        console.log(file);
      });
      return res.status(200).send({ message: 'Succsess', 'data': fileArray });
    });
  } catch (error) {
    return res.status(400).send({ message: 'Error', error });
  }
};