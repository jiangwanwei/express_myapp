const router = require('express').Router()
const {checkNotLogin} = require('../middlewares/auth')

// GET /signin 登录页
router.get('/', checkNotLogin, function (req, res, next) {
    res.send('登录页')
  })
  
  // POST /signin 用户登录
  router.post('/', checkNotLogin, function (req, res, next) {
    res.send('登录')
  })
  
module.exports = router