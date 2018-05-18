const router = require('express').Router()
const sha1 = require('sha1')

const {checkNotLogin} = require('../middlewares/auth')
const UserModel = require('../modules/users')

// GET /signin 登录页
router.get('/', checkNotLogin, function (req, res, next) {
    res.render('signin')
})
  
  // POST /signin 用户登录
router.post('/', checkNotLogin, function (req, res, next) {
    const {name, password} = req.fields

    // 校验参数
    try {
      if (!name.length) {
        throw new Error('请填写用户名')
      }
      if (!password.length) {
        throw new Error('请输入密码')
      }
    } catch (e) {
      req.flash('error', e.message)
      return res.redirect('back')
    }
    UserModel.getUserByName(name)
      .then( user => {
        if (!user) {
          req.flash('error', '用户不存在')
          return res.redirect('back')
        }
        // 匹配密码
        if (sha1(password) !== user.password) {
          req.flash('error', '密码有误')
          return res.redirect('back')
        }
        
        req.flash('success', '登录成功')
        // 用户信息写入session
        delete user.password
        req.session.user = user
        // 跳转主页
        res.redirect('/posts')
      })
      .catch(next)
})
  
module.exports = router