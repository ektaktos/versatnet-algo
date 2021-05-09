const express = require('express');
const cors = require('cors');
const config = require('./config');
const routes = require('./route');


const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Hello World' });
})

// Wildcard to match unfound route
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route does not exist' });
});

app.set('port', config.port || 3000);
app.listen(config.port, () => {
  console.log(`Listening on ${config.port}`);
});

module.exports = app;