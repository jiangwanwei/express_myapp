const router = require('express').Router()
const {checkLogin} = require('../middlewares/auth')

const CommentModel = require('../modules/comments')

// POST /comments 创建一条留言
router.post('/', checkLogin, (req, res, next) => {
    const {
        content,
        postId,
    } = req.fields

    try {
        if (!content.length) {
            throw new Error('请输入留言内容')
        }
    } catch (error) {
        req.flash('error', error.message)
        return res.redirect('back')
    }

    const data = {
        content,
        postId,
        author: req.session.user._id
    }
    CommentModel.create(data)
        .then(result => {
            req.flash('success', '留言成功')
            return res.redirect('back')
        })
        .catch(next)
})
// GET /comments/:commentId/remove 删除一条留言
router.get('/:commentId/remove', checkLogin, (req, res, next) => {
    const {commentId} = req.params
    const author = req.session.user._id
    CommentModel.getCommentById(commentId)
        .then(comment => {
            if (!comment) {
                throw new Error('留言不存在')
            }
            if (author !== comment.author.toString()) {
                throw new Error('没有权限删除留言')
            }

            CommentModel.delCommentById(commentId)
                .then(result => {
                    req.flash('success', '删除成功')
                    res.redirect('back')
                })
                .catch(next)
        })
})

module.exports = router