var express = require('express');
var router = express.Router();
var common = require('../controller/common')

router.get('/upload', common.upload)

module.exports = router