const router = require('express').Router()
const {checkLogin} = require('../middlewares/auth')

const PostModel = require('../modules/posts')

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
        PostModel.incPv(),   // pv + 1
    ]).then(result => {
        const [post] = result
        if (!post) {
            req.flash('error', '文章不存在')
            return res.redirect('/posts')
        }
        res.render('post', { posts: [post] })
    }).catch(next)
  })
  
  // GET /posts/:postId/edit 更新文章页
  router.get('/:postId/edit', checkLogin, function (req, res, next) {
    res.send('更新文章页')
  })
  
  // POST /posts/:postId/edit 更新一篇文章
  router.post('/:postId/edit', checkLogin, function (req, res, next) {
    res.send('更新文章')
  })
  
  // GET /posts/:postId/remove 删除一篇文章
  router.get('/:postId/remove', checkLogin, function (req, res, next) {
    res.send('删除文章')
  })

module.exports = router