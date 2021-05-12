const express = require('express');
const fs = require('fs');
const cors = require('cors');
const multer = require('multer');
const db = require('./models/index');
const config = require('./config');
const routes = require('./route');
const upload = multer({ dest: 'uploads/' });


const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(upload.any());
app.use(routes);

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Hello World' });
})

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