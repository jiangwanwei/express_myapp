const router = require('express').Router()

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const apiUserModel = require('../modules/api')
const config = require('../config/index')

const passport = require('passport')
require('./passport')(passport)

router.get('/', (req, res) => {
    res.json({
        message: 'hello api.'
    })
    // apiUserModel.create({
    //     username: 'jww',
    //     password: '123',
    //     token: 'bear sd'
    // }).then(result => {
    //     res.send({
    //         code: 0,
    //         msg: result
    //     })
    // })    
})
router.post('/signup', (req, res) => {
    let {username, password,} = req.fields
    if (!username || !password) {
        return res.json({
            success: false,
            message: '请输入用户名密码.'
        })
    }
    apiUserModel.create({username, password})
        .then(result => {
            res.json({
                success: true,
                message: '创建用户成功.'
            })
        })
})
router.post('/signin', (req, res) => {
    let {username, password,} = req.fields
    if (!username || !password) {
        return res.json({
            success: false,
            message: '请输入用户名密码.'
        })
    }
    apiUserModel.getUserBuyUserName(username)
        .then(result => {
            if (!result) return res.json({success: false, message: '用户不存在'})
            // 对比密码
            bcrypt.compare(password, result.password, (err, isMatch) => {
                if (err) throw new Error(err)
                let token = jwt.sign({username}, config.secret, {
                    expiresIn: 10080
                })
                apiUserModel.update(result._id, {token})
                    .then(result => {
                        res.json({
                            success: true,
                            message: '验证成功.',
                            token: 'Bearer ' + token,
                            username,
                        });
                    })
            })
        })

})
// passport-http-bearer token 中间件验证
// 通过 header 发送 Authorization -> Bearer  + token
// 或者通过 ?access_token = token
router.get('/user', 
    passport.authenticate('bearer', {session: false}),
    (req, res) => {
        let {user} = req
        delete user.password
        delete user.token
        res.json({
            success: true,
            user
        })
    }
)

module.exports = router