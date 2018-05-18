const express = require('express')
const router = express.Router()

const UserModel = require('../modules/users')
const {checkNotLogin} = require('../middlewares/auth')

const fs = require('fs')
const path = require('path')
const sha1 = require('sha1')


// GET /signup 注册页
router.get('/', checkNotLogin, function (req, res, next) {
  res.render('signup')
})

// POST /signup 用户注册
router.post('/', checkNotLogin, function (req, res, next) {
  let {name, gender, bio, password, repassword, } = req.fields
  let avatar = req.files.avatar.path.split(path.sep).pop()   // path.sep 平台的文件路径分隔符，'\\' 或 '/'
  // 校验参数
  try {
    if (!(name.length >= 1 && name.length <= 10)) {
      throw new Error('名字请限制在 1-10 个字符')
    }
    if (['x', 'm', 'f'].indexOf(gender) === -1) {
      throw new Error('性别只能是 m、f 或 x')
    }
    if (!(bio.length >= 1 && bio.length <= 30)) {
      throw new Error('个人简介请限制在 1-30 个字符')
    }
    if (!req.files.avatar.name) {
      throw new Error('缺少头像')
    }
    if (password.length < 6) {
      throw new Error('密码至少 6 个字符')
    }
    if (password !== repassword) {
      throw new Error('两次密码不一致')
    }
  } catch (e) {
    // 注册失败，异步删除上传的头像  fs.unlink(path, callback)
    fs.unlink(req.files.avatar.path, e => {})
    req.flash('error', e.message)
    return res.redirect('/signup')
  }

  // 明文密码加密
  password = sha1(password)

  // 待写入数据库用户信息
  let user = {
    name, password, gender, bio, avatar,
  }
  // 用户信息写入数据库
  UserModel.create(user)
    .then(result => {
      // 此 user 是插入 mongodb 后的值，包含 _id
      user = result.ops[0]
      // 删除密码这种敏感信息，将用户信息存入 session
      delete user.password
      req.session.user = user
      // 写入flash
      req.flash('success', '注册成功')
      // 跳转到首页
      res.redirect('/posts')
    })
    .catch(e => {
      // 注册失败，异步删除上传的头像
      fs.unlink(req.files.avatar.path, e => {})
      // 用户名被占用则跳回注册页，而不是错误页
      if (e.message.match('duplicate key')) {
        req.flash('error', '用户名被占用')
        return res.redirect('/signup')
      }
      next(e)
    })
})

module.exports = router