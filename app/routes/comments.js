const router = require('express').Router()
const {checkLogin} = require('../middlewares/auth')

// POST /comments 创建一条留言
router.post('/', checkLogin, (req, res) => {
    res.send('创建留言')
})
// GET /comments/:commentId/remove 删除一条留言
router.get('/:commentId/remove', checkLogin, (req, res) => {
    res.send('删除留言');
})

module.exports = router