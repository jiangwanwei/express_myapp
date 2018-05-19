const {Post} = require('../lib/mongo')
const marked = require('marked')
const CommentModel = require('./comments')

// 将 post 的 content 从 markdown 转换成 html
Post.plugin('contentToHtml', {
    afterFind: results => results.map(post => {
        post.content = marked(post.content)
        return post
    }),
    afterFindOne: result => {
        if (result) {
            result.content = marked(result.content)
        }
        return result
    }
})

// 给 post 添加留言数 commentsCount
Post.plugin('addCommentsCount', {
    afterFind: posts => Promise.all(posts.map(post => CommentModel.getCommentsCount(post._id).then(count => {
        post.commentsCount = count
        return post
    }))),
    afterFindOne: post => {
        if (post) {
            CommentModel.getCommentsCount(post._id).then(count => {
                post.commentsCount = count
                return post
            })
        }
        return post
    }
})

module.exports = {
    // 创建一片文章
    create: post => Post.create(post).exec(),
    // 通过文章 id 获取一篇文章
    getPostById: _id => {
        return Post
            .findOne({ _id })
            .populate({ path: 'author', model: 'User' })
            .addCreateAt()
            .addCommentsCount()
            .contentToHtml()
            .exec()
    },
    // 按创建时间降序获取所有用户文章或者某个特定用户的所有文章
    getPosts: author => {
        const query = {}
        if (author) {
            query.author = author
        }
        return Post
            .find(query)
            .populate({ path: 'author', model: 'User' })
            .sort({ _id: -1 })
            .addCreateAt()
            .addCommentsCount()
            .contentToHtml()
            .exec()

    },
    // 通过文章 id 给 pv 加 1
    incPv: _id => {
        return Post
            .update({ _id }, { $inc: { pv: 1 }})
            .exec()
    },
    // 通过文章 id 获取一篇原生文章（编辑文章）
    getRawPostById: postId => {
        return Post
            .findOne({ _id: postId })
            .populate({ path: 'author', model: 'User'})
            .exec()
    },
    // 通过文章 id 更新一篇文章
    updatePostById: (postId, data) => Post.update({ _id: postId }, { $set: data }).exec(),
    // 通过文章 id 删除一篇文章
    delPostById: postId => Post.deleteOne({ _id: postId }).exec().then(res => {
        // 文章删除后，再删除该文章下的所有留言 res => result: { n: 1, ok: 1 }
        if (res.result.ok && res.result.n > 0) {
            return CommentModel.delCommentsByPostId(postId)
        }
    }),
}