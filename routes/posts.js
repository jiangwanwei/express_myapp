const router = require('express').Router()
const {checkLogin} = require('../middlewares/auth')

const PostModel = require('../modules/posts')
const CommentModel = require('../modules/comments')

// GET /posts 所有用户或者特定用户的文章页
//   eg: GET /posts?author=xxx
router.get('/', function (req, res, next) {
    const {author} = req.query
    PostModel.getPosts(author)
        .then(result => {
            res.render('posts', {
                posts: result
            })
        })
        .catch(next)    
  })
  
  // POST /posts/create 发表一篇文章
  router.post('/create', checkLogin, function (req, res, next) {
    const {title, content,} = req.fields
    const author = req.session.user._id
    
    // 数据校验
    try {
        if (!title) {
            throw new Error('请输入标题')
        }
        if (!content) {
            throw new Error('请输入内容')
        }
    } catch (e) {
        req.flash('error', e.message)
        return res.redirect('back')
    }
    let post = {title, content, author}
    PostModel.create(post)
        .then(result => {
            post = result.ops[0]
            req.flash('success', '发表成功')
            res.redirect(`/posts/${post._id}`)
        })
        .catch(next)
  })
  
  // GET /posts/create 发表文章页
  router.get('/create', checkLogin, function (req, res, next) {
    res.render('create')
  })
  
  // GET /posts/:postId 单独一篇的文章页
  router.get('/:postId', function (req, res, next) {
    const {postId} = req.params
    Promise.all([
        PostModel.getPostById(postId),
        CommentModel.getComments(postId),  // 获取该文章所有留言
        PostModel.incPv(),   // pv + 1
    ]).then(result => {
        const [post, comments] = result
        if (!post) {
            req.flash('error', '文章不存在')
            return res.redirect('/posts')
        }
        res.render('post', { posts: [post] , comments })
    }).catch(next)
  })
  
  // GET /posts/:postId/edit 更新文章页
  router.get('/:postId/edit', checkLogin, function (req, res, next) {
      const {postId} = req.params
      PostModel.getRawPostById(postId)
        .then(post => {
            if (!post) {
                throw new Error('文章不存在')
            }
            if (post.author._id.toString() !== req.session.user._id) {
                throw new Error('权限不足')
            }
            res.render('edit', { post })
        })
        .catch(next) 
  })
  
  // POST /posts/:postId/edit 更新一篇文章
  router.post('/:postId/edit', checkLogin, function (req, res, next) {
    const {postId} = req.params
    const author = req.session.user._id
    const {title, content, } = req.fields
    try {
        if (!title.length) {
            throw new Error('标题不能为空')
        }
        if (!content.length) {
            throw new Error('内容不能为空')
        }
    } catch (error) {
        req.flash('error', error.message)
        return res.redirect(`back`)
    }
    PostModel.getRawPostById(postId)
        .then(post => {
            if (!post) {
                throw new Error('文章不存在')
            }
            if (post.author._id.toString() !== req.session.user._id) {
                throw new Error('权限不足')
            }

            PostModel.updatePostById(postId, {title, content})
                .then(result => {
                    req.flash('success', '编辑成功')
                    res.redirect(`/posts/${postId}`)
                })
                .catch(next)
        })
  })
  
  // GET /posts/:postId/remove 删除一篇文章
  router.get('/:postId/remove', checkLogin, function (req, res, next) {
    const {postId} = req.params
    const author = req.session.user._id
    PostModel.getRawPostById(postId)
        .then(post => {
            if (!post) {
                throw new Error('文章不存在')
            }
            // post.author._id 类型为object,所以要转一下
            if (author.toString() !== post.author._id.toString()) {
                throw new Error('没有权限')
            }
            PostModel.delPostById(postId)
                .then(result => {
                    req.flash('success', '删除成功')
                    return res.redirect('/posts')
                })
                .catch(next)
        })
        .catch(next)
  })

module.exports = router