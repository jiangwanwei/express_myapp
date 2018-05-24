const {Strategy} = require('passport-http-bearer')   // token验证模块

const apiUserModel = require('../modules/api')

module.exports = passport => {
    passport.use(new Strategy((token, done) => {
        apiUserModel.findBuyToken(token)
            .then(result => {
                if (!result) return done(null, false)
                return done(null, result)
            })
    }))
}