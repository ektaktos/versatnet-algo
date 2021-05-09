const express = require('express');

const router = express.Router();
const Controller = require('./mainController');

router.get('users/configs', Controller.readFiles);