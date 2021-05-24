const express = require('express');

const router = express.Router();
const Controller = require('./mainController');

router.get('/configs', Controller.readFiles);
router.get('/images', Controller.getImages);
router.get('/createUser', Controller.createUser);


module.exports = router;