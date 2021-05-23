const express = require('express');
const fs = require('fs');
const path = require('path');
var cloudinary = require('cloudinary').v2;
const config = require('./config');
const cors = require('cors');
const multer = require('multer');
const db = require('./models/index');
const routes = require('./route');
const upload = multer({ dest: 'uploads/' });

const Images = db.images;

cloudinary.config({
  cloud_name: config.cloudName,
  api_key: config.apiKey,
  api_secret: config.apiSecret
});

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(upload.any());
app.use(routes);

app.get('/hello', (req, res) => {
  res.status(200).json({ message: 'My name is nodejs app with digital ocean' });
})

app.get('/hi', (req, res) => {
  console.log('hi there');
  res.status(200).json({ message: 'Hola world' });
})

app.get('/', (req, res) => {
  console.log('hello');
  Images.destroy({
    where: {},
    truncate: true
  });
  console.log('step 2');
  const wireguardPath = `./../algo/configs/${config.ip_address}/wireguard`;
  const directoryPath = path.join(__dirname, wireguardPath);
  console.log(directoryPath);
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
})

app.use(express.static(path.join(__dirname,'public')));

// Wildcard to match unfound route
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route does not exist' });
});

db.sequelize.sync({}).then(() => {
  console.log('Successfully Connected');
}).catch((err) => {
  console.log(err);
});

app.set('port', config.port || 3000);
app.listen(config.port, () => {
  console.log(`Listening on ${config.port}`);
});

module.exports = app;