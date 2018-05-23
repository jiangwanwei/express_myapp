const {ApiUser} = require('../lib/mongo')
const bcrypt = require('bcrypt') 
// 定义加密密码计算强度
const SALT_WORK_FACTOR = 10

module.exports = {
    // 创建用户
    create: user => {
        return new Promise((resolve, reject) => {
            bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
                if (err) throw new Error(err)
                bcrypt.hash(user.password, salt, (error, hash) => {
                    if (error) throw new Error(error)
                    user.password = hash
                    resolve(ApiUser.create(user).exec())
                })            
            })
        })            
    },
    // 通过用户名查找用户信息
    getUserBuyUserName: username => ApiUser.findOne({username}).addCreateAt().exec(),
    // 更新用户信息
    update: (userId, data) => ApiUser.update({ _id: userId}, { $set: data}).exec(),
    // 根据token查找用户
    findBuyToken: token => ApiUser.findOne({ token }).exec(),
}