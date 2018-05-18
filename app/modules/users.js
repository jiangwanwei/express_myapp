const {User} = require('../lib/mongo')

module.exports = {
    // 注册一个用户
    create: user => User.create(user).exec(),

    // 通过用户名获取用户信息
    getUserByName: name => User.findOne({name}).addCreateAt().exec(),
}