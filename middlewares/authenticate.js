const passport = require('passport')
module.exports = passport.authenticate('bearer', {
    session: false,
    // successRedirect: '/',                              // 验证成功重定向
    failureRedirect: '/api/401',                       // 验证失败重定向
    // failureFlash: true   // 重定向经常会配合着刷新,向客户端发送status 信息. 这往往是最好的方法，因为验证回调可以精确测定验证失败的原因。
})