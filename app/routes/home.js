var user = require('../controller/home')
var express = require('express')
var router = express.Router()

router.use((req, res, next) => {
  console.log('post home middleware')
  next()
})

router.post('/login', user.login)

module.exports = router