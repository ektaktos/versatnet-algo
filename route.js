const express = require('express');

const router = express.Router();
const Controller = require('./mainController');

router.post('/users/configs', Controller.readFiles);

module.exports = router;