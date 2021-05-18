const express = require('express');

const router = express.Router();
const Controller = require('./mainController');

router.get('/configs', Controller.readFiles);

module.exports = router;